import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import { formatShortDate } from '@/utils/format';

export default function PostCard({ post, featured = false }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface/60 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lift">
      <div
        className={featured ? 'relative h-44 overflow-hidden' : 'relative h-28 overflow-hidden'}
        style={{ background: `linear-gradient(135deg, ${post.accent}44, transparent 70%)` }}
        aria-hidden="true"
      >
        <div className="grid-backdrop absolute inset-0 opacity-60" />
        <div
          className="absolute -bottom-8 -right-6 h-24 w-24 rounded-full blur-2xl"
          style={{ background: post.accent, opacity: 0.35 }}
        />
        <span
          className="absolute left-4 top-4 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white"
          style={{ background: `${post.accent}cc` }}
        >
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[0.72rem] text-faint">
          <span>{formatShortDate(post.date)}</span>
          <span className="h-1 w-1 rounded-full bg-faint" />
          <span>{post.readingTime} min read</span>
        </div>

        <h3 className="mt-2 text-[1.05rem] font-bold leading-snug text-ink transition-colors group-hover:text-brand">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-[0.86rem] leading-relaxed text-muted">{post.excerpt}</p>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.85rem] font-semibold text-brand">
          Read article
          <Icon name="ArrowRight" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>

      <Link to={`/blog/${post.slug}`} className="absolute inset-0" aria-label={post.title} />
    </article>
  );
}
