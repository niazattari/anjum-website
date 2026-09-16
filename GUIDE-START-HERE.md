# Your Website: From Zero to Confident

Written for you, Niaz — assuming you have never used PHP or MySQL before.
Read Part 1 once. Keep Part 2 open while you work. Parts 3-5 are for later.

---

## PART 1 — What all these words actually mean

Your website is made of **two programs that talk to each other**.

### The front (what visitors see)
- **React** — a JavaScript library for building screens. Every page of your
  site is a React "component": a function that returns HTML.
- **Vite** — the tool that bundles all those files into something a browser
  can load, and gives you a live preview while you edit.
- **Node.js** — the engine that runs Vite on your computer. Not used on the
  live server; only while you build.
- **npm** — Node's package installer. `npm install` reads `package.json` and
  downloads everything the project needs into `node_modules`.

Think of the front as a **printed brochure**: pretty, but it knows nothing on
its own. It has to ask someone for the content.

### The back (the part you never see)
- **PHP** — a programming language that runs on a server. When a browser asks
  for something, PHP runs, thinks, and sends an answer back.
- **Laravel** — a framework written in PHP. It gives you routing, database
  access, validation, email and authentication so you don't write them from
  scratch. Your entire admin panel and API is Laravel.
- **Composer** — PHP's version of npm. `composer install` reads
  `composer.json` and downloads libraries into a folder called **`vendor`**.
- **MySQL** — the database. A set of tables (rows and columns, like Excel
  sheets that know how to relate to each other) that stores your projects,
  services, testimonials, client requests, messages and settings.
- **XAMPP** — a bundle that installs Apache + MySQL + PHP on Windows in one
  click. You are using it **only for its MySQL**.

Think of the back as a **librarian**: the brochure asks "what projects does
Niaz have?", the librarian looks in the database and hands back the list.

### How they talk: the API
The front sends an HTTP request like:

    GET http://127.0.0.1:8000/api/projects

Laravel answers with **JSON** — plain text in a structured shape:

    { "data": [ { "id": 1, "title": "EduTrack Pro", "slug": "edutrack-pro" } ] }

React turns that JSON into cards on the page. That is the whole relationship.
Nothing more mysterious than that.

### The one file that decides everything
`frontend/.env` contains:

    VITE_API_BASE_URL=http://127.0.0.1:8000/api

- **If that line is empty**, the site uses the sample content baked into the
  code. The site looks perfect but nothing you type in the admin panel shows
  up. (This is how you have been seeing it so far.)
- **If it points at Laravel**, the site becomes live and the admin panel
  controls it.

### Why `vendor/autoload.php` broke
`vendor` is created by Composer. Your `vendor` folder was never created,
because Composer refused: Laravel needs PHP 8.2+, XAMPP gave it PHP 8.0.
Every PHP file in Laravel starts by loading `vendor/autoload.php`, so without
it, nothing runs. `SETUP.bat` now installs a private PHP 8.3 and rebuilds it.

---

## PART 2 — Running the site every day

### First time only
1. Open **XAMPP Control Panel**. Click **Start** next to **MySQL**.
   (Apache is not needed — Laravel runs its own web server.)
2. Double-click **`SETUP.bat`**. Wait 5-10 minutes. Do not close it.
   (Your XAMPP lives at `C:\xamppp` - three p's. That is the real folder
   name on your machine, not a typo, and the script finds it on its own.)
3. When it finishes, open **`ADMIN-LOGIN.txt`** and save your password
   somewhere safe.

### Every time after that
1. Start **MySQL** in XAMPP.
2. Double-click **`START.bat`**.
   Two windows open — one is the API, one is the website. **Leave both open.**
   Your browser opens automatically.

| What | Address |
|---|---|
| Your website | http://localhost:5173 |
| Admin panel | http://localhost:5173/admin |
| The raw API | http://127.0.0.1:8000/api/projects |

### To stop
Close the two black windows. You can also stop MySQL in XAMPP.

### Proving it actually works end to end
1. Open the admin panel and log in.
2. Go to **Services**, change one title, save.
3. Open the public Services page and refresh.
4. The new title is there → front, API and database are all connected.

If step 4 fails but the admin panel saved fine, check that
`frontend/.env` has the `VITE_API_BASE_URL` line filled in, then close and
re-run `START.bat` (Vite only reads `.env` at startup).

---

## PART 3 — Reading your own database

Open http://localhost/phpmyadmin (XAMPP's Apache must be running for this
one). Click the **studio** database on the left.

Tables you will care about:

