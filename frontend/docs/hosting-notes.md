# Free hosting notes (Vercel)

`vercel.json` cannot carry comments — JSON has none, and Vercel validates the
file against a schema, so a `"//"` key is read as a real setting and fails the
deploy. The explanations live here instead.

## build.env

| Variable | Set to | Why |
|---|---|---|
| `VITE_API_BASE_URL` | empty | There is no Laravel API on the free tier. Empty means the site serves the content bundled into the code — every page still works. Put your API address here and redeploy the day the backend is hosted; no code changes needed. |
| `VITE_WEB3FORMS_KEY` | empty | A free key from https://web3forms.com emails you every enquiry (250/month, no card). Paste it between the quotes and redeploy. |

These are declared in `vercel.json` rather than a `.env` file because Vercel
uploads `.env` and `.env.production` but not `.env*.local`, and depending on
which files happen to travel is how a deployment silently picks up the wrong
settings.

## Why `.vercelignore` matters

`frontend/.env` on the development machine contains:

    VITE_API_BASE_URL=http://localhost:8000/api

Vercel's automatic ignore list covers `node_modules`, `.git` and `.env*.local`
— **but not a plain `.env`**. Without `.vercelignore` that file is uploaded and
the published site tries to fetch its content from the *visitor's own computer*,
so every page shows an error. Verified both ways: building with `.env` present
and no override put `localhost:8000` into the bundle; excluding it produced a
clean build.

## Why the rewrite rule exists

React Router owns every path. Ask Vercel for `/portfolio` and it looks for a
file at that path, finds none, and returns 404 — which is what happens when a
visitor refreshes, or opens a link you sent them. The rewrite sends everything
to `index.html` and lets the router decide, while the negative lookahead keeps
real files (`assets/`, `brand/`, `projects/`, `logos/`, `favicon`) being served
as themselves.

## Enquiries without a backend

`src/services/formDelivery.js` handles this. It emails through Web3Forms when a
key is set, and **always** returns a `wa.me` link containing the whole
submission, which the confirmation screen offers as a button. The wording
changes honestly depending on what happened: "Message sent" when the email went
out, "Almost there" when WhatsApp is the delivery route.

The free Web3Forms tier cannot carry file attachments, so files are listed by
name and the confirmation screen asks for them over WhatsApp.

## Publishing

Double-click `PUBLISH-FREE.bat` in the project root. Run it again any time to
publish changes.

## After the first deploy

Set `seo.siteUrl` in `src/data/site.js` to the real address. It is still
`https://example.com`, which gives Google the wrong canonical URLs and breaks
link previews on WhatsApp and LinkedIn.
