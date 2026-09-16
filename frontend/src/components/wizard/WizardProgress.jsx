import Icon from '@/components/ui/Icon';
import cn from '@/utils/cn';

export default function WizardProgress({ steps, current, onJump, furthest }) {
  const percent = Math.round(((current - 1) / (steps.length - 1)) * 100);

  return (
    <div>
      {/* Mobile */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between text-[0.8rem]">
          <span className="font-semibold text-ink">
            Step {current} of {steps.length}
          </span>
          <span className="text-muted">{steps[current - 1].title}</span>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all duration-500"
            style={{ width: `${Math.max(percent, 6)}%` }}
          />
        </div>
      </div>

      {/* Desktop */}
      <ol className="hidden lg:block">
        {steps.map((step) => {
          const done = step.id < current;
          const active = step.id === current;
          const reachable = step.id <= furthest;

          return (
            <li key={step.id} className="relative pb-7 last:pb-0">
              {step.id !== steps.length && (
                <span
                  className={cn(
                    'absolute left-[1.05rem] top-9 h-[calc(100%-1.5rem)] w-px',
                    done ? 'bg-gradient-to-b from-brand to-accent' : 'bg-line/12'
                  )}
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump(step.id)}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex w-full items-center gap-3.5 rounded-lg text-left transition-opacity',
                  !reachable && 'cursor-not-allowed opacity-45'
                )}
              >
                <span
                  className={cn(
                    'relative z-10 flex h-[2.1rem] w-[2.1rem] shrink-0 items-center justify-center rounded-xl border transition-all',
                    done && 'border-transparent bg-gradient-to-br from-brand to-accent text-white',
                    active && 'border-brand/60 bg-brand/12 text-brand',
                    !done && !active && 'bg-surface text-faint'
                  )}
                >
                  <Icon name={done ? 'Check' : step.icon} className="h-4 w-4" strokeWidth={done ? 3 : 1.9} />
                </span>
                <span className="min-w-0">
                  <span className={cn('block text-[0.86rem] font-semibold', active ? 'text-ink' : 'text-muted')}>
                    {step.title}
                  </span>
                  <span className="block text-[0.72rem] text-faint">Step {step.id}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