| Table | Holds |
|---|---|
| `projects` | Your portfolio items |
| `services` | What you offer |
| `web_apps` | Applications you sell |
| `project_requests` | Submissions from the wizard |
| `contact_messages` | Contact form messages |
| `settings` | Your name, email, WhatsApp, social links |
| `users` | Your admin login |
| `testimonials` | Client quotes |

Click a table, then **Browse**, and you are looking at your real data.
**Do not edit rows here** while learning — use the admin panel. phpMyAdmin
has no undo.

### The four database ideas worth knowing
- **Table** = one kind of thing (one table for projects, one for services).
- **Row** = one actual thing (one project).
- **Column** = one fact about it (title, slug, published_at).
- **Foreign key** = a column holding another table's id, which is how a
  project knows which services it used.

### SQL in sixty seconds
    SELECT * FROM projects;                        -- show everything
    SELECT title FROM projects WHERE featured = 1; -- show only featured
    SELECT COUNT(*) FROM contact_messages;         -- how many messages

You will rarely need to write SQL — Laravel writes it for you — but being
able to read it makes errors much less frightening.

---

## PART 4 — Understanding your Laravel folder

Inside `backend-app`:

| Folder | What lives there |
|---|---|
| `routes/api.php` | The list of URLs your API answers |
| `app/Models/` | One class per table (`Project.php` = `projects` table) |
| `app/Http/Controllers/` | The code that runs when a URL is hit |
| `app/Http/Resources/` | Decides which fields go out as JSON |
| `app/Http/Requests/` | Validation rules for incoming data |
| `database/migrations/` | The instructions that create the tables |
| `database/seeders/` | Starter content loaded on first setup |
| `.env` | Database name, password, mail settings, app key |
| `vendor/` | Downloaded libraries. Never edit. Never upload. |

### The request journey
    Browser  ->  routes/api.php  ->  Controller  ->  Model  ->  MySQL
                                          |
                                       Resource  ->  JSON  ->  React

### Five commands worth memorising
Run these inside `backend-app`. `START.bat` already knows the right PHP, so
if you must run them by hand, use the full path it uses.

    php artisan migrate          # create/update tables
    php artisan migrate:fresh --seed   # WIPE and rebuild with sample data
    php artisan db:seed          # add sample data only
    php artisan route:list       # show every URL your API answers
    php artisan config:clear     # after changing .env

`migrate:fresh` deletes all your data. Useful now, dangerous later.

---

## PART 5 — When something breaks

| Message | Meaning | Fix |
|---|---|---|
| `vendor/autoload.php ... No such file` | Composer never finished | Run `SETUP.bat` |
| `SQLSTATE[HY000] [2002]` | Database not reachable | Start MySQL in XAMPP |
| `SQLSTATE[HY000] [1045] Access denied` | Wrong DB password in `.env` | XAMPP's MySQL user is `root` with an empty password |
| `Base table or view not found` | Tables not created | `php artisan migrate` |
| `does not satisfy that requirement` | PHP too old | `SETUP.bat` installs PHP 8.3 for you |
| `These PHP extensions are switched off` | php.ini has them commented out | `SETUP.bat` now switches them on itself; if it says it could not, run it as administrator |
| `Port 3306 in use` | Two MySQLs fighting | Stop MySQL80 in Windows Services, or use XAMPP's only |
| `Port 5173 in use` | An old dev server still running | Close the leftover window, or restart the PC |
| Network error in admin panel | API window closed | Re-run `START.bat` |
| `419` on login | Stale session | Hard refresh with Ctrl+Shift+R |
| Admin edits don't show publicly | `.env` not pointed at the API | Fill `VITE_API_BASE_URL`, restart `START.bat` |
| `'composer' is not recognized` | Composer isn't on your PATH | You never need it — the script uses `composer.phar` |

**The golden rule while learning:** don't type commands by hand. Every command
this project needs is already inside `SETUP.bat` and `START.bat`, with the
correct PHP and the correct folder. Typing them yourself is how the wrong PHP
gets used.

**If you get truly stuck:** send me `setup-log.txt`, or the exact red text.
I can read the log on your machine directly.

---

## What to learn next, in order

1. **Change things in the admin panel.** Get comfortable seeing the database
   change through a safe door.
2. **Open `routes/api.php`** and read it top to bottom. It is a table of
   contents for the whole backend.
3. **Open `app/Models/Project.php`.** Notice it is tiny — Laravel infers the
   table name from the class name.
4. **Add one column**: a migration, the model's `$fillable`, the Resource,
   the admin form. Doing that once teaches you the whole stack.
5. **Then deploy to Hostinger.** See `DEPLOY.md`.
