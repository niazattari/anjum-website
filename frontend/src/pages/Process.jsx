import { useEffect } from 'react';
import api from '@/services/api';
import useAsync from '@/hooks/useAsync';
import { applySeo } from '@/utils/seo';
import PageHero from '@/components/ui/PageHero';
import Section, { SectionHeading } from '@/components/ui/Section';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import { LoadingBlock } from '@/components/ui/States';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import FaqAccordion from '@/components/sections/FaqAccordion';
import CtaBand from '@/components/sections/CtaBand';

const principles = [
  { icon: 'ClipboardList', title: 'Scope in writing', text: 'Everything included is written down before work starts, so "I thought that was part of it" never happens.' },
  { icon: 'Eye', title: 'Visible progress', text: 'A staging link from the first week. You watch it get built rather than waiting for a reveal.' },
  { icon: 'MessagesSquare', title: 'One conversation thread', text: 'Updates in one place, in plain language, at a predictable rhythm.' },
  { icon: 'ShieldCheck', title: 'No lock-in', text: 'Code, database and hosting are in your name. You can take the project elsewhere at any point.' },
];

export default function Process() {
  const { data, loading } = useAsync(async () => {
    const [process, faqs] = await Promise.all([api.getProcess(), api.getFaqs()]);
    return { process, faqs };
  }, []);

  useEffect(() => {
    applySeo({
      title: 'Process',
      description: 'Seven stages from requirement to post-launch support — what happens at each one and what you receive.',
      path: '/process',
    });
  }, []);

  const processFaqs = (data?.faqs ?? []).filter((f) => f.category === 'Process');

  return (
    <>
      <PageHero
        eyebrow="Process"
        title="A process with no surprises in it"
        description="Seven stages from the first conversation to post-launch support. You know what happens next at every point, what you need to provide, and what it costs before it begins."
        breadcrumbs={[{ label: 'Process' }]}
      />

      <Section className="pt-12">
        {loading ? <LoadingBlock /> : (
          <div className="mx-auto max-w-5xl">
            <ProcessTimeline steps={data.process} detailed />
          </div>
        )}
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Principles"
          title="How the work is run"
          description="The process matters less than the habits behind it. These four are what actually keep projects on track."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="h-full rounded-2xl border bg-surface/60 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand/15 to-accent/15 text-brand ring-1 ring-brand/20">
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[1rem] font-bold text-ink">{p.title}</h3>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {processFaqs.length > 0 && (
        <Section>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <SectionHeading
              align="left"
              eyebrow="Questions"
              title="About working together"
            />
            <FaqAccordion items={processFaqs} defaultOpen={processFaqs[0]?.id} />
          </div>
        </Section>
      )}

      <Section className="pb-24 pt-0">
        <CtaBand
          title="Start at stage one"
          description="The project form is the requirement stage in written form. Fill it in and the conversation starts with everything already on the table."
        />
      </Section>
    </>
  );
}
