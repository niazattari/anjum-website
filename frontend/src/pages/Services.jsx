import { useEffect } from 'react';
import api from '@/services/api';
import useAsync from '@/hooks/useAsync';
import { applySeo } from '@/utils/seo';
import PageHero from '@/components/ui/PageHero';
import Section, { SectionHeading } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { GridSkeleton, ErrorState } from '@/components/ui/States';
import ServiceCard from '@/components/cards/ServiceCard';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import CtaBand from '@/components/sections/CtaBand';

export default function Services() {
  const { data, loading, error, reload } = useAsync(async () => {
    const [services, process] = await Promise.all([api.getServices(), api.getProcess()]);
    return { services, process };
  }, []);

  useEffect(() => {
    applySeo({
      title: 'Services',
      description: 'Website development, web applications, Google Sheets web apps, business automation, e-commerce, dashboards and maintenance.',
      path: '/services',
    });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything you need to build your digital presence"
        description="Eight services covering the full range — from a first business website to a custom system that runs your operations. Each one is scoped and quoted in writing before any work starts."
        breadcrumbs={[{ label: 'Services' }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button to="/start-project" size="lg" iconRight="ArrowRight">Start your project</Button>
          <Button to="/portfolio" variant="secondary" size="lg" icon="Eye">See the work</Button>
        </div>
      </PageHero>

      <Section>
        {error ? (
          <ErrorState onRetry={reload} />
        ) : loading ? (
          <GridSkeleton count={8} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.services.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.04}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Not sure which one you need?"
          title="Start from the problem, not the product"
          description="Most people arrive describing a symptom rather than a service. That is fine — describe what is going wrong and the right approach usually becomes obvious in the first conversation."
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {[
            { icon: 'MessagesSquare', title: 'You have no website at all', text: 'Start with a business website. It is the smallest useful thing and everything else can be added later.' },
            { icon: 'Table2', title: 'Your team lives in spreadsheets', text: 'A Google Sheets web app is usually the fastest and cheapest fix — the data stays where it is.' },
            { icon: 'Workflow', title: 'The same task eats hours weekly', text: 'That is automation. Often a matter of days, and it pays for itself quickly.' },
            { icon: 'Database', title: 'You have outgrown your tools', text: 'A custom web application with a real database, proper roles and reporting.' },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <div className="flex h-full gap-4 rounded-2xl border bg-surface/60 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/12 text-brand">
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[0.98rem] font-bold text-ink">{c.title}</h3>
                  <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted">{c.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="How it works" title="The same process for every service" />
        <div className="mx-auto mt-14 max-w-5xl">
          {data?.process && <ProcessTimeline steps={data.process} />}
        </div>
      </Section>

      <Section className="pb-24 pt-0">
        <CtaBand
          title="Tell me what you need built"
          description="The project form takes a few minutes and covers everything needed to quote accurately — no back-and-forth just to understand the scope."
        />
      </Section>
    </>
  );
}
