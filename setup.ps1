$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $root

$logPath = Join-Path $root 'setup-log.txt'
try { Start-Transcript -Path $logPath -Force | Out-Null } catch { }

function Head($t) {
  Write-Host ""
  Write-Host ("-" * 66) -ForegroundColor DarkCyan
  Write-Host "  $t" -ForegroundColor Cyan
  Write-Host ("-" * 66) -ForegroundColor DarkCyan
}
function Ok($t)   { Write-Host "  [done] $t" -ForegroundColor Green }
function Info($t) { Write-Host "  [....] $t" -ForegroundColor Gray }
function Warn($t) { Write-Host "  [warn] $t" -ForegroundColor Yellow }
function Die($t) {
  Write-Host ""
  Write-Host "  ================================================================" -ForegroundColor Red
  Write-Host "   SETUP STOPPED" -ForegroundColor Red
  Write-Host "  ================================================================" -ForegroundColor Red
  foreach ($line in ($t -split "`n")) { Write-Host "   $line" -ForegroundColor Red }
  Write-Host ""
  Write-Host "   Full log saved to setup-log.txt - Claude can read it directly." -ForegroundColor Yellow
  Write-Host ""
  try { Stop-Transcript | Out-Null } catch { }
  Read-Host "Press Enter to close"
  exit 1
}
function Which($n, $alts) {
  $c = Get-Command $n -ErrorAction SilentlyContinue
  if ($c) { return $c.Source }
  foreach ($a in $alts) { if (Test-Path $a) { return $a } }
  return $null
}
function PhpVersionOf($exe) {
  $v = (& $exe -r "echo PHP_VERSION;") 2>&1
  return "$v".Trim()
}
function IsAtLeast82($verString) {
  $p = "$verString" -split '\.'
  if ($p.Count -lt 2) { return $false }
  $maj = [int]($p[0] -replace '[^0-9]','')
  $min = [int]($p[1] -replace '[^0-9]','')
  return ($maj -gt 8) -or ($maj -eq 8 -and $min -ge 2)
}

Write-Host ""
Write-Host "  WEBSITE SETUP" -ForegroundColor White
Write-Host "  Everything is logged to setup-log.txt" -ForegroundColor Gray

# ---------------------------------------------------------------- 1
Head "STEP 1 of 9   Checking your tools"

$npm = Which 'npm' @()
if (-not $npm) { Die "Node.js is not installed.`nInstall the LTS build from https://nodejs.org, then run this again." }
Ok "node      $((& node -v) 2>&1)"

$php = Which 'php' @('C:\xampp\php\php.exe')
if (-not $php) { Die "PHP was not found.`nExpected C:\xampp\php\php.exe. Is XAMPP installed?" }
$phpVer = PhpVersionOf $php
Ok "php       $php  (version $phpVer)"

# Laravel needs PHP 8.2+. XAMPP often ships 8.0 or 8.1. Rather than making you
# reinstall XAMPP - which would disturb the MySQL that is already working -
# fetch a modern PHP just for this project and leave XAMPP alone.
$privatePhpDir = Join-Path $env:LOCALAPPDATA 'php-for-laravel'
$privatePhp = Join-Path $privatePhpDir 'php.exe'

