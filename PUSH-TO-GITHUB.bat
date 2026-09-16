@echo off
setlocal enabledelayedexpansion
title Push ANJUM to GitHub
cd /d "%~dp0"

echo.
echo  ================================================================
echo    PUT YOUR PROJECT ON GITHUB
echo  ================================================================
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo  Git is not installed.
  echo.
  echo  Download it from https://git-scm.com/download/win , install it
  echo  with all the default options, then run this file again.
  echo.
  pause
  exit /b 1
)

if not exist ".gitignore" (
  echo  [STOP] .gitignore is missing. Without it this would upload your
  echo         admin password. Ask Claude to put it back.
  pause
  exit /b 1
)

if not exist ".git" (
  echo  [....] starting a new repository here
  git init -q
  git branch -M main
)

git add -A

echo  [....] checking that no password is about to be uploaded
git ls-files > "%TEMP%\anjum-tracked.txt"
set LEAK=0
findstr /I /C:"ADMIN-LOGIN.txt" "%TEMP%\anjum-tracked.txt" >nul && set LEAK=1
findstr /I /C:"setup-log.txt" "%TEMP%\anjum-tracked.txt" >nul && set LEAK=1
findstr /R /C:"\.env$" "%TEMP%\anjum-tracked.txt" >nul && set LEAK=1
findstr /R /C:"\.env\.production$" "%TEMP%\anjum-tracked.txt" >nul && set LEAK=1
del "%TEMP%\anjum-tracked.txt" >nul 2>&1

if "!LEAK!"=="1" (
  echo.
  echo  ================================================================
  echo    STOPPED - a file containing passwords was about to be sent
  echo  ================================================================
  echo.
  echo  Nothing has been uploaded. Tell Claude you saw this message.
  echo.
  git reset -q
  pause
  exit /b 1
)
echo  [done] no credential files are being sent
echo.

git remote get-url origin >nul 2>&1
if errorlevel 1 (
  echo  ----------------------------------------------------------------
  echo   Now create the repository on GitHub:
  echo.
  echo      1. Open   https://github.com/new
  echo      2. Repository name:   anjum-website
  echo      3. Choose  PRIVATE.  This matters - you sell this source
  echo         code, and a public repo gives it away for free.
  echo      4. Do NOT tick "Add a README file".
  echo      5. Click "Create repository", then copy the address shown,
  echo         which looks like:
  echo            https://github.com/yourname/anjum-website.git
  echo  ----------------------------------------------------------------
  echo.
  set /p "REPOURL=  Paste the address here and press Enter: "
  if "!REPOURL!"=="" (
    echo.
    echo  No address given. Nothing was uploaded.
    pause
    exit /b 1
  )
  git remote add origin !REPOURL!
)

git commit -q -m "ANJUM website: React frontend, Laravel API, admin panel" 2>nul
if errorlevel 1 echo  [....] nothing new to commit - pushing what is already here

echo.
echo  [....] uploading. A browser or a sign-in box may appear - log in
echo         to GitHub there.
echo.
git push -u origin main
if errorlevel 1 (
  echo.
  echo  The upload failed. Copy the message above and send it to Claude.
  pause
  exit /b 1
)

echo.
echo  ================================================================
echo    DONE - your code is on GitHub
echo.
echo    Now connect it to Vercel so every push publishes itself:
echo       1. Open   https://vercel.com/new
echo       2. Import the  anjum-website  repository
echo       3. IMPORTANT - set "Root Directory" to:   frontend
echo       4. Click Deploy
echo.
echo    After that you never run a deploy script again: push your
echo    changes and the live site updates itself.
echo  ================================================================
echo.
pause
