#!/usr/bin/env python3
"""Summit's independent, loopback-only connector to a separately installed engine.

Python 3.10+ standard library only. No upstream engine code or model is included.
API compatibility reference: TranscriptionSuite 541bde94cbd38b51ca79d01faddec0ba9764809c.
"""

import argparse
import hmac
import http.client
import ipaddress
import json
import os
import re
import secrets
import socket
import sys
import tempfile
import time
from email.message import Message
from email.parser import BytesParser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit


DEFAULT_BACKEND = "http://127.0.0.1:9786"
DEFAULT_PORT = 4787
MAX_AUDIO_BYTES = 128 * 1024 * 1024
MAX_OVERHEAD_BYTES = 64 * 1024
MAX_BODY_BYTES = MAX_AUDIO_BYTES + MAX_OVERHEAD_BYTES
MAX_RESPONSE_BYTES = 32 * 1024 * 1024
MAX_REJECTED_DRAIN_BYTES = 64 * 1024
REJECTED_DRAIN_TIMEOUT = 0.5
ALLOWED_ORIGINS = frozenset({
    "https://timmy-fromthemoon.github.io",
    "http://127.0.0.1:5185", "http://localhost:5185",
    "http://127.0.0.1:5176", "http://localhost:5176",
    "http://127.0.0.1:5177", "http://localhost:5177",
})
ROUTES = {"/api/status": "GET", "/v1/audio/transcriptions": "POST"}


class InvalidUpload(ValueError):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.status = status


def validate_backend(value):
    """Only literal loopback HTTP addresses; never DNS, redirects, or env proxies."""
    try:
        url = urlsplit(value)
        address = ipaddress.ip_address(url.hostname or "")
        port = url.port if url.port is not None else 80
        if (url.scheme != "http" or not address.is_loopback or url.username is not None
                or url.password is not None or url.path not in ("", "/")
                or url.query or url.fragment or not 1 <= port <= 65535):
            raise ValueError()
    except ValueError:
        raise ValueError("Backend must be an HTTP loopback IP and port, e.g. http://127.0.0.1:9786") from None
    return str(address), port


class MultipartReader:
    """Inspect a spooled multipart body in bounded memory, preserving original bytes."""
    def __init__(self, stream, boundary):
        self.stream = stream
        self.marker = b"\r\n--" + boundary
        self.buffer = b""
        self.eof = False

    def fill(self):
        chunk = self.stream.read(64 * 1024)
        self.buffer += chunk
        self.eof = not chunk

    def line(self):
        while b"\r\n" not in self.buffer:
            if self.eof or len(self.buffer) > 8192:
                raise InvalidUpload("Malformed multipart headers.")
            self.fill()
        line, self.buffer = self.buffer.split(b"\r\n", 1)
        if len(line) > 8192:
            raise InvalidUpload("Multipart headers are too large.")
        return line

    def part_size(self, limit):
        size = 0
        while True:
            index = self.buffer.find(self.marker)
            if index >= 0:
                end = index + len(self.marker)
                while len(self.buffer) < end + 2 and not self.eof:
                    self.fill()
                suffix = self.buffer[end:end + 2]
                if suffix in (b"\r\n", b"--"):
                    size += index
                    if size > limit:
                        raise InvalidUpload("Audio exceeds 128 MiB or multipart fields are too large.", 413)
                    self.buffer = self.buffer[end + 2:]
                    return size, suffix == b"--"
                # An audio byte sequence resembling a boundary is ordinary data.
                take = index + 2
            else:
                take = max(0, len(self.buffer) - len(self.marker) - 2)
            size += take
            if size > limit:
                raise InvalidUpload("Audio exceeds 128 MiB or multipart fields are too large.", 413)
            self.buffer = self.buffer[take:]
            if self.eof:
                raise InvalidUpload("Multipart upload is incomplete.")
            self.fill()