if (-not (IsAtLeast82 $phpVer)) {
  Warn "PHP $phpVer is too old for Laravel, which needs 8.2 or newer."

  if ((Test-Path $privatePhp) -and (IsAtLeast82 (PhpVersionOf $privatePhp))) {
    $php = $privatePhp
    $phpVer = PhpVersionOf $php
    Ok "using the PHP installed earlier: $php ($phpVer)"
  } else {
    Info "downloading a modern PHP just for this project (about 30 MB)"
    Info "XAMPP is left untouched - its PHP and MySQL keep working as they are"

    try { $listing = (Invoke-WebRequest -UseBasicParsing 'https://windows.php.net/downloads/releases/').Content }
    catch { Die "Could not reach windows.php.net to download PHP.`nCheck your internet connection and run this again." }

    $best = $null; $bestVer = [version]'0.0.0'
    foreach ($m in [regex]::Matches($listing, 'php-8\.[2-9]\.\d+-nts-Win32-vs\d+-x64\.zip')) {
      if ($m.Value -match 'php-(\d+\.\d+\.\d+)-nts') {
        $v = [version]$matches[1]
        if ($v -gt $bestVer) { $bestVer = $v; $best = $m.Value }
      }
    }
    if (-not $best) { Die "Could not find a PHP 8.2+ build on windows.php.net.`nDownload PHP 8.3 x64 Non-Thread-Safe manually, unzip it to`n$privatePhpDir, then run this again." }

    $url = "https://windows.php.net/downloads/releases/$best"
    $zip = Join-Path $env:TEMP $best
    Info "getting $best"
    try { Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile $zip }
    catch { Die "The PHP download failed.`n$url" }

    if (Test-Path $privatePhpDir) { Remove-Item $privatePhpDir -Recurse -Force -ErrorAction SilentlyContinue }
    New-Item -ItemType Directory -Path $privatePhpDir -Force | Out-Null
    Expand-Archive -Path $zip -DestinationPath $privatePhpDir -Force
    Remove-Item $zip -ErrorAction SilentlyContinue

    if (-not (Test-Path $privatePhp)) { Die "The PHP archive unpacked but php.exe is not where expected." }

    # A fresh PHP zip has no php.ini and every extension switched off.
    $extDir = Join-Path $privatePhpDir 'ext'
    $ini = @"
; Written by the project setup script.
extension_dir = "$extDir"
extension=openssl
extension=pdo_mysql
extension=mysqli
extension=mbstring
extension=curl
extension=zip
extension=fileinfo
extension=gd
extension=exif
extension=intl
memory_limit = 512M
date.timezone = Asia/Karachi
"@
    Set-Content (Join-Path $privatePhpDir 'php.ini') $ini -Encoding ASCII

    $php = $privatePhp
    $phpVer = PhpVersionOf $php
    Ok "PHP $phpVer installed at $privatePhpDir"
  }
}

if (-not (IsAtLeast82 $phpVer)) { Die "Still on PHP $phpVer after the upgrade attempt." }
Ok "          PHP $phpVer is new enough for Laravel"

# A stock php.ini ships with most extensions commented out. Rather than asking
# you to hand-edit it, switch the needed ones on here and check the result.
$needExts = @('openssl','curl','zip','mbstring','fileinfo','pdo_mysql')
# Not used by this project, but Laravel's own post-install step pokes at sqlite.
# Switching it on keeps that step quiet. Its absence is never fatal.
$niceExts = @('pdo_sqlite')

function MissingFrom($exe, $list) {
  $raw = (& $exe -r "echo implode(',', get_loaded_extensions());") 2>&1
  $have = @()
  foreach ($e in ("$raw" -split ',')) { $have += $e.Trim().ToLower() }
  $m = @()
  foreach ($need in $list) { if ($have -notcontains $need) { $m += $need } }
  return ,$m
}

$missing = MissingFrom $php ($needExts + $niceExts)
if ($missing.Count -gt 0) {
  $iniPath = "$((& $php -r "echo php_ini_loaded_file();") 2>&1)".Trim()
  Info "switching on PHP extensions: $($missing -join ', ')"
  $wrote = $false
  if ($iniPath -and (Test-Path $iniPath)) {
    try {
      Copy-Item $iniPath "$iniPath.backup-before-setup" -Force -ErrorAction SilentlyContinue
      $lines = @(Get-Content $iniPath)
      $out = @()
      $done = @{}
      foreach ($line in $lines) {
        $newLine = $line
        foreach ($need in $missing) {
          $pat = '^\s*;\s*extension\s*=\s*(php_)?' + $need + '(\.dll)?\s*$'
          if ($line -match $pat) { $newLine = "extension=$need"; $done[$need] = $true }
        }
        $out += $newLine
      }
      foreach ($need in $missing) {
        if (-not $done.ContainsKey($need)) { $out += "extension=$need" }
      }
      Set-Content -Path $iniPath -Value $out -Encoding ASCII
      $wrote = $true
      Info "edited $iniPath (a copy of the original is beside it, named .backup-before-setup)"
    } catch {
      $wrote = $false
    }
  }
}

