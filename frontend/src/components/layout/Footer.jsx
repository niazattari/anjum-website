import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { whatsappLink, whatsappMessages } from '@/utils/whatsapp';
import BrandMark from '@/components/ui/BrandMark';

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Process', to: '/process' },
      { label: 'Portfolio', to: '/portfolio' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Website development', to: '/services/website-development' },
      { label: 'Web applications', to: '/services/web-application-development' },
      { label: 'Google Sheets web apps', to: '/services/google-sheets-web-apps' },
      { label: 'Business automation', to: '/services/business-automation' },
      { label: 'E-commerce', to: '/services/ecommerce-development' },
      { label: 'All services', to: '/services' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Web app catalogue', to: '/web-apps' },
      { label: 'Buy source code', to: '/source-code' },
      { label: 'Frequently asked questions', to: '/faq' },
      { label: 'Start a project', to: '/start-project' },
      { label: 'Privacy policy', to: '/privacy' },
      { label: 'Terms & conditions', to: '/terms' },
    ],
  },
];

export default function Footer({ settings }) {
  const year = new Date().getFullYear();
  const social = settings.social.filter((s) => s.enabled);

  return (
    <footer className="relative mt-24 border-t bg-surface/40">
      <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="container relative">
        {/* Closing call to action */}
        <div className="relative -mt-12 overflow-hidden rounded-3xl border bg-gradient-to-br from-brand/12 via-surface to-accent/10 p-8 shadow-lift sm:p-12">
          <div className="glow-orb -right-10 -top-16 h-56 w-56 bg-accent/25" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-display-md text-ink">Let&rsquo;s build something worth using.</h2>
              <p className="mt-3 text-muted">
                Tell me what your business needs and you&rsquo;ll get a written scope, a fixed quotation and a
                realistic timeline — usually {settings.contact.responseTime.toLowerCase()}.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button to="/start-project" size="lg" iconRight="ArrowRight">Start your project</Button>
              <Button
                href={whatsappLink(settings.contact.whatsapp, whatsappMessages.general)}
                variant="secondary"
                size="lg"
                icon="MessageCircle"
              >
                Talk on WhatsApp
              </Button>
            </div>
          </div>
        </div>

        {/* Footer body */}
        <div className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <BrandMark size="h-10 w-10" />
              <span className="flex flex-col gap-[3px]">
                <span className="wordmark text-[1.3rem] text-ink">{settings.logoText}</span>
                <span className="wordmark-sub text-[0.52rem] text-faint">Full-stack &middot; AI systems</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {settings.seo.defaultDescription}
            </p>

            <div className="mt-6 space-y-2.5 text-sm">
              <a href={`mailto:${settings.contact.email}`} className="flex items-center gap-2.5 text-muted transition-colors hover:text-ink">
                <Icon name="Mail" className="h-4 w-4 text-brand" />
                {settings.contact.email}
              </a>
              <a
                href={whatsappLink(settings.contact.whatsapp, whatsappMessages.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-muted transition-colors hover:text-ink"
              >
                <Icon name="MessageCircle" className="h-4 w-4 text-brand" />
                {settings.contact.phone}
              </a>
              <p className="flex items-center gap-2.5 text-muted">
                <Icon name="MapPin" className="h-4 w-4 text-brand" />
                {settings.owner.location}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {social.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border text-muted transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:text-ink"
                >
                  <Icon name={s.icon} className="h-[1.05rem] w-[1.05rem]" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-ink">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-muted transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t py-6 text-[0.8rem] text-muted sm:flex-row">
          <p>© {year} {settings.legalName}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="transition-colors hover:text-ink">Privacy</Link>
            <Link to="/terms" className="transition-colors hover:text-ink">Terms</Link>
            {settings.admin?.enabled && (
              <Link
                to={settings.admin.url}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-ink"
              >
                <Icon name="Lock" className="h-3 w-3" />
                {settings.admin.label}
              </Link>
            )}
            <span className="hidden items-center gap-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {settings.contact.availability}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
