import { Link } from 'react-router-dom';
import Badge from './Badge';
import Icon from './Icon';
import Reveal from './Reveal';
import cn from '@/utils/cn';

export function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-[0.78rem] text-muted">
        <li><Link to="/" className="transition-colors hover:text-ink">Home</Link></li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <Icon name="ChevronRight" className="h-3.5 w-3.5 text-faint" />
            {item.to && i < items.length - 1 ? (
              <Link to={item.to} className="transition-colors hover:text-ink">{item.label}</Link>
            ) : (
              <span className="text-ink" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function PageHero({ eyebrow, title, description, breadcrumbs, children, className, align = 'left' }) {
  return (
    <header className={cn('relative overflow-hidden border-b pt-28 pb-14 sm:pt-32 sm:pb-16', className)}>
      <div className="grid-backdrop absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="glow-orb -top-24 left-[10%] h-64 w-64 bg-brand/25" aria-hidden="true" />
      <div className="glow-orb -top-10 right-[8%] h-56 w-56 bg-accent/20" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-bg" aria-hidden="true" />

      <div className={cn('container relative', align === 'center' && 'text-center')}>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <Reveal className={cn('max-w-3xl', align === 'center' && 'mx-auto')}>
          {eyebrow && <Badge tone="brand" className="mb-4">{eyebrow}</Badge>}
          <h1 className="text-display-lg text-ink">{title}</h1>
          {description && <p className="mt-5 text-lg leading-relaxed text-muted">{description}</p>}
          {children && <div className="mt-8">{children}</div>}
        </Reveal>
      </div>
    </header>
  );
}
