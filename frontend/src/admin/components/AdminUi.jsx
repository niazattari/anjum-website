import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import cn from '@/utils/cn';

/** Page header with an optional action slot. */
export function PageHeader({ title, description, children }) {
  return (
    <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[1.45rem] font-bold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-[0.88rem] text-muted">{description}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap gap-2.5">{children}</div>}
    </header>
  );
}

export function Card({ title, subtitle, action, children, className, padded = true }) {
  return (
    <section className={cn('rounded-2xl border bg-surface/70', className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-[0.95rem] font-bold text-ink">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-[0.78rem] text-muted">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={padded ? 'p-5' : ''}>{children}</div>
    </section>
  );
}

const statusTones = {
  new: 'bg-blue-500/12 text-blue-500 border-blue-500/25',
  contacted: 'bg-cyan-500/12 text-cyan-500 border-cyan-500/25',
  discussion: 'bg-violet-500/12 text-violet-500 border-violet-500/25',
  quotation_sent: 'bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/25',
  approved: 'bg-emerald-500/12 text-emerald-500 border-emerald-500/25',
  in_development: 'bg-indigo-500/12 text-indigo-500 border-indigo-500/25',
  completed: 'bg-emerald-600/12 text-emerald-600 border-emerald-600/25',
  cancelled: 'bg-red-500/12 text-red-500 border-red-500/25',
  read: 'bg-elevated text-muted border-line/15',
  replied: 'bg-emerald-500/12 text-emerald-500 border-emerald-500/25',
  archived: 'bg-elevated text-faint border-line/15',
};

/** Status is never colour alone — the label is always spelled out. */
export function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold capitalize',
        statusTones[status] || 'bg-elevated text-muted border-line/15'
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {String(status).replace(/_/g, ' ')}
    </span>
  );
}

export function Toolbar({ children }) {
  return <div className="mb-5 flex flex-wrap items-center gap-2.5">{children}</div>;
}

export function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <label className="relative min-w-[12rem] flex-1 sm:max-w-xs">
      <span className="sr-only">{placeholder}</span>
      <Icon name="Search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border bg-surface pl-9 pr-3 text-[0.86rem] text-ink placeholder:text-faint focus:border-brand/50 focus:outline-none"
      />
    </label>
  );
}

/** Toast that announces itself to screen readers and clears on a timer. */
export function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onDismiss, toast.type === 'error' ? 6000 : 3200);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-2.5 rounded-xl border px-4 py-3 text-[0.85rem] shadow-lift backdrop-blur',
        isError
          ? 'border-red-500/30 bg-red-500/10 text-red-500'
          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      )}
    >
      <Icon name={isError ? 'AlertCircle' : 'CheckCircle2'} className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="flex-1">{toast.message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss" className="shrink-0 opacity-60 hover:opacity-100">
        <Icon name="X" className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);

  return {
    toast,
    dismiss: () => setToast(null),
    success: (message) => setToast({ type: 'success', message }),
    error: (message) => setToast({ type: 'error', message }),
  };
}

export function ConfirmDialog({ open, title, body, confirmLabel = 'Delete', onConfirm, onCancel, busy }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-2xl border bg-surface p-6 shadow-lift">
        <h2 className="text-[1.05rem] font-bold text-ink">{title}</h2>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{body}</p>
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border px-4 py-2 text-[0.85rem] font-semibold text-muted transition-colors hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-xl bg-red-500 px-4 py-2 text-[0.85rem] font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Editor for the plain string lists used by features, deliverables and tags. */
export function ListEditor({ label, value = [], onChange, placeholder = 'Add an item' }) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setDraft('');
  };

  const move = (index, delta) => {
    const next = [...value];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <span className="mb-2 block text-[0.85rem] font-semibold text-ink">{label}</span>

      <ul className="mb-2.5 space-y-1.5">
        {value.map((item, i) => (
          <li key={`${item}-${i}`} className="flex items-center gap-2 rounded-lg border bg-surface px-3 py-2">
            <span className="min-w-0 flex-1 truncate text-[0.83rem] text-ink">{item}</span>
            <button type="button" onClick={() => move(i, -1)} aria-label="Move up" disabled={i === 0}
              className="rounded p-1 text-faint transition-colors hover:text-ink disabled:opacity-30">
              <Icon name="ChevronDown" className="h-3.5 w-3.5 rotate-180" />
            </button>
            <button type="button" onClick={() => move(i, 1)} aria-label="Move down" disabled={i === value.length - 1}
              className="rounded p-1 text-faint transition-colors hover:text-ink disabled:opacity-30">
              <Icon name="ChevronDown" className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={() => onChange(value.filter((_, x) => x !== i))} aria-label={`Remove ${item}`}
              className="rounded p-1 text-faint transition-colors hover:text-red-500">
              <Icon name="X" className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="h-10 flex-1 rounded-xl border bg-surface px-3 text-[0.86rem] text-ink placeholder:text-faint focus:border-brand/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-xl border px-3.5 text-[0.83rem] font-semibold text-muted transition-colors hover:border-brand/40 hover:text-ink"
        >
          Add
        </button>
      </div>
    </div>
  );
}
