import { useEffect, useState } from 'react';
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
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';
import ProjectVisual from '@/components/ui/ProjectVisual';
import SampleNotice from '@/components/ui/SampleNotice';
import Lightbox from '@/components/ui/Lightbox';
import { LoadingBlock, EmptyState } from '@/components/ui/States';
import ProjectCard from '@/components/cards/ProjectCard';
import CtaBand from '@/components/sections/CtaBand';

function Block({ title, children, icon }) {
  return (
    <Reveal className="rounded-2xl border bg-surface/50 p-6 sm:p-7">
      <h2 className="flex items-center gap-2.5 text-[1.05rem] font-bold text-ink">
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/12 text-brand">
            <Icon name={icon} className="h-4 w-4" />
          </span>
        )}
        {title}
      </h2>
      <div className="mt-4 text-[0.93rem] leading-relaxed text-muted">{children}</div>
    </Reveal>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const site = useSettings();
  const [lightbox, setLightbox] = useState(null);

  const { data, loading, error } = useAsync(async () => {
    const project = await api.getProject(slug);
    const related = await api.getRelatedProjects(project);
    return { project, related };
  }, [slug]);

  useEffect(() => {
    if (data?.project) {
      applySeo({
        title: data.project.title,
        description: data.project.short,
        path: `/portfolio/${slug}`,
        type: 'article',
      });
    }
  }, [data, slug]);

  if (loading) return <LoadingBlock label="Loading case study" />;

  if (error || !data?.project) {
    return (
      <Section className="pt-32">
        <EmptyState
          icon="FileText"
          title="Project not found"
          description="That case study does not exist, or its address has changed."
          action={<Button to="/portfolio" icon="ArrowLeft">Back to portfolio</Button>}
        />
      </Section>
    );
  }

  const { project, related } = data;
  // Gallery entries are either a caption string (generated artwork) or an
  // object with a real screenshot path. Only real images open in the lightbox.
  const gallery = project.gallery.map((g) => (typeof g === 'string' ? { caption: g } : g));
  const shots = gallery.filter((g) => g.src);

  return (
    <>
      <PageHero
        eyebrow={project.categoryName}
        title={project.title}
        description={project.short}
        breadcrumbs={[{ label: 'Portfolio', to: '/portfolio' }, { label: project.title }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="success" icon="CheckCircle2">{project.status}</Badge>
          <Badge tone="neutral" icon="Calendar">{project.year}</Badge>
          <Badge tone="neutral" icon="Clock">{project.duration}</Badge>
          <Badge tone="neutral" icon="Users">{project.clientType}</Badge>
        </div>
      </PageHero>

      <Section className="pt-12">
        {project.isSample && (
          <SampleNotice className="mb-10">
            Sample case study. The structure, depth and section order match a real write-up, but this is
            illustrative content — not a delivered client project.
          </SampleNotice>
        )}

        <Reveal>
          <ProjectVisual
            visual={project.visual}
            image={project.cover}
            alt={project.title}
            priority
            label={project.categoryName}
            ratio="aspect-[16/9]"
            className="rounded-2xl border shadow-lift"
          />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <Block title="The problem" icon="AlertCircle">{project.problem}</Block>
            <Block title="The solution" icon="Sparkles">{project.solution}</Block>

            <Block title="What was built" icon="ListChecks">
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {project.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Icon name="Check" className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.5} />
                    <span className="text-[0.88rem]">{f}</span>
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="The hard part" icon="Puzzle">{project.challenges}</Block>

            <Block title="Results" icon="TrendingUp">
              <ul className="space-y-3">
                {project.results.map((r) => (
                  <li key={r} className="flex items-start gap-3 rounded-xl bg-elevated/60 p-3.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-500">
                      <Icon name="Check" className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                    <span className="text-[0.9rem] text-ink">{r}</span>
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="Screens" icon="Eye">
              <div className="grid gap-4 sm:grid-cols-2">
                {gallery.map((shot, i) => {
                  const Wrapper = shot.src ? 'button' : 'figure';
                  return (
                    <Wrapper
                      key={shot.caption}
                      {...(shot.src
                        ? {
                            type: 'button',
                            onClick: () => setLightbox(shots.findIndex((x) => x.src === shot.src)),
                            'aria-label': `View full size: ${shot.caption}`,
                          }
                        : {})}
                      className="group block w-full overflow-hidden rounded-xl border text-left transition-all hover:border-brand/40 hover:shadow-lift"
                    >
                      <span className="relative block">
                        <ProjectVisual
                          image={shot.src}
                          alt={shot.caption}
                          visual={{ ...project.visual, kind: ['dashboard', 'table', 'app', 'landing'][i % 4] }}
                          ratio="aspect-[16/10]"
                          className="transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        {shot.src && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-[0.78rem] font-semibold text-white backdrop-blur">
                              <Icon name="Search" className="h-3.5 w-3.5" />
                              View full size
                            </span>
                          </span>
                        )}
                      </span>
                      <span className="block border-t bg-surface/60 px-3 py-2 text-[0.78rem] text-muted">
                        {shot.caption}
                      </span>
                    </Wrapper>
                  );
                })}
              </div>
              {shots.length === 0 && (
                <p className="mt-4 text-[0.78rem] text-faint">
                  Generated placeholders — replace with real screenshots from the admin media library.
                </p>
              )}
            </Block>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border bg-surface/70 p-6 shadow-soft">
              <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-faint">
                Project details
              </h2>

              <dl className="mt-5 space-y-4 text-[0.88rem]">
                {[
                  ['Client type', project.clientType],
                  ['Category', project.categoryName],
                  ['Year', project.year],
                  ['Duration', project.duration],
                  ['Status', project.status],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 border-b pb-3 last:border-0">
                    <dt className="text-muted">{label}</dt>
                    <dd className="text-right font-semibold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-6 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-faint">
                Technologies
              </h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.technologies.map((t) => (
                  <span key={t} className="rounded-md bg-elevated px-2.5 py-1 text-[0.75rem] font-medium text-muted">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                {project.liveUrl && (
                  <Button href={project.liveUrl} variant="secondary" full icon="ExternalLink">Live demo</Button>
                )}
                {project.githubUrl && (
                  <Button href={project.githubUrl} variant="secondary" full icon="Github">Source code</Button>
                )}
                <Button to="/start-project" full iconRight="ArrowRight">Start a similar project</Button>
                <Button
                  href={whatsappLink(site.contact.whatsapp, whatsappMessages.project(project.title))}
                  variant="whatsapp"
                  full
                  icon="MessageCircle"
                >
                  Ask about this
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="surface">
          <Badge tone="brand" className="mb-4">More like this</Badge>
          <h2 className="text-display-md text-ink">Related projects</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </Section>
      )}

      <Section className="pb-24 pt-0">
        <CtaBand
          title="Want something similar?"
          whatsappMessage={whatsappMessages.project(project.title)}
        />
      </Section>

      <Lightbox items={shots} index={lightbox} onClose={() => setLightbox(null)} onNavigate={setLightbox} />
    </>
  );
}
