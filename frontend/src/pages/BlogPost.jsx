import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';
import useAsync from '@/hooks/useAsync';
import { applySeo, applyStructuredData } from '@/utils/seo';
import { formatDate } from '@/utils/format';
import { site } from '@/data/site';
import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { LoadingBlock, EmptyState } from '@/components/ui/States';
import PostCard from '@/components/cards/PostCard';
import CtaBand from '@/components/sections/CtaBand';

function Content({ blocks }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.type === 'h2') {
          return <h2 key={i} className="pt-6 text-[1.4rem] font-bold text-ink">{block.text}</h2>;
        }
        if (block.type === 'ul') {
          return (
            <ul key={i} className="space-y-2.5 rounded-2xl border bg-surface/50 p-5">
              {block.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Icon name="CornerDownRight" className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" />
                  <span className="text-[0.95rem] leading-relaxed text-muted">{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={i} className="text-[1rem] leading-[1.75] text-muted">{block.text}</p>;
      })}
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const { data, loading, error } = useAsync(async () => {
    const post = await api.getPost(slug);
    const related = await api.getRelatedPosts(post);
    return { post, related };
  }, [slug]);

  useEffect(() => {
    if (data?.post) {
      applySeo({
        title: data.post.title,
        description: data.post.excerpt,
        path: `/blog/${slug}`,
        type: 'article',
      });
      applyStructuredData('article-schema', {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: data.post.title,
        description: data.post.excerpt,
        datePublished: data.post.date,
        author: { '@type': 'Person', name: data.post.author },
        publisher: { '@type': 'Organization', name: site.name },
      });
    }
    return () => applyStructuredData('article-schema', null);
  }, [data, slug]);

  if (loading) return <LoadingBlock label="Loading article" />;

  if (error || !data?.post) {
    return (
      <Section className="pt-32">
        <EmptyState
          icon="Newspaper"
          title="Article not found"
          description="That article does not exist, or its address has changed."
          action={<Button to="/blog" icon="ArrowLeft">Back to the blog</Button>}
        />
      </Section>
    );
  }

  const { post, related } = data;

  return (
    <>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[{ label: 'Blog', to: '/blog' }, { label: post.title }]}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.83rem] text-muted">
          <span className="flex items-center gap-1.5"><Icon name="Calendar" className="h-4 w-4 text-brand" />{formatDate(post.date)}</span>
          <span className="flex items-center gap-1.5"><Icon name="Clock" className="h-4 w-4 text-brand" />{post.readingTime} min read</span>
          <span className="flex items-center gap-1.5"><Icon name="UserSquare" className="h-4 w-4 text-brand" />{post.author}</span>
        </div>
      </PageHero>

      <Section className="pt-12">
        <div className="mx-auto max-w-3xl">
          <article>
            <Content blocks={post.content} />
          </article>

          <div className="mt-10 flex flex-wrap items-center gap-2 border-t pt-8">
            <Icon name="Tag" className="h-4 w-4 text-faint" />
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-elevated px-2.5 py-1 text-[0.75rem] font-medium text-muted">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-brand hover:text-accent">
              <Icon name="ArrowLeft" className="h-4 w-4" />
              All articles
            </Link>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="surface">
          <h2 className="text-display-md text-ink">Related reading</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </Section>
      )}

      <Section className="pb-24 pt-0">
        <CtaBand title="Recognise your own situation here?" />
      </Section>
    </>
  );
}
