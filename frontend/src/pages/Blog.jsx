import { useEffect, useMemo, useState } from 'react';
import api from '@/services/api';
import useAsync from '@/hooks/useAsync';
import { applySeo } from '@/utils/seo';
import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import { GridSkeleton, ErrorState, EmptyState } from '@/components/ui/States';
import PostCard from '@/components/cards/PostCard';
import CtaBand from '@/components/sections/CtaBand';
import cn from '@/utils/cn';

export default function Blog() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const { data, loading, error, reload } = useAsync(() => api.getPosts(), []);

  useEffect(() => {
    applySeo({
      title: 'Blog',
      description: 'Practical writing on web development, business systems, automation and Google Sheets.',
      path: '/blog',
    });
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set((data ?? []).map((p) => p.category))],
    [data]
  );

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (category !== 'All') list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }
    return list;
  }, [data, category, query]);

  const [featured, ...rest] = filtered;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Notes on building things that businesses actually use"
        description="Practical writing about web development, spreadsheets that have outgrown themselves, automation and the decisions that come before code."
        breadcrumbs={[{ label: 'Blog' }]}
      />

      <Section>
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 lg:flex-wrap lg:overflow-visible lg:pb-0">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={cn(
                  'shrink-0 rounded-xl border px-4 py-2 text-[0.83rem] font-semibold transition-all',
                  category === c
                    ? 'border-transparent bg-gradient-to-r from-brand to-accent text-white shadow-glow'
                    : 'text-muted hover:border-brand/40 hover:text-ink'
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <label className="relative shrink-0 lg:w-64">
            <span className="sr-only">Search articles</span>
            <Icon name="Search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
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
            title="No articles found"
            description="Nothing matches that search. Try a different term or category."
            action={<Button variant="secondary" onClick={() => { setCategory('All'); setQuery(''); }}>Clear filters</Button>}
          />
        ) : (
          <>
            {featured && (
              <Reveal className="mb-8">
                <div className="grid gap-0 overflow-hidden rounded-2xl border bg-surface/60 md:grid-cols-2">
                  <div
                    className="relative min-h-[13rem] overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${featured.accent}55, transparent 70%)` }}
                  >
                    <div className="grid-backdrop absolute inset-0 opacity-60" />
                    <span
                      className="absolute left-5 top-5 rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-white"
                      style={{ background: `${featured.accent}cc` }}
                    >
                      Latest · {featured.category}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center p-7 sm:p-9">
                    <h2 className="text-[1.5rem] font-bold leading-tight text-ink">{featured.title}</h2>
                    <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{featured.excerpt}</p>
                    <div className="mt-5">
                      <Button to={`/blog/${featured.slug}`} iconRight="ArrowRight">Read article</Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.05}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </Section>

      <Section className="pb-24 pt-4">
        <CtaBand title="Have a project rather than a question?" />
      </Section>
    </>
  );
}
