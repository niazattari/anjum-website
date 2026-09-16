# Putting the site online

Two stages. Stage 1 is your own computer (SETUP.bat does it). Stage 2 is a
real domain that anyone can visit. Do stage 1 first and make sure everything
works locally - debugging on a live server is much harder.

---

## What you are actually uploading

Your project is two programs, and they go to two different places:

| Part | What it becomes | Where it goes |
| --- | --- | --- |
| `frontend` | Static files after `npm run build` | The public web root |
| `backend-app` | A PHP application | A folder **above** the web root, with only its `public/` exposed |

The frontend is just HTML, CSS and JavaScript once built - any host can serve
it. The backend needs PHP 8.2+ and MySQL.

---

## Option A - Shared hosting with cPanel  (recommended to start)

Around $3-5/month. Hostinger, Namecheap and most Pakistani hosts all work.
When choosing, confirm two things: **PHP 8.2 or newer**, and **SSH or Terminal
access** (some cheap plans hide it, which makes Laravel painful).

### 1. Point a subdomain at the API

In cPanel, create a subdomain `api.yourdomain.com`. When it asks for the
document root, set it to:

    /home/YOURUSER/laravel-app/public

Note that path - the app itself will live in `laravel-app`, and only its
`public` folder is reachable from the web. That is the whole point: your
`.env`, with the database password in it, must never be downloadable.

### 2. Upload the backend

Zip your local `backend-app` folder, **excluding** `vendor` and
`node_modules`. Upload it to `/home/YOURUSER/laravel-app/` and extract.

Then in cPanel Terminal (or SSH):

    cd ~/laravel-app
    composer install --no-dev --optimize-autoloader

If the plan has no terminal at all, upload your local `vendor` folder too -
it is large but it works.

### 3. Create the database

cPanel > MySQL Databases. Create a database and a user, and add the user to
the database with All Privileges. Write down all three values - cPanel
prefixes them, so you end up with names like `youruser_studio`.

### 4. Configure

Edit `~/laravel-app/.env`:

    APP_ENV=production
    APP_DEBUG=false
    APP_URL=https://api.yourdomain.com
    FRONTEND_URL=https://yourdomain.com

    DB_DATABASE=youruser_studio
    DB_USERNAME=youruser_studio
    DB_PASSWORD=the-password-you-set

`APP_DEBUG=false` matters. Left true, a crash shows visitors your database
credentials on screen.

Then:

    php artisan key:generate
    php artisan migrate --seed --force
    php artisan storage:link
    php artisan config:cache
    php artisan route:cache

### 5. Build and upload the frontend

On your own computer, point the site at the live API first:

    cd frontend
    # edit .env so it reads:
    #   VITE_API_BASE_URL=https://api.yourdomain.com/api
    npm run build

That produces `frontend/dist`. Upload **the contents** of `dist` (not the
folder itself) into `public_html/`.

### 6. The rewrite rule - do not skip this

React Router handles `/portfolio`, `/admin` and so on in the browser. The
server knows nothing about those paths, so a direct visit or a refresh gives
a 404 until you add this.

Create `public_html/.htaccess` containing:

    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule . /index.html [L]
    </IfModule>

A copy is saved next to this file as `htaccess-for-public_html.txt` - rename
it to `.htaccess` after uploading.

### 7. Turn on HTTPS

cPanel > SSL/TLS Status > Run AutoSSL. Free, takes a few minutes. Do it for
both `yourdomain.com` and `api.yourdomain.com`. Once it is live, force HTTPS
in cPanel's Domains settings.

If `FRONTEND_URL` says `https://` but visitors arrive over `http://`, every
API request fails with a CORS error - so get the certificate working before
you test.

---

## Option B - A VPS

DigitalOcean, Hetzner or Contabo, around $5/month. You get full control and
much better performance, at the cost of setting up nginx, PHP-FPM, MySQL and
certbot yourself. Worth it once you have paying clients on the box; overkill
for launching your own site.

## Option C - Railway or Render

Deploy straight from a Git repository, no server administration. Genuinely
easy. The free tiers sleep when idle and the paid tiers cost more than shared
hosting, so this suits a demo better than a business site you want indexed.

---

## Before you launch - a short list

- `APP_DEBUG=false` and `APP_ENV=production` in the live `.env`
- Sign in to the admin and change the password from the generated one
- Settings > Social links: add the real Facebook, LinkedIn and Fiverr URLs
- Settings > General: replace the "Studio" placeholder with your business name
- Settings > SEO: set the site URL to your real domain
- Portfolio: delete the twelve sample projects (EduTrack Pro is real - keep it)
- Testimonials: delete the placeholders, or turn the section off, until you
  have real quotes
- Legal pages: the privacy and terms text is a template. Have it checked.
- Mail: switch `MAIL_MAILER` to `smtp` with a Gmail App Password, and send
  yourself a test enquiry through the contact form

## Keeping it running

- Back up the database from cPanel before every deployment
- After uploading changed PHP files, run `php artisan config:cache` again
- After changing the frontend, `npm run build` and re-upload `dist`
- Watch `storage/logs/laravel.log` when something misbehaves
