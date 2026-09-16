import { useEffect } from 'react';
import api from '@/services/api';
import useAsync from '@/hooks/useAsync';
import { applySeo } from '@/utils/seo';
import PageHero from '@/components/ui/PageHero';
import Section, { SectionHeading } from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import { GridSkeleton, ErrorState } from '@/components/ui/States';
import WebAppCard from '@/components/cards/WebAppCard';
import CtaBand from '@/components/sections/CtaBand';

const flow = [
  { label: 'Your Google Sheet', sub: 'stays the database', icon: 'Table2' },
  { label: 'Apps Script', sub: 'logic, rules, triggers', icon: 'Braces' },
  { label: 'Web interface', sub: 'forms, search, reports', icon: 'AppWindow' },
  { label: 'Your team', sub: 'role-based access', icon: 'Users' },
];

const whyPoints = [
  { icon: 'Wallet', title: 'A fraction of the cost', text: 'No servers, no hosting bill, no database licence. Build cost is lower and running cost is usually zero.' },
  { icon: 'Clock', title: 'Weeks, not months', text: 'Because the data model already exists in your sheet, most systems are ready in one to three weeks.' },
  { icon: 'Lock', title: 'Your data stays yours', text: 'Everything remains inside your own Google account. Nothing is copied to a third-party service.' },
  { icon: 'Users', title: 'Familiar to your team', text: 'The accountant still opens the same sheet. Staff get a form instead of raw cells.' },
];

export default function WebApps() {
  const { data, loading, error, reload } = useAsync(() => api.getWebApps(), []);

  useEffect(() => {
    applySeo({
      title: 'Google Sheets & business web apps',
      description: 'Turn Google Sheets into inventory, payroll, attendance, invoicing, CRM and reporting web apps using Google Apps Script.',
      path: '/web-apps',
    });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Google Sheets & Apps Script"
        title="Turn your Google Sheets into powerful business applications"
        description="Your team already keeps the data. What is missing is an interface: forms instead of raw cells, validation instead of typos, permissions instead of everyone seeing everything — without moving your data anywhere."
        breadcrumbs={[{ label: 'Web apps' }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button to="/start-project?type=sheets-web-app" size="lg" iconRight="ArrowRight">
            Request a web app
          </Button>
          <Button to="/services/google-sheets-web-apps" variant="secondary" size="lg" icon="Info">
            How it works
          </Button>
        </div>
      </PageHero>

      {/* Architecture */}
      <Section className="pt-14">
        <div className="rounded-3xl border bg-surface/50 p-6 sm:p-10">
          <h2 className="text-center text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-faint">
            How a Sheets web app is put together
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {flow.map((node, i) => (
              <Reveal key={node.label} delay={i * 0.07}>
                <div className="relative flex h-full flex-col items-center rounded-2xl border bg-surface p-5 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand/15 to-accent/15 text-brand ring-1 ring-brand/20">
                    <Icon name={node.icon} className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-[0.92rem] font-bold text-ink">{node.label}</p>
                  <p className="mt-1 text-[0.78rem] text-muted">{node.sub}</p>
                  {i < flow.length - 1 && (
                    <Icon
                      name="ChevronRight"
                      className="absolute -right-3.5 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-faint lg:block"
                    />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-[0.82rem] text-muted">
            Credentials never reach the browser. Where a Laravel backend is involved, it talks to the Google API
            server-side and the frontend only ever sees your own endpoints.
          </p>
        </div>
      </Section>

      {/* Why */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="Why this approach"
          title="The cheapest useful system is often the one you already have"
          description="Before commissioning a full custom application, it is worth knowing how far a properly-built Sheets web app will take you."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyPoints.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="h-full rounded-2xl border bg-surface/60 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/12 text-brand">
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[1rem] font-bold text-ink">{p.title}</h3>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-6">
          <h3 className="flex items-center gap-2 text-[0.95rem] font-bold text-ink">
            <Icon name="Info" className="h-4 w-4 text-amber-500" />
            Where this approach stops being the right one
          </h3>
          <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted">
            Apps Script has execution quotas and no row-level locking. Past roughly a dozen simultaneous users,
            heavy concurrent writes, or datasets where you need sub-second queries over long history, a real
            database is the correct answer — and I will tell you that rather than sell you the cheaper build.
          </p>
        </div>
      </Section>

      {/* Catalogue */}
      <Section>
        <SectionHeading
          eyebrow="Catalogue"
          title="Systems that can be built on your sheets"
          description="Each of these has been built before and can be adapted to how your business works. If yours is not listed, describe it — most requests are a variation on something here."
        />
        <div className="mt-14">
          {error ? (
            <ErrorState onRetry={reload} />
          ) : loading ? (
            <GridSkeleton count={6} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((app, i) => (
                <Reveal key={app.id} delay={i * 0.04}>
                  <WebAppCard app={app} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section className="pb-24 pt-0">
        <CtaBand
          title="Describe the sheet you want turned into a system"
          description="Tell me what your team currently does in the spreadsheet and what goes wrong. You will get a scope and a fixed price for the web app version."
          primaryLabel="Request a web app"
          primaryTo="/start-project?type=sheets-web-app"
        />
      </Section>
    </>
  );
}
