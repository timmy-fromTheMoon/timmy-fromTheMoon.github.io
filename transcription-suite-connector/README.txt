SUMMIT — LOCAL TRANSCRIPTION CONNECTOR

This small connector links Summit in your browser to TranscriptionSuite running
on YOUR OWN computer. It includes no transcription engine or model. Your audio
is sent only to local loopback addresses on this computer, not to a hosted API.

1. Install TranscriptionSuite using its official platform instructions:
   https://github.com/homelab-00/TranscriptionSuite/blob/541bde94cbd38b51ca79d01faddec0ba9764809c/docs/README.md#2-installation
   Download the official Dashboard from:
   https://github.com/homelab-00/TranscriptionSuite/releases

2. In TranscriptionSuite's Server tab, choose CPU Only and Faster-Whisper
   (WhisperX), or Metal + MLX Whisper on an Apple Silicon Mac. Start the server
   locally on its default HTTP port 9786 and wait for the selected model to load.
   A small multilingual Whisper model is a practical starting point for CPU.
   The upstream app installs its runtime and downloads model weights separately.
   See the official instructions for Docker/Podman and Mac FFmpeg prerequisites.

3. The connector requires Python 3.10 or newer, installed separately from:
   https://www.python.org/downloads/
   No administrator access or Python packages are needed to run the connector.
   Extract this ZIP into an ordinary folder, then:

   Windows: double-click start-windows.cmd. Keep the console window open.
   macOS: double-click start-mac.command. If it is not executable, open Terminal
     in the extracted folder and run: sh start-mac.command
   Linux: open a terminal in the folder and run: sh start-linux.sh
   Any platform: python3 transcription_suite_bridge.py
     (on Windows, use: py -3 transcription_suite_bridge.py)

4. The window prints a pairing code. In Summit, open Settings > Transcription,
   choose TranscriptionSuite, use connector http://127.0.0.1:4787, and paste the
   code. Run the connection check and save. Allow your browser's local-network
   permission if prompted. Keep BOTH the engine and connector running.

The code changes every time you launch the connector. Paste the new code into
Summit after restarting it. Share neither the code nor the connector window.
Press Ctrl+C in that window to stop the connector.

Troubleshooting
- Engine not running: start TranscriptionSuite's local HTTP server on port 9786.
- Engine not ready: wait for model downloads/loading in its Server tab.
- Pairing required: paste the current code from the connector window.
- Port 4787 busy: close the other connector window and launch again.
- Browser cannot connect: allow local-network access for Summit. Check that
  the connector window is still open and the URL is http://127.0.0.1:4787.
- Non-WAV audio on a Mac: install FFmpeg following the upstream instructions,
  then restart the Metal server.
- CPU transcription takes time: try a smaller Whisper model or shorter audio.
- Upload limit: 128 MiB of audio, with up to 64 KiB of multipart form overhead.

For advanced local development only, SUMMIT_TRANSCRIPTION_BACKEND can override
the default backend with another HTTP literal loopback IP and port. Network
hosts, DNS names, URL credentials, query strings, and redirects are rejected.
Use --port 4787 to select the connector port; update Summit's URL if changed.

Licensing and compatibility
This is an independent Python standard-library HTTP connector. It does not
copy, bundle, download, or launch TranscriptionSuite's engine code. Install the
upstream project separately under its GNU GPL v3 license:
https://github.com/homelab-00/TranscriptionSuite/blob/541bde94cbd38b51ca79d01faddec0ba9764809c/LICENSE
API/documentation reference commit: 541bde94cbd38b51ca79d01faddec0ba9764809c.
Later upstream versions may change compatibility. Consult the official project
for its installation requirements and any model-specific licenses.
