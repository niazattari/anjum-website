# Technology logos

Each entry in `src/data/technologies.js` looks for its logo here by filename
(`react.svg`, `laravel.svg`, `mysql.svg`, …). Drop the file in and it appears
in the technology strip and on the About page automatically — no code change.

Until a file exists, that technology renders a monogram tile in its brand
colour, so the strip looks complete either way.

## Where to get the official files

Every one of these projects publishes its own brand assets. Download from the
source rather than a third-party mirror, and check each project's brand
guidelines for how the mark may be used:

| File | Source |
| --- | --- |
| `react.svg` | react.dev — press/brand assets |
| `javascript.svg`, `html5.svg`, `css3.svg` | MDN / W3C brand pages |
| `typescript.svg` | typescriptlang.org branding page |
| `tailwind.svg` | tailwindcss.com brand assets |
| `vite.svg` | vite.dev — logo in the repo's `docs/public` |
| `laravel.svg` | laravel.com/brand |
| `php.svg` | php.net logo page |
| `nodejs.svg` | nodejs.org/en/about/branding |
| `mysql.svg` | mysql.com — trademark & logo policy page |
| `apps-script.svg`, `sheets.svg` | Google Workspace brand resources |
| `chartjs.svg` | chartjs.org / the Chart.js GitHub repo |
| `git.svg` | git-scm.com/downloads/logos |
| `rest.svg` | no official mark — the monogram fallback is fine here |

## Requirements

- SVG, square-ish viewBox, transparent background.
- Keep filenames exactly as listed in `technologies.js`.
- Both light and dark themes are in play, so avoid a mark that is pure white
  or pure black. Where a project offers a colour version, use that.
