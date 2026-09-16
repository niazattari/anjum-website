import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '@/services/api';
import useAsync from '@/hooks/useAsync';
import { applySeo } from '@/utils/seo';
import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { GridSkeleton, ErrorState, EmptyState } from '@/components/ui/States';
import ProjectCard from '@/components/cards/ProjectCard';
import CtaBand from '@/components/sections/CtaBand';
import cn from '@/utils/cn';

export default function Portfolio() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  const { data, loading, error, reload } = useAsync(async () => {
    const [projects, categories] = await Promise.all([api.getProjects(), api.getProjectCategories()]);
    return { projects, categories };
  }, []);

  useEffect(() => {
    applySeo({
      title: 'Portfolio',
      description: 'Websites, e-commerce stores, web applications, dashboards and Google Sheets web apps — with the problem behind each build.',
      path: '/portfolio',
    });
  }, []);

  const filtered = useMemo(() => {
    let list = data?.projects ?? [];
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.short.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [data, category, query]);

  const counts = useMemo(() => {
    const all = data?.projects ?? [];
    return (data?.categories ?? []).map((c) => ({
      ...c,
      count: c.id === 'all' ? all.length : all.filter((p) => p.category === c.id).length,
    }));
  }, [data]);

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Work, and the problems behind it"
        description="Each entry is a case study rather than a screenshot: what was not working, what was built, what changed afterwards."
        breadcrumbs={[{ label: 'Portfolio' }]}
      />

      <Section>
        {/* Filters */}
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 lg:flex-wrap lg:overflow-visible lg:pb-0">
            {counts.filter((c) => c.count > 0 || c.id === 'all').map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                aria-pressed={category === c.id}
                className={cn(
                  'shrink-0 rounded-xl border px-4 py-2 text-[0.83rem] font-semibold transition-all',
                  category === c.id
                    ? 'border-transparent bg-gradient-to-r from-brand to-accent text-white shadow-glow'
                    : 'text-muted hover:border-brand/40 hover:text-ink'
                )}
              >
                {c.name}
                <span className={cn('ml-1.5 text-[0.72rem]', category === c.id ? 'text-white/70' : 'text-faint')}>
                  {c.count}
                </span>
              </button>
            ))}
          </div>

          <label className="relative shrink-0 lg:w-64">
            <span className="sr-only">Search projects</span>
            <Icon name="Search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects or tech…"
              className="h-11 w-full rounded-xl border bg-surface pl-10 pr-4 text-[0.88rem] text-ink placeholder:text-faint focus:border-brand/50 focus:outline-none"
            />
          </label>
        </div>

        {error ? (
          <ErrorState onRetry={reload} />
        ) : loading ? (
          <GridSkeleton count={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No projects match that filter"
            description="Try a different category, or clear the search to see everything."
            action={
              <Button variant="secondary" onClick={() => { setCategory('all'); setQuery(''); }}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </Section>

      <Section className="pb-24 pt-4">
        <CtaBand
          title="Want something similar?"
          description="Describe what your business needs and you will get a written scope and a fixed quotation, usually within 24 hours."
        />
      </Section>
    </>
  );
}