# Only the genuinely required ones decide whether setup can continue.
$missing = MissingFrom $php $needExts

if ($missing.Count -gt 0) {
  $iniPath = "$((& $php -r "echo php_ini_loaded_file();") 2>&1)".Trim()
  Die @"
These PHP extensions are still switched off: $($missing -join ', ')

I tried to switch them on for you and could not - most likely this window
does not have permission to write to php.ini.

Two ways to fix it, either is fine:

  A. Right-click SETUP.bat and choose 'Run as administrator'.

  B. Open the XAMPP Control Panel, click Config next to Apache, choose
     PHP (php.ini), and in the file that opens find each line below and
     delete the semicolon at the start of it:
$(($missing | ForEach-Object { "         ;extension=$_" }) -join "`n")
     Save the file, close it, and run SETUP.bat again.

The file being edited is:
  $iniPath
"@
}
Ok "          required PHP extensions are all on"

# XAMPP is not always at C:\xampp - find MySQL next to the PHP we are using.
$phpParent = Split-Path (Split-Path $php -Parent) -Parent
$mysqlCandidates = @()
if ($phpParent) { $mysqlCandidates += (Join-Path $phpParent 'mysql\bin\mysql.exe') }
$mysqlCandidates += @(
  'C:\xampp\mysql\bin\mysql.exe',
  'C:\xamppp\mysql\bin\mysql.exe',
  'D:\xampp\mysql\bin\mysql.exe',
  'C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe',
  'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe')
$mysql = Which 'mysql' $mysqlCandidates
if (-not $mysql) {
  Die @"
No MySQL client found.

Looked in:
$(($mysqlCandidates | ForEach-Object { "  $_" }) -join "`n")

Start MySQL from the XAMPP Control Panel and run SETUP.bat again. If your
XAMPP is installed somewhere else, tell Claude where and it will adjust this.
"@
}
Ok "mysql     $mysql"

# Composer must run under the NEW php, so always use composer.phar here.
$composerPhar = Join-Path $root 'composer.phar'
if (-not (Test-Path $composerPhar)) {
  Info "downloading Composer"
  & $php -r "copy('https://getcomposer.org/installer','composer-setup.php');"
  if (-not (Test-Path "$root\composer-setup.php")) { Die "Could not download Composer." }
  & $php composer-setup.php --quiet --install-dir="$root" --filename=composer.phar
  Remove-Item "$root\composer-setup.php" -ErrorAction SilentlyContinue
  if (-not (Test-Path $composerPhar)) { Die "Composer could not be installed." }
}
Ok "composer  $composerPhar"

function Composer-Run($argList) {
  # Out-Host matters. Without it, everything Composer prints is swallowed into
  # this function's return value, so the caller gets an array of output lines
  # instead of an exit code - and every check against it reads as a failure
  # even when Composer worked perfectly. Out-Host sends the text to the screen
  # and leaves the pipeline empty, so only the exit code comes back.
  & $php $composerPhar @argList 2>&1 | Out-Host
  $code = $LASTEXITCODE
  if ($null -eq $code) { $code = 0 }
  return [int]$code
}

# ---------------------------------------------------------------- 2
Head "STEP 2 of 9   Connecting to MySQL"

$listening = $false
try { $t = New-Object System.Net.Sockets.TcpClient; $t.Connect('127.0.0.1', 3306); $listening = $true; $t.Close() } catch { }
if (-not $listening) { Die "Nothing is listening on port 3306.`nStart MySQL in the XAMPP Control Panel and run this again." }
Ok "MySQL is answering on port 3306"

$dbPass = ''
$null = & $mysql -u root -e "SELECT 1;" 2>&1
if ($LASTEXITCODE -eq 0) {
  Ok "connected as root with no password - this is the XAMPP MySQL"
} else {
  Warn "root with a blank password was refused - another MySQL may hold port 3306."
  $dbPass = Read-Host "  MySQL root password (or Enter to stop)"
  if ($dbPass -eq '') { Die "No password given." }
  $null = & $mysql -u root "-p$dbPass" -e "SELECT 1;" 2>&1
  if ($LASTEXITCODE -ne 0) { Die "MySQL refused that password." }
  Ok "connected as root with your password"
}

