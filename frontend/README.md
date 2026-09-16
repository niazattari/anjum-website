# Web development studio — frontend

A production-ready React + Vite marketing site, portfolio and client-requirement
system for a full-stack web development business.

Everything the site displays is served through a single data layer
(`src/services/api.js`), so connecting the Laravel backend later is a
configuration change rather than a rewrite.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

Node 18+ is required.

---

## Pages

Each section of the site is its own route, not a slice of the homepage.

| Route | Page |
| --- | --- |
| `/` | Home — hero, services, featured work, web apps, stats, process, testimonials, FAQ |
| `/services` | All services |
| `/services/:slug` | Service detail with inclusions, deliverables, timeline |
| `/portfolio` | Filterable, searchable project index |
| `/portfolio/:slug` | Full case study: problem, solution, features, challenges, results |
| `/web-apps` | Google Sheets / Apps Script catalogue with architecture explainer |
| `/web-apps/:slug` | Web app detail |
| `/about` | Profile, working principles, skills, stats |
| `/process` | Seven-stage process with deliverables per stage |
| `/blog` | Article index with category filter and search |
| `/blog/:slug` | Article |
| `/faq` | Searchable FAQ with FAQPage structured data |
| `/contact` | Contact channels and validated message form |
| `/start-project` | Seven-step project requirement wizard |
| `/request-received` | Confirmation with reference number and WhatsApp handoff |
| `/privacy`, `/terms` | Legal pages |
| `*` | 404 |

---

## Editing content

No component contains hard-coded business content. Everything lives in
`src/data/`:

| File | Controls |
| --- | --- |
| `site.js` | Brand name, owner profile, contact details, social links, announcement bar, floating WhatsApp button, SEO defaults |
| `services.js` | The eight services and their detail pages |
| `portfolio.js` | Projects, categories and case-study content |
| `webApps.js` | Google Sheets web app catalogue |
| `technologies.js` | Technology strip and About-page skill bars |
| `stats.js` | Animated counters |
| `process.js` | Process stages |
| `whyChooseMe.js` | Advantage cards |
| `testimonials.js` | Testimonials (see below) |
| `faqs.js` | FAQ entries |
| `blog.js` | Blog posts |
| `wizardOptions.js` | Every option set in the project wizard, including budget bands |

### Before you launch — what still needs your input

Contact details are already set: `niazattari2641@gmail.com` and WhatsApp
`+92 341 7632795` (stored as `923417632795` — digits only, country code first,
no `+`; every WhatsApp link on the site is generated from that one value).

Still to do, all in `src/data/site.js`:

1. **Social URLs.** Facebook, LinkedIn, Fiverr and GitHub are present but
   `enabled: false`, because no URL was supplied. Paste each real profile URL and
   flip the flag — a disabled entry simply does not render, which is better than
   a dead link.
2. **Brand name.** `name` / `logoText` are still `"Studio"`. Change them to
   whatever you want the business called, and set `seo.siteUrl` to the real
   domain.
3. **Sample content.** EduTrack Pro is a real project. The other twelve
   portfolio entries and all four testimonials are clearly-labelled placeholders.
   Replace them and set `SAMPLE_CONTENT = false` — that removes every "sample"
   badge and notice site-wide.
4. **Legal pages.** `src/pages/Legal.jsx` is template wording. Have it reviewed
   for your jurisdiction.

### Technology logos

`public/logos/` is empty by design. Each technology in
`src/data/technologies.js` names the SVG it looks for (`react.svg`,
`laravel.svg`, …); drop the official file in and it appears in the strip and on
the About page automatically. Until then each one renders a monogram tile in its
brand colour, so nothing looks broken. `public/logos/README.md` lists where each
project publishes its own brand assets.

---

## Connecting the Laravel backend

The backend lives in `../backend/` — see `backend/SETUP.md` for installation.

`src/services/api.js` is the only file that touches public data. It reads
`VITE_API_BASE_URL`:

```bash
# .env
VITE_API_BASE_URL=http://localhost:8000/api
```

Leave it empty and the site runs entirely on the bundled sample data — useful
for design work and for demoing before the backend exists. Set it and every
method issues a real HTTP request instead, site settings included, so edits made
in the admin panel show up on the public site.

`docs/API.md` lists the endpoints and the exact JSON shape each one returns.

## Admin panel

`/admin` is a separate application inside the same build, lazy-loaded so a
public visitor downloads none of it. It needs `VITE_API_BASE_URL` set — there
is no mock mode for the admin, because there is nothing to administer without a
database.

| Screen | What it does |
| --- | --- |
| Dashboard | KPI tiles, twelve-month enquiry trend, pipeline, projects by category, most-viewed case studies |
| Project requests | Filter by pipeline stage, search, open the full requirement, move status, add internal notes, download attachments |
| Messages | Read, mark replied or archived, reply by email |
| Portfolio · Services · Web apps · Blog · Testimonials · FAQs | Full CRUD with nested list editors |
| Technologies · Statistics · Process · Why choose me | Full CRUD |
| Media library | Upload, copy URL, delete |
| Settings | Every site setting by group, plus social links |
| Account | Name, email, password |