def validate_multipart(stream, content_type, body_size):
    content = Message()
    content["Content-Type"] = content_type
    boundary = content.get_param("boundary")
    if (content.get_content_type() != "multipart/form-data" or not isinstance(boundary, str)
            or not re.fullmatch(r"[0-9A-Za-z'()+_,./:=? -]{1,70}", boundary)
            or boundary.endswith(" ")):
        raise InvalidUpload("Send a multipart/form-data upload with a valid boundary.")
    reader = MultipartReader(stream, boundary.encode("ascii"))
    if reader.line() != b"--" + boundary.encode("ascii"):
        raise InvalidUpload("Malformed multipart upload.")
    audio_size = None
    for _ in range(16):
        header_lines = []
        header_size = 0
        while True:
            line = reader.line()
            if not line:
                break
            header_size += len(line) + 2
            if header_size > 8192:
                raise InvalidUpload("Multipart headers are too large.")
            header_lines.append(line)
        headers = BytesParser().parsebytes(b"\r\n".join(header_lines) + b"\r\n\r\n")
        if headers.defects or len(headers.get_all("Content-Disposition", [])) != 1:
            raise InvalidUpload("Malformed multipart part.")
        name = headers.get_param("name", header="Content-Disposition")
        filename = headers.get_param("filename", header="Content-Disposition")
        if (headers.get_content_disposition() != "form-data" or not name
                or headers.get("Content-Transfer-Encoding")):
            raise InvalidUpload("Invalid multipart form field.")
        is_audio = name == "file" and filename is not None
        if filename is not None and not is_audio:
            raise InvalidUpload("Only the file audio attachment is supported.")
        if name == "file" and (not is_audio or audio_size is not None or not filename):
            raise InvalidUpload("Provide exactly one audio file.")
        size, finished = reader.part_size(MAX_AUDIO_BYTES if is_audio else MAX_OVERHEAD_BYTES)
        if is_audio:
            audio_size = size
        if finished:
            # A browser FormData body ends with the delimiter and optional CRLF.
            tail = reader.buffer + stream.read(MAX_OVERHEAD_BYTES + 1)
            if tail not in (b"", b"\r\n"):
                raise InvalidUpload("Unexpected data after multipart upload.")
            if audio_size is None or audio_size == 0:
                raise InvalidUpload("Provide one nonempty audio file.")
            if body_size - audio_size > MAX_OVERHEAD_BYTES:
                raise InvalidUpload("Multipart fields and headers exceed 64 KiB.", 413)
            stream.seek(0)
            return
    raise InvalidUpload("Too many multipart fields.")


class BridgeServer(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, port=DEFAULT_PORT, backend=DEFAULT_BACKEND, pairing_code=None):
        self.backend_host, self.backend_port = validate_backend(backend)
        self.pairing_code = pairing_code or secrets.token_urlsafe(24)
        if not re.fullmatch(r"[A-Za-z0-9_-]{16,128}", self.pairing_code):
            raise ValueError("Pairing code must contain 16–128 letters, digits, underscores, or hyphens.")
        super().__init__(("127.0.0.1", port), BridgeHandler)