$mysqlArgs = @('-u','root')
if ($dbPass -ne '') { $mysqlArgs += "-p$dbPass" }
& $mysql @mysqlArgs -e "CREATE DATABASE IF NOT EXISTS studio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { Die "Could not create the database 'studio'." }
Ok "database 'studio' is ready"

# ---------------------------------------------------------------- 3
Head "STEP 3 of 9   Website packages"

if (Test-Path "$root\frontend\node_modules\vite") {
  Ok "already installed - skipping"
} else {
  Push-Location "$root\frontend"
  & $npm install --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) { Pop-Location; Die "npm install failed." }
  Pop-Location
  Ok "website packages installed"
}

# ---------------------------------------------------------------- 4
Head "STEP 4 of 9   Creating the Laravel project (3-5 minutes)"

$laravelOk = $false
if ((Test-Path "$root\backend-app\artisan") -and (Test-Path "$root\backend-app\vendor\autoload.php") -and (Test-Path "$root\backend-app\vendor\laravel\framework\composer.json")) {
  $cj = Get-Content "$root\backend-app\composer.json" -Raw -ErrorAction SilentlyContinue
  if ($cj -match 'laravel/framework"\s*:\s*"\^1[2-9]') { $laravelOk = $true }
}

if ($laravelOk) {
  Ok "backend-app already exists and is complete - keeping it"
} else {
  if (Test-Path "$root\backend-app") {
    Info "clearing an incomplete or outdated backend-app from a previous attempt"
    Remove-Item "$root\backend-app" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 400
    if (Test-Path "$root\backend-app") {
      Die "Could not delete backend-app. Close VS Code / any terminal open in that folder and run SETUP.bat again."
    }
  }
  # Pinned to Laravel 12: the project code was written against its structure.
  $c = Composer-Run @('create-project','laravel/laravel:^12.0','backend-app','--no-interaction','--prefer-dist')

  # Judge success by what is on disk, not by Composer's exit code. Laravel's
  # last post-install step runs a migration against a throwaway SQLite file;
  # if that step trips, Laravel itself is still installed correctly and this
  # project never touches SQLite - step 7 points everything at MySQL.
  if (-not (Test-Path "$root\backend-app\vendor\autoload.php")) {
    Die "composer create-project failed.`nThe reason is in the output above and in setup-log.txt."
  }
  if ($c -ne 0) {
    Warn "Composer reported an error on its final post-install step."
    Warn "Laravel installed correctly, so setup is carrying on."
  }
  Ok "Laravel 12 installed"
}

# ---------------------------------------------------------------- 5
Head "STEP 5 of 9   API support and Sanctum login"

# Laravel's own `artisan install:api` shells out to a `composer` on PATH, which
# is not there on this machine, and its other side effects (routes/api.php and
# the routing registration) are replaced wholesale by our own files in step 6.
# So install the one package that actually matters, directly.
if (Test-Path "$root\backend-app\vendor\laravel\sanctum") {
  Ok "Sanctum already installed - skipping"
} else {
  $c = Composer-Run @('require','laravel/sanctum','--no-interaction','--working-dir',"$root\backend-app")

  # Same rule as step 4: what is on disk is the truth.
  if (-not (Test-Path "$root\backend-app\vendor\laravel\sanctum")) {
    Die "Could not install Laravel Sanctum, which is the admin login system.`nThe reason is in the output above and in setup-log.txt."
  }
  if ($c -ne 0) { Warn "Composer reported an error afterwards; Sanctum itself installed, carrying on." }
  Ok "Sanctum installed"
}
# Sanctum ships its personal_access_tokens migration inside the package and only
# *publishes* it - it is not loaded from there. Miss this and every admin sign-in
# dies with "Base table or view not found: studio.personal_access_tokens".
Push-Location "$root\backend-app"
& $php artisan vendor:publish --tag=sanctum-migrations --no-interaction 2>&1 | Out-Null
Pop-Location

