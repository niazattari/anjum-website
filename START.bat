@echo off
title Website - running
echo Starting the API and the website. Two windows will open. Leave both open.
start "Laravel API"  powershell -NoExit -NoProfile -Command "Set-Location '%~dp0backend-app'; & 'C:\xamppp\php\php.exe' artisan serve"
timeout /t 5 /nobreak >nul
start "Website"      powershell -NoExit -NoProfile -Command "Set-Location '%~dp0frontend'; & 'C:\Program Files\nodejs\npm.cmd' run dev"
timeout /t 10 /nobreak >nul
start http://localhost:5173
exit
