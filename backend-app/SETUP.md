# Backend setup

This folder is an **overlay**, not a complete Laravel installation. Laravel's
own skeleton comes from `composer create-project`; these files are the
application code that goes on top of it. That way the framework files match
whatever Laravel version you install, and only the code that matters comes from
here.

> **Read this first.** Packagist is unreachable from the environment this was
> written in, so this code has never been executed — only linted (`php -l`
> passes on all 94 files) and structurally verified (all 80 classes resolve,
> all 40 route handlers exist, PSR-4 paths check out). Expect to fix a small
> number of first-run issues. The frontend it talks to *has* been tested
> against a stand-in API implementing this exact contract, so the request and
> response shapes are known-good.

---

## 1. Create the Laravel project

With Laragon or XAMPP running, from `…\web development\`:

```bash
composer create-project laravel/laravel backend-app
cd backend-app
php artisan install:api
```

`install:api` installs Sanctum, publishes its migration, and creates
`routes/api.php` — all of which this overlay expects.

## 2. Copy the overlay over it

Copy everything from `backend/` into `backend-app/`, replacing when asked:

```
backend/app          → backend-app/app
backend/bootstrap    → backend-app/bootstrap        (replaces app.php)
backend/config       → backend-app/config           (adds cors.php)
backend/database     → backend-app/database
backend/routes       → backend-app/routes           (replaces api.php)
backend/resources    → backend-app/resources        (adds email views)
backend/.env.example → backend-app/.env.example
```

On Windows PowerShell, from inside `web development`:

```powershell
Copy-Item -Path backend\* -Destination backend-app\ -Recurse -Force
```

## 3. Create the database

In phpMyAdmin (Laragon/XAMPP), or from the MySQL console:

```sql
CREATE DATABASE studio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 4. Configure

```bash
cp .env.example .env      # copy .env.example .env  on Windows
php artisan key:generate
```

Then open `.env` and check `DB_DATABASE`, `DB_USERNAME` and `DB_PASSWORD`
match your setup. XAMPP and Laragon both default to user `root` with an empty
password, which is what `.env.example` already has.

`FRONTEND_URL` must match where Vite is serving the site, **exactly** —
scheme, host and port. Get it wrong and every request fails as a CORS error.

## 5. Migrate and seed

```bash
php artisan migrate --seed
```

The seeder prints a generated admin password **once**. Save it immediately — it
is not recoverable, and the seeder will not print it again on a re-run. To
choose your own instead, set `ADMIN_PASSWORD` in `.env` before seeding.

Seed content comes from `database/seeders/data/*.json`, exported directly from
the frontend's `src/data` files — so the database starts with exactly the
content the site already shows.

## 6. Storage link and run

```bash
php artisan storage:link
php artisan serve
```

The API is now on `http://localhost:8000/api`.

## 7. Point the frontend at it

In `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

Restart `npm run dev`. The site now reads from the database, the project form
writes to it, and `/admin` signs in against it.

---

## Checking it works

```bash
curl http://localhost:8000/api/services
curl http://localhost:8000/api/settings
```

Both should return JSON wrapped in `{"data": …}`. If you get an HTML error
page, read `storage/logs/laravel.log` — the real error is at the bottom.

---

## Email

`MAIL_MAILER=log` is the default: nothing is sent, and every email is written
to `storage/logs/laravel.log` where you can read it. That is the right setting
while you are still building.

For real delivery through Gmail you need an **App Password** — Gmail rejects
your normal account password over SMTP. Google Account → Security → 2-Step
Verification (turn it on first) → App passwords. Then in `.env`:

```
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=niazattari2641@gmail.com
MAIL_PASSWORD="the 16-character app password"
MAIL_ENCRYPTION=tls
```

Two emails go out per project request: a confirmation to the client with their
reference number, and a notification to you with the full requirement. Both are
wrapped in try/catch — a mail failure is logged, never lost, and never costs
the visitor their submission.

---

## Things that will probably need attention on first run

- **Lazy-loading exceptions.** `AppServiceProvider` enables
  `Model::preventLazyLoading` outside production, which turns a missing eager
  load into a loud error instead of a silent N+1. If one fires somewhere I did
  not anticipate, either add the relation to that controller's `with()` or
  comment the line out while you work.
- **`enum` columns.** `service_features.kind` uses an enum. If your MySQL is
  older or strict-mode fussy, change it to a plain `string`.
- **Timezone.** `APP_TIMEZONE=Asia/Karachi` is set so timestamps in the admin
  read correctly for you.

---

## Production notes

- `APP_DEBUG=false` and `APP_ENV=production`.
- `php artisan config:cache route:cache view:cache` after deploying.
- `FRONTEND_URL` becomes your real domain; CORS allows exactly that origin.
- Serve `frontend/dist` from the same domain and the CORS question disappears.
- Back up the database before every migration on live data.
