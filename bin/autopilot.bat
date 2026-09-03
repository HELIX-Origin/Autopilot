@echo off
setlocal enabledelayedexpansion
set "SCRIPT_DIR=%~dp0"
if exist "%SCRIPT_DIR%..\lib\cli.js" (
  set "TARGET_JS=%SCRIPT_DIR%..\lib\cli.js"
) else if exist "%SCRIPT_DIR%lib\cli.js" (
  set "TARGET_JS=%SCRIPT_DIR%lib\cli.js"
) else (
  set "TARGET_JS=D:\\Projects\\_repositories\\GitHub\\HELIX Origin\\Autopilot\\lib\\cli.js"
)

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
  node "%TARGET_JS%" %*
) else (
  "C:\\nvm4w\\nodejs\\node.exe" "%TARGET_JS%" %*
)
