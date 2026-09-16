import { forwardRef } from 'react';
import cn from '@/utils/cn';
import Icon from './Icon';

const base =
  'w-full rounded-xl border bg-surface px-4 text-[0.92rem] text-ink placeholder:text-faint ' +
  'transition-colors focus:border-brand/60 focus:outline-none disabled:opacity-60';

export function Label({ htmlFor, children, required, hint }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[0.85rem] font-semibold text-ink">
      {children}
      {required && <span className="ml-1 text-brand">*</span>}
      {hint && <span className="ml-2 font-normal text-faint">{hint}</span>}
    </label>
  );
}

export function FieldError({ children }) {
  if (!children) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[0.78rem] font-medium text-red-500">
      <Icon name="AlertCircle" className="h-3.5 w-3.5" />
      {children}
    </p>
  );
}

export const Input = forwardRef(function Input({ label, error, required, hint, className, id, ...rest }, ref) {
  const fieldId = id || rest.name;
  return (
    <div className={className}>
      {label && <Label htmlFor={fieldId} required={required} hint={hint}>{label}</Label>}
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(base, 'h-12', error && 'border-red-500/60')}
        {...rest}
      />
      <span id={`${fieldId}-error`}><FieldError>{error}</FieldError></span>
    </div>
  );
});

export const Textarea = forwardRef(function Textarea({ label, error, required, hint, className, id, rows = 5, ...rest }, ref) {
  const fieldId = id || rest.name;
  return (
    <div className={className}>
      {label && <Label htmlFor={fieldId} required={required} hint={hint}>{label}</Label>}
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={cn(base, 'resize-y py-3 leading-relaxed', error && 'border-red-500/60')}
        {...rest}
      />
      <FieldError>{error}</FieldError>
    </div>
  );
});

export function Select({ label, error, required, hint, className, id, options = [], placeholder, ...rest }) {
  const fieldId = id || rest.name;
  return (
    <div className={className}>
      {label && <Label htmlFor={fieldId} required={required} hint={hint}>{label}</Label>}
      <div className="relative">
        <select
          id={fieldId}
          aria-invalid={Boolean(error)}
          className={cn(base, 'h-12 appearance-none pr-10', error && 'border-red-500/60')}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const value = typeof opt === 'string' ? opt : opt.id;
            const text = typeof opt === 'string' ? opt : opt.label;
            return <option key={value} value={value}>{text}</option>;
          })}
        </select>
        <Icon name="ChevronDown" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
      </div>
      <FieldError>{error}</FieldError>
    </div>
  );
}

/** Large selectable card — used for single and multi choice steps in the wizard. */
export function OptionCard({ selected, onClick, icon, title, description, multi = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'group relative flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all',
        selected
          ? 'border-brand/60 bg-brand/[0.07] shadow-[0_0_0_1px_rgb(var(--c-brand)/.35)]'
          : 'bg-surface hover:border-brand/35 hover:bg-elevated/60'
      )}
    >
      {icon && (
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
            selected ? 'bg-brand/15 text-brand' : 'bg-elevated text-muted group-hover:text-ink'
          )}
        >
          <Icon name={icon} className="h-4 w-4" />
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className={cn('block text-[0.88rem] font-semibold', selected ? 'text-ink' : 'text-ink')}>
          {title}
        </span>
        {description && <span className="mt-0.5 block text-[0.78rem] leading-relaxed text-muted">{description}</span>}
      </span>

      <span
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-all',
          multi ? 'rounded-md' : 'rounded-full',
          selected ? 'border-brand bg-brand text-white' : 'border-line/25'
        )}
      >
        {selected && <Icon name="Check" className="h-3 w-3" strokeWidth={3} />}
      </span>
    </button>
  );
}

/** Compact checkbox row for long feature lists. */
export function CheckRow({ checked, onChange, label }) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-[0.83rem] transition-all',
        checked ? 'border-brand/50 bg-brand/[0.07] text-ink' : 'bg-surface text-muted hover:border-brand/30 hover:text-ink'
      )}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all',
          checked ? 'border-brand bg-brand text-white' : 'border-line/25'
        )}
      >
        {checked && <Icon name="Check" className="h-2.5 w-2.5" strokeWidth={3.5} />}
      </span>
      {label}
    </label>
  );
}
