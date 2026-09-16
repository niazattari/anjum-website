import { useEffect, useMemo, useState } from 'react';
import api from '@/services/api';
import useAsync from '@/hooks/useAsync';
import { applySeo, applyStructuredData } from '@/utils/seo';
import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { LoadingBlock, EmptyState } from '@/components/ui/States';
import FaqAccordion from '@/components/sections/FaqAccordion';
import CtaBand from '@/components/sections/CtaBand';
import { useSettings } from '@/context/SettingsContext';
import { whatsappLink, whatsappMessages } from '@/utils/whatsapp';
import cn from '@/utils/cn';

export default function Faq() {
  const site = useSettings();
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const { data, loading } = useAsync(() => api.getFaqs(), []);

  useEffect(() => {
    applySeo({
      title: 'Frequently asked questions',
      description: 'Costs, timelines, process, ownership, hosting, maintenance and how projects run.',
      path: '/faq',
    });
    return () => applyStructuredData('faq-schema', null);
  }, []);

  useEffect(() => {
    if (!data) return;
    applyStructuredData('faq-schema', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }, [data]);

  const categories = useMemo(() => ['All', ...new Set((data ?? []).map((f) => f.category))], [data]);

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (category !== 'All') list = list.filter((f) => f.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
    }
    return list;
  }, [data, category, query]);

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions people ask before starting"
        description="Costs, timelines, what you need to provide, who owns the code, and what happens after launch."
        breadcrumbs={[{ label: 'FAQ' }]}
      />

      <Section className="pt-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={cn(
                    'shrink-0 rounded-xl border px-3.5 py-2 text-[0.8rem] font-semibold transition-all',
                    category === c
                      ? 'border-transparent bg-gradient-to-r from-brand to-accent text-white shadow-glow'
                      : 'text-muted hover:border-brand/40 hover:text-ink'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <label className="relative shrink-0 sm:w-56">
              <span className="sr-only">Search questions</span>
              <Icon name="Search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="h-11 w-full rounded-xl border bg-surface pl-10 pr-4 text-[0.88rem] text-ink placeholder:text-faint focus:border-brand/50 focus:outline-none"
              />
            </label>
          </div>

          {loading ? <LoadingBlock /> : filtered.length === 0 ? (
            <EmptyState
              title="No matching questions"
              description="Nothing here answers that. Message me directly and you will get a straight answer."
              action={
                <Button href={whatsappLink(site.contact.whatsapp, whatsappMessages.general)} variant="whatsapp" icon="MessageCircle">
                  Ask on WhatsApp
                </Button>
              }
            />
          ) : (
            <FaqAccordion items={filtered} defaultOpen={filtered[0]?.id} />
          )}
        </div>
      </Section>

      <Section className="pb-24 pt-4">
        <CtaBand
          title="Still have a question?"
          description="Message me directly. Questions before a project starts are free and usually save both of us time later."
        />
      </Section>
    </>
  );
}
