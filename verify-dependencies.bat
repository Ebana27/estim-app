@echo off
REM ============================================================
REM ESTIM-APP - Verify Dependencies
REM ============================================================

setlocal enabledelayedexpansion
color 0A

echo.
echo ============================================================
echo ESTIM-APP - Dependency Verification
echo ============================================================
echo.

set "errors=0"

REM Check Node.js
echo Checking Node.js...
where node > nul 2>&1
if !ERRORLEVEL! equ 0 (
    for /f "tokens=*" %%i in ('node --version 2^>nul') do set "node_version=%%i"
    echo   ✓ Node.js !node_version! found
) else (
    echo   ✗ Node.js NOT found (required: v22+^)
    set "errors=1"
)

REM Check npm
echo Checking npm...
where npm > nul 2>&1
if !ERRORLEVEL! equ 0 (
    for /f "tokens=*" %%i in ('npm --version 2^>nul') do set "npm_version=%%i"
    echo   ✓ npm !npm_version! found
) else (
    echo   ✗ npm NOT found
    set "errors=1"
)

REM Check Java
echo Checking Java...
where java > nul 2>&1
if !ERRORLEVEL! equ 0 (
    for /f "tokens=*" %%i in ('java -version 2^>^&1 ^| findstr "version"') do set "java_version=%%i"
    echo   ✓ Java found: !java_version!
) else (
    echo   ✗ Java NOT found (required: JDK 17+^)
    set "errors=1"
)

REM Check Android SDK
echo Checking Android SDK...
if exist "%LOCALAPPDATA%\Android\Sdk" (
    echo   ✓ Android SDK found at %LOCALAPPDATA%\Android\Sdk
) else (
    echo   ✗ Android SDK NOT found
    echo     Expected location: %LOCALAPPDATA%\Android\Sdk
    set "errors=1"
)

REM Check Gradle wrapper
echo Checking Gradle wrapper...
if exist "android\gradlew.bat" (
    echo   ✓ Gradle wrapper found
) else (
    echo   ✗ Gradle wrapper NOT found
    set "errors=1"
)

REM Check local.properties
echo Checking Android local.properties...
if exist "android\local.properties" (
    echo   ✓ local.properties found
) else (
    echo   ✗ local.properties NOT found (will be auto-created^)
)

REM Check dist directory
echo Checking dist directory...
if exist "dist\index.html" (
    echo   ✓ Web build assets found
) else (
    echo   ! Web build assets NOT found (run 'npm run build' first^)
)

echo.
if !errors! equ 0 (
    echo ============================================================
    echo ✓ All dependencies are installed!
    echo ============================================================
    echo.
    echo You can now run:
    echo   - npm run build       ^(build web assets^)
    echo   - .\build-complete.bat  ^(full build^)
    echo.
) else (
    echo ============================================================
    echo ✗ Missing dependencies detected!
    echo ============================================================
    echo.
    echo Please install missing components from BUILD_GUIDE.md
    echo.
)

pause
endlocal
