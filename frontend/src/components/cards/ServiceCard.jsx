import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import useTilt from '@/hooks/useTilt';
import cn from '@/utils/cn';

export default function ServiceCard({ service, compact = false }) {
  const { ref, tiltProps } = useTilt({ max: 6 });

  return (
    <article
      ref={ref}
      {...tiltProps}
      className={cn(
        'tilt-3d group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface/70 p-6',
        'hover:border-brand/40 hover:shadow-lift'
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-gradient-to-b from-brand/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="tilt-layer relative flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand/15 to-accent/15 text-brand ring-1 ring-brand/20">
          <Icon name={service.icon} className="h-[1.35rem] w-[1.35rem]" />
        </span>
        <Icon
          name="ArrowUpRight"
          className="h-5 w-5 shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
        />
      </div>

      <h3 className="relative mt-5 text-[1.12rem] font-bold leading-snug text-ink">{service.title}</h3>
      <p className="relative mt-2.5 text-[0.88rem] leading-relaxed text-muted">{service.short}</p>

      {!compact && (
        <ul className="relative mt-5 space-y-2 border-t pt-5">
          {service.features.slice(0, 4).map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-[0.83rem] text-muted">
              <Icon name="Check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.5} />
              {feature}
            </li>
          ))}
        </ul>
      )}

      <div className="relative mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6">
        <Link
          to={`/services/${service.slug}`}
          className="text-[0.85rem] font-semibold text-brand transition-colors hover:text-accent"
        >
          Learn more
        </Link>
        <Link
          to={`/start-project?service=${service.slug}`}
          className="text-[0.85rem] font-semibold text-muted transition-colors hover:text-ink"
        >
          Request this service
        </Link>
        <span className="ml-auto text-[0.72rem] font-medium uppercase tracking-wider text-faint">
          {service.timeline}
        </span>
      </div>

      {/* Full-card link target for pointer users, without trapping keyboard focus */}
      <Link to={`/services/${service.slug}`} className="absolute inset-0" tabIndex={-1} aria-hidden="true" />
    </article>
  );
}
