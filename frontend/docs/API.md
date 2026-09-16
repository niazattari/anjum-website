# Laravel API contract

The frontend calls these endpoints when `VITE_API_BASE_URL` is set. Each one
should return either a bare JSON value or `{ "data": ... }` — the client accepts
both.

Field names below match `src/data/` exactly. Keeping them identical means the
frontend needs no changes when the backend goes live.

## Public read endpoints

| Method | Endpoint | Returns |
| --- | --- | --- |
| GET | `/settings` | Site settings object (see `src/data/site.js`) |
| GET | `/services` | Array of services |
| GET | `/services/{slug}` | One service |
| GET | `/portfolio` | Array of projects |
| GET | `/portfolio-categories` | Array of `{ id, name }` |
| GET | `/portfolio/{slug}` | One project |
| GET | `/portfolio/{slug}/related` | Up to 3 projects in the same category |
| GET | `/web-apps` | Array of web apps |
| GET | `/web-apps/{slug}` | One web app |
| GET | `/technologies` | Array of technologies |
| GET | `/stats` | Array of counters |
| GET | `/testimonials` | Array of enabled testimonials |
| GET | `/faqs` | Array of FAQs |
| GET | `/process` | Array of process steps |
| GET | `/advantages` | Array of advantage cards |
| GET | `/posts` | Array of published posts |
| GET | `/posts/{slug}` | One post |
| GET | `/posts/{slug}/related` | Up to 3 related posts |

## Public write endpoints

| Method | Endpoint | Body | Returns |
| --- | --- | --- | --- |
| POST | `/contact` | `{ name, email, phone, subject, message }` | `{ success: true, reference }` |
| POST | `/project-requests` | Full wizard payload (below) | `{ success: true, reference }` |

Both should be rate-limited and validated server-side. The frontend surfaces
`message` from a non-2xx JSON response, and `errors` if present.

## Project request payload

Produced by `toPayload()` in `src/components/wizard/wizardState.js`:

```jsonc
{
  "fullName": "…", "email": "…", "whatsapp": "…", "country": "…", "city": "…",
  "preferredContact": "whatsapp|email|phone|video",
  "projectTypes": ["business-website", "sheets-web-app"],
  "businessName": "…", "industry": "…", "businessDescription": "…",
  "targetAudience": "…", "businessLocation": "…", "existingWebsite": "…",
  "socialLinks": "…",
  "pageCount": "6-10", "pages": ["Home", "About"], "customPages": "…",
  "features": ["admin-dashboard", "payment-gateway"],
  "hasLogo": "yes|no", "hasBrandColors": "yes|no", "brandColors": "…",
  "designStyles": ["modern", "minimal"],
  "referenceSites": ["https://…"], "referenceNotes": "…",
  "files": [{ "name": "logo.png", "size": 24680, "type": "image/png" }],
  "contentReadiness": "have-all|partial|need-help",
  "contentAssets": ["Logo", "Photographs"],
  "hasDomain": "yes|no", "domainName": "…",
  "hasHosting": "yes|no", "hostingProvider": "…",
  "budget": "250-500", "timeline": "2-4-weeks",
  "projectDescription": "…", "referralSource": "…",
  "consent": true,
  "submittedAt": "2026-09-05T12:00:00.000Z"
}
```

`files` currently carries metadata only. To accept real uploads, add
`POST /project-requests/{id}/files` and switch the wizard submission to
`FormData` — the change is contained to `api.submitProjectRequest`.

## Suggested tables

`users`, `services`, `service_features`, `portfolio_projects`,
`portfolio_categories`, `portfolio_images`, `technologies`, `web_apps`,
`skills`, `statistics`, `testimonials`, `faqs`, `blog_posts`,
`blog_categories`, `blog_tags`, `contact_messages`, `project_requests`,
`project_request_features`, `project_request_pages`,
`project_request_references`, `project_request_files`, `social_links`,
`website_settings`, `seo_settings`, `media`, `admin_notes`.

Project request statuses used by the admin pipeline: `new`, `contacted`,
`discussion`, `quotation_sent`, `approved`, `in_development`, `completed`,
`cancelled`.

## Admin endpoints

Protected by Sanctum, prefixed `/admin`, with standard CRUD per resource:

```
POST   /admin/{resource}
PUT    /admin/{resource}/{id}
DELETE /admin/{resource}/{id}
```

Plus `GET /admin/project-requests` with filtering by status, and
`PATCH /admin/project-requests/{id}/status`.