class BridgeHandler(BaseHTTPRequestHandler):
    server_version = "SummitLocalConnector/1"
    sys_version = ""

    def setup(self):
        super().setup()
        self.connection.settimeout(60)
        self.body_consumed = False

    def log_message(self, *_args):
        # Never log URLs, headers, pairing codes, filenames, audio, or transcripts.
        pass

    def finish(self):
        try:
            super().finish()
        except (BrokenPipeError, ConnectionResetError):
            pass

    def reply(self, status, payload, cors=True, extra=None):
        data = payload if isinstance(payload, bytes) else json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Vary", "Origin")
        origin = self.headers.get("Origin")
        if cors and origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
        for key, value in (extra or {}).items():
            self.send_header(key, value)
        self.send_header("Connection", "close")
        self.end_headers()
        if self.command != "HEAD":
            try:
                self.wfile.write(data)
            except (BrokenPipeError, ConnectionResetError):
                pass
        self.close_connection = True

    def error(self, status, code, message, cors=True):
        self.drain_rejected_body()
        self.reply(status, {"error": {"code": code, "message": message}}, cors=cors)

    def drain_rejected_body(self):
        # Closing with unread incoming bytes can reset the socket on Windows,
        # hiding the JSON error from a browser. Consume only small, unambiguous
        # bodies; never let an unauthenticated peer make us drain a large upload.
        if self.body_consumed or self.headers.get("Transfer-Encoding"):
            return
        lengths = self.headers.get_all("Content-Length", [])
        if len(lengths) != 1 or not re.fullmatch(r"[0-9]{1,10}", lengths[0]):
            return
        length = int(lengths[0])
        if not 0 < length <= MAX_REJECTED_DRAIN_BYTES:
            return
        previous_timeout = self.connection.gettimeout()
        try:
            deadline = time.monotonic() + REJECTED_DRAIN_TIMEOUT
            remaining = length
            while remaining:
                timeout = deadline - time.monotonic()
                if timeout <= 0:
                    break
                self.connection.settimeout(timeout)
                # read1 performs at most one underlying read. A buffered read
                # of the entire body could reset the timeout on every trickle.
                chunk = self.rfile.read1(min(8192, remaining))
                if not chunk:
                    break
                remaining -= len(chunk)
        except (TimeoutError, ConnectionError, OSError):
            pass
        finally:
            self.body_consumed = True
            self.connection.settimeout(previous_timeout)

    def guard(self, preflight=False):
        port = self.server.server_port
        if (len(self.headers.get_all("Host", [])) != 1
                or self.headers.get("Host") not in {f"127.0.0.1:{port}", f"localhost:{port}"}):
            self.error(403, "invalid_host", "Use the connector's loopback address.", cors=False)
            return False
        origins = self.headers.get_all("Origin", [])
        if len(origins) > 1 or (origins and origins[0] not in ALLOWED_ORIGINS) or (preflight and not origins):
            self.error(403, "origin_denied", "This website is not allowed to use the connector.", cors=False)
            return False
        if "?" in self.path or "#" in self.path:
            self.error(400, "query_denied", "Query strings and URL credentials are not supported.")
            return False
        if self.path not in ROUTES:
            self.error(404, "route_not_found", "This connector only supports status and audio transcription.")
            return False
        if not preflight:
            expected = "Bearer " + self.server.pairing_code
            authorization = self.headers.get_all("Authorization", [])
            if len(authorization) != 1 or not hmac.compare_digest(authorization[0].encode(), expected.encode()):
                self.error(401, "pairing_required", "Paste the pairing code from the connector window into Summit Settings → Transcription.")
                return False
        return True

    def do_OPTIONS(self):
        if not self.guard(preflight=True):
            return
        method = self.headers.get("Access-Control-Request-Method", "")
        requested = {part.strip().lower() for part in self.headers.get("Access-Control-Request-Headers", "").split(",") if part.strip()}
        if method != ROUTES[self.path] or not requested.issubset({"authorization", "content-type"}):
            self.error(403, "preflight_denied", "Only the required connector method and headers are allowed.")
            return
        extra = {
            "Access-Control-Allow-Methods": method,
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
            "Access-Control-Max-Age": "600",
        }
        if self.headers.get("Access-Control-Request-Private-Network") == "true":
            extra["Access-Control-Allow-Private-Network"] = "true"
        self.reply(204, b"", extra=extra)

    def do_GET(self):
        self.handle_api()

    def do_POST(self):
        self.handle_api()

    def do_HEAD(self):
        self.handle_api()

    def do_PUT(self):
        self.handle_api()

    def do_DELETE(self):
        self.handle_api()

    def handle_api(self):
        if not self.guard():
            return
        if self.command != ROUTES[self.path]:
            self.error(405, "method_denied", "This method is not supported for this route.")
            return
        if self.headers.get("Transfer-Encoding"):
            self.error(400, "invalid_length", "Chunked uploads are not supported; use browser FormData.")
            return
        lengths = self.headers.get_all("Content-Length", [])
        if len(lengths) > 1 or (lengths and not re.fullmatch(r"[0-9]{1,10}", lengths[0])):
            self.error(400, "invalid_length", "Provide a valid Content-Length.")
            return
        length = int(lengths[0]) if lengths else 0
        if self.command == "GET":
            if length:
                self.error(400, "unexpected_body", "Status requests must not contain a body.")
                return
            self.forward(None, 0)
            return
        if not lengths or length <= 0:
            self.error(411, "length_required", "Provide a nonempty FormData body with Content-Length.")
            return
        if length > MAX_BODY_BYTES:
            self.error(413, "upload_too_large", "Audio must be at most 128 MiB, with at most 64 KiB of form fields and headers.")
            return
        types = self.headers.get_all("Content-Type", [])
        if len(types) != 1:
            self.error(400, "invalid_upload", "Provide one multipart/form-data Content-Type.")
            return
        try:
            # TemporaryFile is private and is removed on close, including failures.
            with tempfile.TemporaryFile() as upload:
                remaining = length
                while remaining:
                    chunk = self.rfile.read(min(64 * 1024, remaining))
                    if not chunk:
                        raise InvalidUpload("The audio upload was interrupted.")
                    upload.write(chunk)
                    remaining -= len(chunk)
                self.body_consumed = True
                upload.seek(0)
                validate_multipart(upload, types[0], length)
                self.forward(upload, length)
        except InvalidUpload as error:
            self.error(error.status, "invalid_upload", str(error))
        except (TimeoutError, ConnectionError, OSError):
            self.error(408, "upload_interrupted", "The audio upload was interrupted. Please try again.")

    def forward(self, body, length):
        timeout = 1800 if self.command == "POST" else 10
        connection = http.client.HTTPConnection(self.server.backend_host, self.server.backend_port, timeout=timeout)
        headers = {"Origin": "http://localhost", "Accept": "application/json"}
        if body is not None:
            headers.update({"Content-Type": self.headers["Content-Type"], "Content-Length": str(length)})
        try:
            connection.request(self.command, self.path, body=body, headers=headers)
            response = connection.getresponse()
            data = response.read(MAX_RESPONSE_BYTES + 1)
            if len(data) > MAX_RESPONSE_BYTES:
                self.error(502, "invalid_backend_response", "The engine returned an oversized response.")
                return
            try:
                json.loads(data)
            except (ValueError, UnicodeDecodeError):
                self.error(502, "invalid_backend_response", "The local engine did not return JSON. Check that TranscriptionSuite is running on port 9786.")
                return
            # Do not forward redirects, cookies, auth headers, or other upstream headers.
            if 300 <= response.status < 400:
                self.error(502, "invalid_backend_response", "The local engine redirected the request. Use its local HTTP server.")
                return
            self.reply(response.status, data)
        except (TimeoutError, socket.timeout):
            self.error(504, "backend_timeout", "TranscriptionSuite did not finish in time. Check its Server tab and try a shorter recording.")
        except (OSError, http.client.HTTPException):
            self.error(503, "backend_not_running", "Start TranscriptionSuite on this computer, start its local server on port 9786, and wait for the Whisper model to load.")
        finally:
            connection.close()


def main(argv=None):
    parser = argparse.ArgumentParser(description="Connect Summit to TranscriptionSuite on your own computer. Requires Python 3.10+; keep this window open.")
    if sys.version_info < (3, 10):
        parser.exit(1, "Python 3.10 or newer is required. Install it from https://www.python.org/downloads/\n")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="loopback connector port (default: 4787)")
    args = parser.parse_args(argv)
    if not 1 <= args.port <= 65535:
        parser.error("--port must be between 1 and 65535")
    try:
        server = BridgeServer(args.port, os.environ.get("SUMMIT_TRANSCRIPTION_BACKEND", DEFAULT_BACKEND))
    except (ValueError, OSError) as error:
        parser.exit(1, f"Could not start connector: {error}\nIf port {args.port} is busy, close the other connector window and retry.\n")
    print(f"\nSummit local transcription connector: http://127.0.0.1:{server.server_port}", flush=True)
    print(f"Pairing code: {server.pairing_code}", flush=True)
    print("Paste this code into Summit Settings → Transcription. It changes each launch.", flush=True)
    print("Keep this window open. Press Ctrl+C to stop. Audio stays on this computer.\n", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nConnector stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
