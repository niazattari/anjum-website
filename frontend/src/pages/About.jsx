import { useEffect } from 'react';
import api from '@/services/api';
import useAsync from '@/hooks/useAsync';
import { applySeo } from '@/utils/seo';
import { useSettings } from '@/context/SettingsContext';
import { initials } from '@/utils/format';
import PageHero from '@/components/ui/PageHero';
import Section, { SectionHeading } from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import TechLogo from '@/components/ui/TechLogo';
import StatsBand from '@/components/sections/StatsBand';
import CtaBand from '@/components/sections/CtaBand';

function SkillBar({ tech, index }) {
  return (
    <Reveal delay={index * 0.03}>
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2.5">
            <TechLogo tech={tech} size="sm" />
            <span className="truncate text-[0.88rem] font-semibold text-ink">{tech.name}</span>
          </span>
          <span className="shrink-0 font-mono text-[0.72rem] text-faint">{tech.level}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-[width] duration-1000"
            style={{ width: `${tech.level}%`, background: `linear-gradient(90deg, ${tech.color}, rgb(var(--c-accent)))` }}
          />
        </div>
      </div>
    </Reveal>
  );
}

export default function About() {
  const site = useSettings();
  const { data } = useAsync(async () => {
    const [technologies, stats, advantages] = await Promise.all([
      api.getTechnologies(), api.getStats(), api.getAdvantages(),
    ]);
    return { technologies, stats, advantages };
  }, []);

  useEffect(() => {
    applySeo({
      title: 'About',
      description: `${site.owner.role} building websites, web applications and business automation systems.`,
      path: '/about',
    });
  }, []);

  const groups = (data?.technologies ?? []).reduce((acc, tech) => {
    (acc[tech.group] ||= []).push(tech);
    return acc;
  }, {});

  return (
    <>
      <PageHero
        eyebrow="About"
        title={`${site.owner.name} — ${site.owner.role}`}
        description="I build the system that removes the friction, not the website that looks busiest."
        breadcrumbs={[{ label: 'About' }]}
      />

      <Section className="pt-12">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-3xl border bg-gradient-to-br from-brand/15 to-accent/15">
                {site.owner.photo ? (
                  <img src={site.owner.photo} alt={site.owner.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <span className="font-display text-5xl font-extrabold gradient-text">
                      {initials(site.owner.name)}
                    </span>
                    <span className="mt-3 text-[0.75rem] text-faint">Upload a photo from the admin panel</span>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3 text-[0.88rem]">
                <p className="flex items-center gap-2.5 text-muted">
                  <Icon name="MapPin" className="h-4 w-4 text-brand" />
                  {site.owner.location}
                </p>
                <p className="flex items-center gap-2.5 text-muted">
                  <Icon name="Clock" className="h-4 w-4 text-brand" />
                  {site.contact.availability}
                </p>
                <p className="flex items-center gap-2.5 text-muted">
                  <Icon name="Mail" className="h-4 w-4 text-brand" />
                  {site.contact.email}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {site.social.filter((s) => s.enabled).map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border text-muted transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:text-ink"
                  >
                    <Icon name={s.icon} className="h-[1.05rem] w-[1.05rem]" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <div>
            <div className="space-y-5 text-[1rem] leading-relaxed text-muted">
              {site.owner.bio.map((paragraph, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-10 rounded-2xl border bg-surface/50 p-6">
              <h2 className="text-[1.05rem] font-bold text-ink">How I work</h2>
              <ul className="mt-4 space-y-3">
                {[
                  'A written scope and a fixed quotation before any work starts — no hourly surprises.',
                  'Design approved before development, so revisions happen while they are cheap.',
                  'A staging link you can open at any time, rather than a reveal at the end.',
                  'Plain-language updates. If something is going to take longer, you hear it early.',
                  'Full ownership at handover: source code, database and hosting account are yours.',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-accent/15 text-accent">
                      <Icon name="Check" className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-[0.9rem] leading-relaxed text-muted">{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button to="/start-project" size="lg" iconRight="ArrowRight">Start your project</Button>
              <Button to="/portfolio" variant="secondary" size="lg" icon="Eye">See the work</Button>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-8">
        {data?.stats && <StatsBand stats={data.stats} />}
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Skills"
          title="Tools I actually use"
          description="Not a list of everything I have touched — these are the technologies I build production work with."
        />
        <div className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-2">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <h3 className="mb-5 flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-faint">
                <span className="h-px w-6 bg-gradient-to-r from-brand to-transparent" />
                {group}
              </h3>
              <div className="space-y-4">
                {items.map((tech, i) => <SkillBar key={tech.id} tech={tech} index={i} />)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="What you get" title="Why clients keep working with me" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(data?.advantages ?? []).map((advantage, i) => (
            <Reveal key={advantage.id} delay={i * 0.04}>
              <div className="h-full rounded-2xl border bg-surface/60 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand/15 to-accent/15 text-brand ring-1 ring-brand/20">
                  <Icon name={advantage.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[1rem] font-bold text-ink">{advantage.title}</h3>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">{advantage.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="pb-24 pt-0">
        <CtaBand title="Let's talk about your project" />
      </Section>
    </>
  );
}
