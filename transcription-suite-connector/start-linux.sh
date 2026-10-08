#!/bin/sh
cd "$(dirname "$0")" || exit 1
if ! command -v python3 >/dev/null 2>&1; then
  printf '%s\n' 'Python 3.10 or newer is required. Install Python using your distribution package manager.'
  exit 1
fi
exec python3 transcription_suite_bridge.py
