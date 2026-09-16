import cn from '@/utils/cn';
import Icon from './Icon';
import Button from './Button';

export function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} />;
}

export function CardSkeleton() {
  return (
    <div className="surface-card p-6">
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="mt-5 h-4 w-24" />
      <Skeleton className="mt-3 h-6 w-3/4" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
    </div>
  );
}

export function GridSkeleton({ count = 6, className }) {
  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}

export function EmptyState({ icon = 'Search', title, description, action }) {
  return (
    <div className="surface-card flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-elevated text-muted">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ onRetry, message }) {
  return (
    <EmptyState
      icon="AlertCircle"
      title="Something went wrong"
      description={message || 'The content could not be loaded. This is usually a temporary connection problem.'}
      action={onRetry ? <Button variant="secondary" icon="ArrowRight" onClick={onRetry}>Try again</Button> : null}
    />
  );
}

export function LoadingBlock({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-sm text-muted">
      <Icon name="Loader2" className="h-4 w-4 animate-spin" />
      {label}…
    </div>
  );
}