$tokenMigration = @(Get-ChildItem "$root\backend-app\database\migrations" -Filter '*personal_access_tokens*' -ErrorAction SilentlyContinue)
if ($tokenMigration.Count -eq 0) {
  Die "Could not publish Sanctum's login-token migration.`nWithout it the admin panel cannot sign anyone in."
}
Ok "login-token migration published"
Ok "API and authentication support added"

# ---------------------------------------------------------------- 6
Head "STEP 6 of 9   Copying your project code into it"

Copy-Item -Path "$root\backend\*" -Destination "$root\backend-app" -Recurse -Force
if (-not (Test-Path "$root\backend-app\routes\api.php")) { Die "The copy failed - routes\api.php is missing." }
Ok "migrations, models, controllers, seeders and routes copied"

# ---------------------------------------------------------------- 7
Head "STEP 7 of 9   Configuration"

Push-Location "$root\backend-app"
Copy-Item ".env.example" ".env" -Force

$chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
$pw = ''
for ($i = 0; $i -lt 16; $i++) { $pw += $chars[(Get-Random -Minimum 0 -Maximum $chars.Length)] }

$envLines = Get-Content ".env" | ForEach-Object {
  if ($_ -match '^DB_PASSWORD=') { "DB_PASSWORD=$dbPass" } else { $_ }
}
Set-Content ".env" $envLines
Add-Content ".env" "`nADMIN_PASSWORD=$pw"

# A cached config from an earlier attempt would silently override the .env
# we just wrote, so clear it before anything reads the database settings.
& $php artisan config:clear 2>&1 | Out-Null
& $php artisan package:discover --ansi 2>&1 | Out-Null

& $php artisan key:generate --force
if ($LASTEXITCODE -ne 0) { Pop-Location; Die "Could not generate the application key." }
Ok "configuration written, app key generated"

# ---------------------------------------------------------------- 8
Head "STEP 8 of 9   Building the database (23 tables)"

& $php artisan migrate --seed --force
if ($LASTEXITCODE -ne 0) { Pop-Location; Die "The database build failed.`nThe reason is above and in setup-log.txt." }
& $php artisan storage:link 2>&1 | Out-Null
Ok "tables created and filled with your content"
Pop-Location

# ---------------------------------------------------------------- 9
Head "STEP 9 of 9   Connecting the website to the API"

Set-Content "$root\frontend\.env" "VITE_API_BASE_URL=http://localhost:8000/api"
Ok "frontend\.env written"

$loginFile = @"
ADMIN LOGIN
===================================================
  Address:   http://localhost:5173/admin
  Email:     niazattari2641@gmail.com
  Password:  $pw
===================================================
Keep this private. To change it: sign in, open Account.
"@
Set-Content "$root\ADMIN-LOGIN.txt" $loginFile
Ok "login details saved to ADMIN-LOGIN.txt"

$startBat = @"
@echo off
title Website - running
echo Starting the API and the website. Two windows will open. Leave both open.
start "Laravel API"  powershell -NoExit -NoProfile -Command "Set-Location '%~dp0backend-app'; & '$php' artisan serve"
timeout /t 5 /nobreak >nul
start "Website"      powershell -NoExit -NoProfile -Command "Set-Location '%~dp0frontend'; & '$npm' run dev"
timeout /t 10 /nobreak >nul
start http://localhost:5173
exit
"@
Set-Content "$root\START.bat" $startBat -Encoding ASCII
Ok "START.bat created"

Write-Host ""
Write-Host "  ================================================================" -ForegroundColor Green
Write-Host "   EVERYTHING IS READY" -ForegroundColor Green
Write-Host "  ================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "   Admin password:  " -NoNewline -ForegroundColor White
Write-Host $pw -ForegroundColor Yellow
Write-Host "   Also saved in:   ADMIN-LOGIN.txt" -ForegroundColor Gray
Write-Host ""
Write-Host "   Next: close this window and double-click START.bat" -ForegroundColor White
Write-Host ""
try { Stop-Transcript | Out-Null } catch { }
Read-Host "Press Enter to close"
