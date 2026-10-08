#!/bin/sh
cd "$(dirname "$0")" || exit 1
if ! command -v python3 >/dev/null 2>&1; then
  printf '%s\n' 'Python 3.10 or newer is required. Install it from https://www.python.org/downloads/'
else
  python3 transcription_suite_bridge.py
fi
printf '%s' 'Press Enter to close this window. '
read -r answer
