@echo off
REM ============================================================
REM ESTIM-APP - Compilation Complete (Web + Android)
REM ============================================================
REM This script builds the complete application:
REM 1. npm run build (generates web assets)
REM 2. capacitor sync android (syncs with Android)
REM 3. gradlew.bat assembleDebug (builds APK)
REM ============================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ============================================================
echo ESTIM-APP - Full Build Process
echo ============================================================
echo.

REM Get to project root
cd ..\..

echo [1/3] Building Web Assets (npm run build)...
echo.
call C:\nvm4w\nodejs\npm.cmd run build
if !ERRORLEVEL! neq 0 (
    echo ERROR: Web build failed!
    exit /b 1
)

echo.
echo [2/3] Syncing Capacitor with Android...
echo.
call C:\nvm4w\nodejs\npx.cmd capacitor sync android
if !ERRORLEVEL! neq 0 (
    echo ERROR: Capacitor sync failed!
    exit /b 1
)

echo.
echo [3/3] Building Android APK...
echo.
cd android
call .\gradlew.bat assembleDebug --no-daemon
if !ERRORLEVEL! neq 0 (
    echo ERROR: Android build failed!
    exit /b 1
)

echo.
echo ============================================================
echo BUILD SUCCESSFUL!
echo APK Location: app\build\outputs\apk\debug\app-debug.apk
echo ============================================================
echo.
pause
endlocal
