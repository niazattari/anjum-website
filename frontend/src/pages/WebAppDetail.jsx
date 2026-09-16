import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/services/api';
import useAsync from '@/hooks/useAsync';
import { applySeo } from '@/utils/seo';
import { useSettings } from '@/context/SettingsContext';
import { whatsappLink, whatsappMessages } from '@/utils/whatsapp';
import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import ProjectVisual from '@/components/ui/ProjectVisual';
import { LoadingBlock, EmptyState } from '@/components/ui/States';
import WebAppCard from '@/components/cards/WebAppCard';
import CtaBand from '@/components/sections/CtaBand';

export default function WebAppDetail() {
  const { slug } = useParams();
  const site = useSettings();
  const { data, loading, error } = useAsync(async () => {
    const [app, all] = await Promise.all([api.getWebApp(slug), api.getWebApps()]);
    return { app, all };
  }, [slug]);

  useEffect(() => {
    if (data?.app) {
      applySeo({ title: data.app.name, description: data.app.solution, path: `/web-apps/${slug}` });
    }
  }, [data, slug]);

  if (loading) return <LoadingBlock label="Loading web app" />;

  if (error || !data?.app) {
    return (
      <Section className="pt-32">
        <EmptyState
          icon="Table2"
          title="Web app not found"
          description="That entry does not exist, or its address has changed."
          action={<Button to="/web-apps" icon="ArrowLeft">Back to the catalogue</Button>}
        />
      </Section>
    );
  }

  const { app, all } = data;
  const others = all.filter((a) => a.slug !== app.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Google Sheets web app"
        title={app.name}
        description={app.solution}
        breadcrumbs={[{ label: 'Web apps', to: '/web-apps' }, { label: app.name }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button to={`/start-project?webapp=${app.slug}`} size="lg" iconRight="ArrowRight">
            Request this system
          </Button>
          <Button
            href={whatsappLink(site.contact.whatsapp, whatsappMessages.webApp(app.name))}
            variant="secondary"
            size="lg"
            icon="MessageCircle"
          >
            Ask a question
          </Button>
        </div>
      </PageHero>

      <Section className="pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <Reveal>
              <ProjectVisual
                visual={{ kind: 'table', from: app.accent, to: app.accent }}
                label={app.name}
                ratio="aspect-[16/9]"
                className="rounded-2xl border shadow-lift"
              />
            </Reveal>

            <Reveal className="rounded-2xl border bg-surface/50 p-6 sm:p-7">
              <h2 className="flex items-center gap-2.5 text-[1.05rem] font-bold text-ink">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/12 text-red-500">
                  <Icon name="AlertCircle" className="h-4 w-4" />
                </span>
                The problem this solves
              </h2>
              <p className="mt-4 text-[0.93rem] leading-relaxed text-muted">{app.problem}</p>
            </Reveal>

            <Reveal className="rounded-2xl border bg-surface/50 p-6 sm:p-7">
              <h2 className="flex items-center gap-2.5 text-[1.05rem] font-bold text-ink">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/12 text-emerald-500">
                  <Icon name="Sparkles" className="h-4 w-4" />
                </span>
                What gets built
              </h2>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {app.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 rounded-xl bg-elevated/50 p-3">
                    <Icon name="Check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.5} />
                    <span className="text-[0.86rem] text-muted">{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2">
              <Reveal className="rounded-2xl border bg-surface/50 p-6">
                <h3 className="flex items-center gap-2 text-[0.95rem] font-bold text-ink">
                  <Icon name="Table2" className="h-4 w-4 text-brand" />
                  Google Sheets
                </h3>
                <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">{app.sheetsRole}</p>
              </Reveal>
              <Reveal delay={0.06} className="rounded-2xl border bg-surface/50 p-6">
                <h3 className="flex items-center gap-2 text-[0.95rem] font-bold text-ink">
                  <Icon name="Braces" className="h-4 w-4 text-accent" />
                  Apps Script
                </h3>
                <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">{app.scriptRole}</p>
              </Reveal>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border bg-surface/70 p-6 shadow-soft">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: `${app.accent}1f`, color: app.accent }}
              >
                <Icon name={app.icon} className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-lg font-bold text-ink">{app.name}</h2>

              <dl className="mt-5 space-y-3.5 border-t pt-5 text-[0.88rem]">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted">Build time</dt>
                  <dd className="font-semibold text-ink">{app.buildTime}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted">Platform</dt>
                  <dd className="font-semibold text-ink">Google Apps Script</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted">Data stays in</dt>
                  <dd className="font-semibold text-ink">Your Google account</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted">Hosting cost</dt>
                  <dd className="font-semibold text-ink">None</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col gap-2.5">
                <Button to={`/start-project?webapp=${app.slug}`} full iconRight="ArrowRight">
                  Request this system
                </Button>
                <Button
                  href={whatsappLink(site.contact.whatsapp, whatsappMessages.webApp(app.name))}
                  variant="whatsapp"
                  full
                  icon="MessageCircle"
                >
                  WhatsApp
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="surface">
        <h2 className="text-display-md text-ink">Other systems</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((a) => <WebAppCard key={a.id} app={a} />)}
        </div>
      </Section>

      <Section className="pb-24 pt-0">
        <CtaBand
          title={`Want a ${app.name.toLowerCase()} built on your sheets?`}
          primaryLabel="Request this system"
          primaryTo={`/start-project?webapp=${app.slug}`}
          whatsappMessage={whatsappMessages.webApp(app.name)}
        />
      </Section>
    </>
  );
}