Every content screen is driven by `src/admin/resources.js` — adding a new
manageable type is a config entry, not a new page component.

**Auth.** Sanctum bearer token in `localStorage`. That is the pragmatic choice
for a single-operator panel and the trade is worth stating: a successful XSS on
this origin could read the token. Signing in revokes all previous tokens, the
API re-checks the admin role on every request, and nothing renders raw HTML. If
more than one person ever needs access, move to Sanctum's cookie-based SPA auth.

---

## Project structure

```
src/
  components/
    cards/       ProjectCard, ServiceCard, WebAppCard, PostCard, TestimonialCard
    home/        Hero
    layout/      Header, Footer, AnnouncementBar, FloatingWhatsApp, Layout
    sections/    StatsBand, ProcessTimeline, FaqAccordion, TestimonialsCarousel, TechMarquee, CtaBand
    ui/          Button, Badge, Icon, Field, Section, States, PageHero, ProjectVisual, Reveal
    wizard/      Seven step components, progress rail, validation and payload shape
  data/          All editable content (maps 1:1 onto the Laravel tables)
  hooks/         useAsync, useCountUp, useTheme, useScrolled
  pages/         One file per route
  services/      api.js — the single data-access layer
  utils/         cn, format, seo, whatsapp
```

---

## Motion and interaction

All of it degrades to static when `prefers-reduced-motion: reduce` is set, and
the pointer effects are gated behind `(pointer: fine)` so touch devices are
unaffected.

| Effect | Where |
| --- | --- |
| Animated aurora gradient with scroll-linked drift | `components/layout/AuroraBackground.jsx` — fixed behind every page |
| 3D tilt with a cursor-following highlight | `hooks/useTilt.js` + `.tilt-3d` — project, service and web-app cards, hero code panel |
| Scroll-linked parallax | `hooks/useParallax.js` — hero light fields |
| Reading-progress bar | `components/layout/ScrollProgress.jsx` — bottom edge of the sticky header |
| Back-to-top with a progress ring | `components/layout/BackToTop.jsx` |
| Screenshot lightbox, keyboard navigable | `components/ui/Lightbox.jsx` — project galleries |
| Technology marquee, pauses on hover | `components/sections/TechMarquee.jsx` — directly under the header |
| Count-up statistics on scroll into view | `hooks/useCountUp.js` |
| Shine sweep on primary buttons | `.shine` in `index.css` |

The tilt and parallax hooks write CSS custom properties inside
`requestAnimationFrame` rather than triggering React re-renders, so pointer and
scroll movement cost nothing in render time.

## Design system

Colours are CSS custom properties in `src/index.css`, exposed to Tailwind as
semantic names (`bg`, `surface`, `elevated`, `line`, `ink`, `muted`, `faint`,
`brand`, `accent`). Light and dark are both defined; the toggle in the header
switches `.dark` on `<html>` and remembers the choice.

To rebrand, change the RGB triplets under `:root` and `.dark`. Nothing else
needs touching.

---

## What has been verified

**Frontend, in a real browser:**

- Production build passes with no errors.
- Every route renders at 320px, 768px, 1360px and 1920px with no horizontal scroll.
- Every route has exactly one `<h1>` and a unique document title.
- Contact form validation, submission and success state.
- Wizard: per-step validation, `?service=` / `?webapp=` / `?type=` preselection,
  review-and-edit, submission, reference number.
- Portfolio filtering, search and empty state; screenshot lightbox.
- Theme toggle, mobile navigation, keyboard focus states, skip link.

**Against a running API** (a stand-in implementing the documented contract):

- All 15 public pages render from the API with no console or page errors;
  19 endpoints exercised.
- Contact form posts and displays the reference the API returns.
- The wizard submits as `multipart/form-data` with the field names Laravel's
  validator expects — `projectTypes[]`, `features[]`, `files[]` carrying the
  real file, `consent=1`.
- Admin panel: 18 end-to-end checks pass — unauthenticated redirect, bad
  credentials, sign-in, dashboard charts, session restore across reload,
  request filtering, status change, internal notes, message reading, CRUD
  create/edit/delete, server validation surfacing on the form, settings and
  social saves, expired-token handling, and the panel at 390px.

**Backend, statically only** — Packagist was unreachable, so the Laravel code
has never been executed. All 94 PHP files pass `php -l`; all 80 classes resolve
with correct PSR-4 paths; all 40 route handlers exist. See `backend/SETUP.md`
for what to expect on first run.

---

## Notes and current limits

- **File uploads** in the wizard record file names and sizes with the request.
  The files themselves are not transmitted until the backend upload endpoint
  exists — the form says so rather than pretending otherwise.
- **Submissions** are logged to the browser console and `localStorage` while the
  site runs on sample data. Real storage and email arrive with the backend.
- **Project cover art** is generated from each project's `visual` spec. Replace
  it with real screenshots once you have them.
