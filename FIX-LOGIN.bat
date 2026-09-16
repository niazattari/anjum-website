@echo off
title Fixing the admin login
set PHP=C:\xamppp\php\php.exe
cd /d "%~dp0backend-app"

echo.
echo Publishing the login-token migration...
"%PHP%" artisan vendor:publish --tag=sanctum-migrations --no-interaction

echo.
echo Creating the missing table...
"%PHP%" artisan migrate --force

echo.
echo Done. Go back to your browser and sign in again - nothing needs restarting.
echo.
pause