## Google Sheets integration

Google credentials must never reach the browser. The frontend calls your own
Laravel endpoint; Laravel talks to the Google API or an Apps Script web app
server-side, using a service account stored in `.env`.

```
React  →  Laravel API  →  Google API / Apps Script  →  Google Sheets
```

---

# Implementation notes (phase 2)

The Laravel implementation of this contract lives in `../backend/`.
`backend/SETUP.md` covers installation.

## Response envelope

Every endpoint returns `{"data": …}`. The client accepts a bare value too, so a
different shape will not break it, but the Laravel controllers are consistent.

Admin list endpoints that paginate return Laravel's standard paginator:
`{data: [...], meta: {current_page, last_page, total, per_page}, links: {...}}`.

## Errors

| Status | When | Body |
| --- | --- | --- |
| 401 | Missing or expired token on an `/admin/*` route | `{message}` — the admin client clears the token and returns to the login screen |
| 403 | Authenticated but not an active admin | `{message}` |
| 404 | Unknown record | `{message: "Not found."}` |
| 422 | Validation failed | `{message, errors: {field: [messages]}}` — the admin form maps the first message per field onto its inputs |
| 429 | Rate limited | `{message}` |

## Rate limits

Defined in `AppServiceProvider::boot()`:

- `api` — 120 requests/minute per IP
- `submissions` — 5/minute and 30/day per IP (contact form and project requests)
- `logins` — 10/minute per IP, plus a per-email+IP lockout of 5 attempts for
  5 minutes inside `AuthController`

## Admin endpoints

```
POST   /admin/login                              → {token, user}
GET    /admin/me                                 → {user}
POST   /admin/logout
PUT    /admin/profile

GET    /admin/dashboard                          → cards, trend, pipeline, categories, top projects, recent

GET    /admin/project-requests                   ?status= &search= &open_only= &page=
GET    /admin/project-requests/{reference}
PATCH  /admin/project-requests/{reference}/status  {status, quoted_amount?, priority?}
POST   /admin/project-requests/{reference}/notes   {body}
DELETE /admin/project-requests/{reference}

GET    /admin/messages                           ?status= &search= &page=
GET    /admin/messages/{id}                      (marks a new message read)
PATCH  /admin/messages/{id}                      {status}
DELETE /admin/messages/{id}

GET    /admin/media                              ?search= &page=
POST   /admin/media                              multipart: file, alt?
DELETE /admin/media/{id}

GET    /admin/settings                           → {settings, social, seo}
PUT    /admin/settings                           {settings: [{key, value}]}
PUT    /admin/settings/social                    {links: [{id, url, enabled, sort_order}]}
```

And for each of `services`, `portfolio`, `portfolio-categories`, `web-apps`,
`posts`, `blog-categories`, `testimonials`, `faqs`, `technologies`, `stats`,
`process`, `advantages`:

```
GET    /admin/{resource}            ?search= &paginate= &per_page=
POST   /admin/{resource}
POST   /admin/{resource}/reorder    {items: [{id, sort_order}]}
GET    /admin/{resource}/{id}
PUT    /admin/{resource}/{id}
DELETE /admin/{resource}/{id}
```

## Project request submission is multipart

Because the wizard can carry file uploads, `POST /api/project-requests` is sent
as `multipart/form-data`, not JSON:

- arrays use PHP's `name[]` convention (`projectTypes[]`, `features[]`,
  `pages[]`, `designStyles[]`, `contentAssets[]`, `referenceSites[]`)
- files arrive as `files[]`
- booleans are sent as `1` / `0` — FormData stringifies everything, and the
  string `"false"` is truthy in PHP

`POST /api/contact` stays JSON.

## Schema

23 tables beyond Laravel's defaults. Relationships worth noting:

- `services` → `service_features` (hasMany, with a `kind` discriminator for the
  three parallel lists: features, deliverables, ideal-for)
- `portfolio_projects` → `portfolio_project_features`, `portfolio_images`
  (hasMany) and `technologies` (belongsToMany through
  `portfolio_project_technology`)
- `blog_posts` → `blog_categories` (belongsTo), `blog_tags` (belongsToMany),
  `users` (author)
- `project_requests` → types, features, pages, references, files (hasMany)
- `admin_notes` is polymorphic, so notes attach to requests, messages or
  anything added later

Soft deletes on everything worth recovering: services, web apps, portfolio
projects, blog posts, contact messages, project requests.
