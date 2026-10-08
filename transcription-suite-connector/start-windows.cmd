@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 (
  py -3 transcription_suite_bridge.py
  goto finished
)
where python >nul 2>nul
if not errorlevel 1 (
  python transcription_suite_bridge.py
  goto finished
)
echo Python 3.10 or newer is required. Install it from https://www.python.org/downloads/
echo Select Add Python to PATH during installation, then reopen this file.
:finished
pause
