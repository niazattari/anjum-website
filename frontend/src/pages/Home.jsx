import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import useAsync from '@/hooks/useAsync';
import { applySeo, applyStructuredData, organizationSchema } from '@/utils/seo';

import Hero from '@/components/home/Hero';
import Section, { SectionHeading } from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import { GridSkeleton, ErrorState } from '@/components/ui/States';
import SampleNotice from '@/components/ui/SampleNotice';

import TechMarquee from '@/components/sections/TechMarquee';
import StatsBand from '@/components/sections/StatsBand';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import FaqAccordion from '@/components/sections/FaqAccordion';
import TestimonialsCarousel from '@/components/sections/TestimonialsCarousel';
import CtaBand from '@/components/sections/CtaBand';

import ServiceCard from '@/components/cards/ServiceCard';
import ProjectCard from '@/components/cards/ProjectCard';
import WebAppCard from '@/components/cards/WebAppCard';
import { sourceProducts } from '@/data/sourceCode';

export default function Home() {
  const { data, loading, error, reload } = useAsync(async () => {
    const [services, projects, webApps, technologies, stats, testimonials, faqs, process, advantages] =
      await Promise.all([
        api.getServices(), api.getProjects(), api.getWebApps(), api.getTechnologies(),
        api.getStats(), api.getTestimonials(), api.getFaqs(), api.getProcess(), api.getAdvantages(),
      ]);
    return { services, projects, webApps, technologies, stats, testimonials, faqs, process, advantages };
  }, []);

  useEffect(() => {
    applySeo({ path: '/' });
    applyStructuredData('org-schema', organizationSchema());
  }, []);

  if (error) {
    return <Section><ErrorState onRetry={reload} /></Section>;
  }

  const stats = data?.stats ?? [];
  const featuredProjects = (data?.projects ?? []).filter((p) => p.featured).slice(0, 6);
  const featuredServices = (data?.services ?? []).filter((s) => s.featured).slice(0, 6);
  const featuredWebApps = (data?.webApps ?? []).slice(0, 6);
  const homeFaqs = (data?.faqs ?? []).slice(0, 6);
  const advantages = data?.advantages ?? [];

  return (
    <>
      {/* Technology strip sits directly under the header */}
      {data?.technologies && <TechMarquee technologies={data.technologies} />}

      <Hero stats={stats} />

      {/* Services */}
      <Section id="services">
        <SectionHeading
          eyebrow="What I do"
          title="Everything you need to build your digital presence"
          description="From a first business website to a custom system that runs your operations — each service is scoped, quoted and delivered as a complete piece of work."
        />
        <div className="mt-14">
          {loading ? (
            <GridSkeleton count={6} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service, i) => (
                <Reveal key={service.id} delay={i * 0.05}>
                  <ServiceCard service={service} compact />
                </Reveal>
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Button to="/services" variant="secondary" iconRight="ArrowRight">See all services</Button>
          </div>
        </div>
      </Section>

      {/* Featured work */}
      <Section tone="surface">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Selected work"
            title="Projects, and the problems behind them"
            description="Real systems, built and running. Every one started with something that was not working — open any of them to read what changed."
            className="max-w-2xl"
          />
          <Button to="/portfolio" variant="secondary" iconRight="ArrowRight" className="shrink-0">
            View all work
          </Button>
        </div>

        <div className="mt-12">
          {loading ? (
            <GridSkeleton count={6} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project, i) => (
                <Reveal key={project.id} delay={i * 0.05}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Google Sheets / web apps */}
      <Section>
        <SectionHeading
          eyebrow="Google Sheets & Apps Script"
          title="Turn the spreadsheet you already use into a real application"
          description="Your data stays in Google Sheets. What changes is how people work with it: forms instead of raw cells, validation instead of typos, permissions instead of everyone seeing everything."
        />

        <div className="mt-14">
          {loading ? (
            <GridSkeleton count={6} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredWebApps.map((app, i) => (
                <Reveal key={app.id} delay={i * 0.05}>
                  <WebAppCard app={app} />
                </Reveal>
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Button to="/web-apps" variant="secondary" iconRight="ArrowRight">
              See the full web app catalogue
            </Button>
          </div>
        </div>
      </Section>

      {/* Source code */}
      <Section tone="surface">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Source code"
            title="Or buy a system outright and run it yourself"
            description="Several of the applications above are available as a complete download — the whole repository, the documentation, and the sample data. No subscription, no licence server, no one to ask permission from."
            className="max-w-2xl"
          />
          <Button to="/source-code" variant="secondary" iconRight="ArrowRight" className="shrink-0">
            Browse source code
          </Button>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sourceProducts.slice(0, 4).map((product, i) => (
            <Reveal key={product.id} delay={i * 0.05}>
              <Link
                to="/source-code"
                className="group flex h-full flex-col rounded-2xl border bg-surface/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl ring-1"
                  style={{ background: `${product.accent}1A`, color: product.accent, borderColor: 'transparent' }}
                >
                  <Icon name="Braces" className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[0.98rem] font-bold leading-snug text-ink group-hover:text-brand">
                  {product.name}
                </h3>
                <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">{product.tagline}</p>
                <span className="mt-auto pt-4 text-[0.78rem] font-semibold text-brand">
                  {product.price ? `${product.currency} ${product.price}` : 'Ask for the price'}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Stats */}
      <Section className="py-8">
        {!loading && stats.length > 0 && <StatsBand stats={stats} />}
      </Section>

      {/* Why choose me */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="Why work with me"
          title="A developer, not a template service"
          description="What you get is a system built for your business, explained in plain language, that you own completely at the end."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((advantage, i) => (
            <Reveal key={advantage.id} delay={i * 0.04}>
              <div className="group h-full rounded-2xl border bg-surface/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40">
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

      {/* Process */}
      <Section>
        <SectionHeading
          eyebrow="How it works"
          title="A process with no surprises in it"
          description="Seven stages from first conversation to post-launch support. You know what happens next at every point, and what it costs before it starts."
        />
        <div className="mx-auto mt-14 max-w-5xl">
          {data?.process && <ProcessTimeline steps={data.process} />}
        </div>
        <div className="mt-4 text-center">
          <Button to="/process" variant="secondary" iconRight="ArrowRight">See the full process</Button>
        </div>
      </Section>

      {/* Testimonials */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="Client feedback"
          title="What clients say"
          description="Real quotes belong here once projects are delivered — added and managed from the admin panel."
        />
        <div className="mx-auto mt-10 max-w-4xl">
          <SampleNotice className="mb-8">
            These are placeholder entries showing the layout only — not real client feedback. Replace them with
            attributed quotes, or disable the section, before the site goes live.
          </SampleNotice>
          {data?.testimonials && <TestimonialsCarousel testimonials={data.testimonials} />}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            align="left"
            eyebrow="Questions"
            title="The things people ask before starting"
            description="If your question is not here, message me on WhatsApp and you will get a straight answer."
          />
          <div>
            {data?.faqs && <FaqAccordion items={homeFaqs} defaultOpen={homeFaqs[0]?.id} />}
            <div className="mt-6">
              <Link to="/faq" className="inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-brand hover:text-accent">
                Read all frequently asked questions
                <Icon name="ArrowRight" className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section className="pb-24 pt-0">
        <CtaBand />
      </Section>
    </>
  );
}
