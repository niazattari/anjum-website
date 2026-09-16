import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import useTilt from '@/hooks/useTilt';

export default function WebAppCard({ app }) {
  const { ref, tiltProps } = useTilt({ max: 6 });

  return (
    <article
      ref={ref}
      {...tiltProps}
      className="tilt-3d group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface/70 p-6 hover:shadow-lift"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 opacity-70"
        style={{ background: `linear-gradient(90deg, ${app.accent}, transparent)` }}
        aria-hidden="true"
      />

      <div className="tilt-layer flex items-start gap-3.5">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1"
          style={{ background: `${app.accent}1f`, color: app.accent, boxShadow: `inset 0 0 0 1px ${app.accent}33` }}
        >
          <Icon name={app.icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-[1.05rem] font-bold leading-snug text-ink">{app.name}</h3>
          <p className="mt-0.5 text-[0.72rem] font-medium uppercase tracking-wider text-faint">
            Build time · {app.buildTime}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3.5 text-[0.86rem] leading-relaxed">
        <div>
          <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wider text-faint">The problem</p>
          <p className="text-muted">{app.problem}</p>
        </div>
        <div>
          <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wider text-faint">The system</p>
          <p className="text-muted">{app.solution}</p>
        </div>
      </div>

      <ul className="mt-5 flex flex-wrap gap-1.5">
        {app.features.slice(0, 4).map((f) => (
          <li key={f} className="rounded-md bg-elevated px-2 py-1 text-[0.68rem] font-medium text-muted">{f}</li>
        ))}
        {app.features.length > 4 && (
          <li className="rounded-md px-2 py-1 text-[0.68rem] font-medium text-faint">
            +{app.features.length - 4} more
          </li>
        )}
      </ul>

      <div className="mt-auto flex items-center justify-between pt-6">
        <Link
          to={`/web-apps/${app.slug}`}
          className="inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-brand transition-colors hover:text-accent"
        >
          Details
          <Icon name="ArrowRight" className="h-3.5 w-3.5" />
        </Link>
        <Link
          to={`/start-project?webapp=${app.slug}`}
          className="relative z-10 text-[0.85rem] font-semibold text-muted transition-colors hover:text-ink"
        >
          Request similar
        </Link>
      </div>

      <Link to={`/web-apps/${app.slug}`} className="absolute inset-0" tabIndex={-1} aria-hidden="true" />
    </article>
  );
}
