@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

set "NODE_EXE="
for /f "delims=" %%N in ('where node.exe 2^>nul') do if not defined NODE_EXE set "NODE_EXE=%%N"
if not defined NODE_EXE (
    echo Node.js 22 or newer is required for customer accounts and the admin page.
    echo Install the LTS version from https://nodejs.org/ then restart this launcher.
    start "" "https://nodejs.org/"
    pause
    exit /b 1
)

for /f "delims=." %%V in ('"%NODE_EXE%" -p "process.versions.node" 2^>nul') do set "NODE_MAJOR=%%V"
if not defined NODE_MAJOR (
    echo Could not determine the installed Node.js version.
    pause
    exit /b 1
)
if %NODE_MAJOR% LSS 22 (
    echo Node.js 22 or newer is required. Detected Node.js %NODE_MAJOR%.
    echo Install the LTS version from https://nodejs.org/ then restart this launcher.
    start "" "https://nodejs.org/"
    pause
    exit /b 1
)

set "SERVER_URL=http://localhost:3000"
set "STATUS_FILE=%TEMP%\maekini-server-status-%RANDOM%.txt"
call :checkServer
if "!SERVER_STATUS!"=="401" goto openStore

echo Starting MaeKini account server...
start "MaeKini Account Server" /D "%~dp0" cmd.exe /k ""%NODE_EXE%" server.js"

for /L %%I in (1,1,20) do (
    timeout /t 1 /nobreak >nul
    call :checkServer
    if "!SERVER_STATUS!"=="401" goto openStore
)

echo The MaeKini account server did not start.
echo Check the "MaeKini Account Server" window for the error.
echo If port 3000 is already in use, close the other server and try again.
if exist "%STATUS_FILE%" del "%STATUS_FILE%" >nul 2>nul
pause
exit /b 1

:checkServer
set "SERVER_STATUS="
curl.exe --silent --show-error --output nul --write-out "%%{http_code}" "%SERVER_URL%/api/users" > "%STATUS_FILE%" 2>nul
if exist "%STATUS_FILE%" set /p "SERVER_STATUS="<"%STATUS_FILE%"
exit /b 0

:openStore
if exist "%STATUS_FILE%" del "%STATUS_FILE%" >nul 2>nul
echo MaeKini store is ready.
start "" "%SERVER_URL%/"
exit /b 0
