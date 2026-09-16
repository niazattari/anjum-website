@echo off
setlocal enabledelayedexpansion
title Publish ANJUM to the web (free)
cd /d "%~dp0frontend"

echo.
echo  ================================================================
echo    PUBLISHING YOUR SITE - FREE HOSTING ON VERCEL
echo  ================================================================
echo.

rem --- Find the Vercel tool, installing it once if it is not here yet. ---
rem     Installing it globally is worth the one minute: npx re-downloads the
rem     whole tool every single run otherwise.
set "VC=vercel"
where vercel >nul 2>&1
if errorlevel 1 (
  echo  [....] installing the Vercel tool. One time only, about a minute.
  call npm install -g vercel --silent
  where vercel >nul 2>&1
  if errorlevel 1 set "VC=npx --yes vercel@latest"
)

rem --- Log in. The CLI keeps its own login, separate from your browser, so
rem     being signed in on vercel.com does not count here. ---
echo  [....] checking whether you are logged in
call !VC! whoami >nul 2>&1
if errorlevel 1 (
  echo.
  echo  ----------------------------------------------------------------
  echo   You are not logged in to Vercel on this computer yet.
  echo.
  echo   In a moment you will see a short list. Use the ARROW KEYS to
  echo   pick "Continue with GitHub" ^(or Email^) and press Enter.
  echo   A browser opens - approve it there, then come back here.
  echo  ----------------------------------------------------------------
  echo.
  pause
  call !VC! login
  echo.
  call !VC! whoami >nul 2>&1
  if errorlevel 1 (
    echo.
    echo  Still not logged in. Nothing was published.
    echo  Try running this file again, or tell Claude what you saw.
    echo.
    pause
    exit /b 1
  )
)

for /f "delims=" %%A in ('call !VC! whoami 2^>nul') do set "WHO=%%A"
echo  [done] logged in as !WHO!
echo.

echo  ----------------------------------------------------------------
echo   Now it will ask a few questions. Answer them like this:
echo.
echo      Set up and deploy?          Y
echo      Which scope?                your own name
echo      Link to existing project?   N
echo      Project name?               anjum
echo      In which directory?         just press Enter
echo      Modify settings?            N
echo.
echo   Then it builds for a minute or two. Leave it alone.
echo  ----------------------------------------------------------------
echo.
pause

call !VC! deploy --prod
if errorlevel 1 (
  echo.
  echo  --------------------------------------------------------------
  echo   Something went wrong above. Copy the red text and send it to
  echo   Claude - the fix is usually one line.
  echo  --------------------------------------------------------------
  echo.
  pause
  exit /b 1
)

echo.
echo  ================================================================
echo    DONE - your site is live
echo.
echo    The address is printed above, ending in .vercel.app
echo    Copy it. That is your website address - put it on your
echo    WhatsApp channel, Fiverr profile and LinkedIn.
echo.
echo    To publish changes later, just run this file again.
echo  ================================================================
echo.
pause
