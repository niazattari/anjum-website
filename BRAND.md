# Brand: name, logo, colours

## The name

I have set the site to **Anjum Labs** so you can see a real brand in place
instead of the placeholder "Studio". It is a suggestion, not a decision —
changing it takes thirty seconds (see the last section).

### Why Anjum Labs is my recommendation

You are selling two different things: **your services** (client work) and
**your products** (web apps like EduTrack Pro). Most studio names only fit one
of those. "Labs" fits both — it implies a workshop where things get built and
also a place where products come from.

It also carries **your own name**. For a solo developer winning work on
Fiverr, LinkedIn and by referral, that matters more than sounding like a big
agency: clients hire a person. A made-up abstract name starts from zero trust;
your name starts from yours. And when a client searches "Niaz Anjum" after
your call, everything lines up.

### The shortlist, with honest trade-offs

Domain availability checked today. Prices are per year, roughly.

| Name | Domain | Status | Best for |
|---|---|---|---|
| **Anjum Labs** | anjumlabs.com | **free · ~$11** | Services *and* products. My pick. |
| Anjum Labs | anjumlabs.dev | free · ~$10 | Cheaper, developer-signal, weaker for non-technical clients |
| Anjum Studio | anjumstudio.com | free · ~$11 | Design-led framing; "studio" hints less at products |
| Niaz Anjum | niazanjum.com | free · ~$11 | Pure personal brand. Great for a CV, harder to grow past yourself |
| Niaz Works | niazworks.com | free · ~$11 | Friendly, portfolio-ish, slightly informal |
| Clear Craft | clearcraft.dev | free · ~$10 | If you ever want a name with no personal tie |
| Sablon | sablon.dev | free · ~$10 | Short invented name; needs marketing to mean anything |

Names I checked that are **already taken**: lumenforge, northbyte, craftwire,
shipcraft, veloxstudio, codemeridian, finewire, nuvara, codaris, peakbyte,
vertexly, anjum.dev, quillbyte, stackforge.dev, kindred.dev.

### One practical note
Buy the domain from whoever you buy hosting from (Hostinger sells domains, and
often bundles one free with a hosting plan) so there is one bill and one
control panel. The prices above are just proof the name is free to take.

---

## The logo

An original mark, drawn for you — nothing borrowed from any existing brand.

**The idea:** the letter **A** built from two clean strokes and a crossbar,
with round ends. It is deliberately geometric rather than decorative, because
it has to survive being 16 pixels wide in a browser tab. The upward peak also
reads as a chevron — growth, or a cursor pointing up — without being literal
about it.

### The files (in `frontend/public/brand/`)

| File | Use it for |
|---|---|
| `logo-full.svg` | Letterhead, invoices, email signature, proposals (light backgrounds) |
| `logo-full-dark.svg` | The same, on dark backgrounds |
| `logo-mark.svg` | Profile pictures: WhatsApp Business, LinkedIn, Facebook, Fiverr |
| `logo-mark-plain.svg` | The A with no tile, when a coloured square would clash |
| `logo-mark-mono.svg` | One-colour printing, stamps, watermarks |
| `favicon.svg` | Already wired into the browser tab |

SVG is vector: it stays sharp at any size, from a business card to a banner.
If a site demands PNG or JPG, open the SVG in a browser, or upload it to any
free SVG-to-PNG converter at 1024x1024.

### Rules that keep it looking professional
- Keep clear space around the mark equal to the height of the A.
- Never stretch it — scale width and height together.
- Never place the tile version on a busy photo; use `logo-mark-plain.svg`
  or put it on a solid panel.
- Do not add drop shadows, outlines or bevels.

---

## Colours

These are already your site's colours; the logo uses them so everything
matches.

| Role | Hex | Where it shows |
|---|---|---|
| Brand indigo | `#4F46E5` | Primary buttons, links, logo start |
| Mid blue | `#2563EB` | Gradient middle |
| Accent cyan | `#06B6D4` | Highlights, logo end |
| Ink | `#0B1120` | Dark background, body text on light |
| Slate | `#475569` | Secondary text |
| Paper | `#F8FAFC` | Light background |

**Typefaces:** headings in **Sora**, body in **Inter**, code in **JetBrains
Mono**. All three are free Google Fonts and already loaded by the site.

---

## Changing the name later

Three places, all plain text:

1. `frontend/src/data/site.js` — `name`, `logoText`, and `seo.titleSuffix`
2. `frontend/index.html` — the `<title>` line
3. Once the backend is running, the **Settings** page in your admin panel
   overrides all of it without touching any file.

The logo does not have to change if you keep a name starting with A. If you
choose a name with a different initial, tell me and I will redraw it.
