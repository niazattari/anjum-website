import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applySeo } from '@/utils/seo';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

const suggestions = [
  { to: '/services', label: 'Services', icon: 'Globe' },
  { to: '/portfolio', label: 'Portfolio', icon: 'Layers' },
  { to: '/web-apps', label: 'Web apps', icon: 'Table2' },
  { to: '/contact', label: 'Contact', icon: 'Mail' },
];

export default function NotFound() {
  useEffect(() => { applySeo({ title: 'Page not found', path: '/404' }); }, []);

  return (
    <Section className="relative overflow-hidden pt-32">
      <div className="grid-backdrop absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="glow-orb left-1/2 top-10 h-72 w-72 -translate-x-1/2 bg-brand/20" aria-hidden="true" />

      <div className="relative mx-auto max-w-lg text-center">
        <p className="font-display text-[6rem] font-extrabold leading-none gradient-text">404</p>
        <h1 className="mt-4 text-display-md text-ink">This page does not exist</h1>
        <p className="mt-4 text-muted">
          The address may be mistyped, or the page may have moved. Everything below is still where it should be.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/" size="lg" icon="ArrowLeft">Back to home</Button>
          <Button to="/contact" variant="secondary" size="lg" icon="MessagesSquare">Report a broken link</Button>
        </div>

        <div className="mt-12">
          <p className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-faint">
            Popular pages
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {suggestions.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="flex flex-col items-center gap-2 rounded-xl border bg-surface/60 p-4 text-[0.83rem] font-semibold text-muted transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:text-ink"
              >
                <Icon name={s.icon} className="h-5 w-5 text-brand" />
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
