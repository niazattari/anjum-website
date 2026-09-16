import { site as bundledSite } from '@/data/site';

// Mutable so SettingsProvider can hand over the live values once the API
// answers; until then these are the bundled defaults.
let site = bundledSite;

/** Called by SettingsProvider when live settings arrive. */
export function setSeoDefaults(next) {
  site = next || bundledSite;
}

const upsert = (selector, attrs) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(attrs.tag || 'meta');
    Object.entries(attrs.identify || {}).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  Object.entries(attrs.set || {}).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
};

/** Applies per-page SEO: title, description, canonical, Open Graph, Twitter. */
export function applySeo({ title, description, path = '/', image, type = 'website', keywords } = {}) {
  const fullTitle = title ? `${title} — ${site.seo.titleSuffix}` : `${site.seo.defaultTitle} — ${site.seo.titleSuffix}`;
  const desc = description || site.seo.defaultDescription;
  const url = `${site.seo.siteUrl.replace(/\/$/, '')}${path}`;
  const img = image || site.seo.ogImage;

  document.title = fullTitle;

  upsert('meta[name="description"]', { identify: { name: 'description' }, set: { content: desc } });
  upsert('meta[name="keywords"]', {
    identify: { name: 'keywords' },
    set: { content: (keywords || site.seo.keywords).join(', ') },
  });
  upsert('link[rel="canonical"]', { tag: 'link', identify: { rel: 'canonical' }, set: { href: url } });

  const og = { 'og:title': fullTitle, 'og:description': desc, 'og:url': url, 'og:type': type, 'og:image': img, 'og:site_name': site.name };
  Object.entries(og).forEach(([property, content]) =>
    upsert(`meta[property="${property}"]`, { identify: { property }, set: { content } })
  );

  const tw = {
    'twitter:card': 'summary_large_image',
    'twitter:title': fullTitle,
    'twitter:description': desc,
    'twitter:image': img,
  };
  Object.entries(tw).forEach(([name, content]) =>
    upsert(`meta[name="${name}"]`, { identify: { name }, set: { content } })
  );
}

/** Injects a JSON-LD block, replacing any previous one with the same id. */
export function applyStructuredData(id, data) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  description: site.seo.defaultDescription,
  url: site.seo.siteUrl,
  email: site.contact.email,
  telephone: site.contact.phone,
  areaServed: 'Worldwide',
  sameAs: site.social.filter((s) => s.enabled && s.url.startsWith('http')).map((s) => s.url),
});
