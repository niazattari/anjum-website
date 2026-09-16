import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import cn from '@/utils/cn';

/**
 * Alternating process timeline.
 *
 * The icon is positioned against the full-width <li> — never against the
 * half-width content column with a negative offset — so nothing can ever be
 * clipped at the container edge, at any breakpoint.
 */
export default function ProcessTimeline({ steps, detailed = false }) {
  return (
    <ol className="relative">
      {/* Rail: left on mobile, centred from md up */}
      <span
        aria-hidden="true"
        className="absolute left-[1.375rem] top-6 bottom-6 w-px bg-gradient-to-b from-brand via-accent/45 to-transparent md:left-1/2 md:-translate-x-1/2"
      />

      {steps.map((step, i) => {
        const rightSide = i % 2 !== 0;

        return (
          <li key={step.id} className="relative pb-10 last:pb-0">
            {/* Node */}
            <span
              className="absolute left-0 top-1 z-10 flex h-11 w-11 items-center justify-center rounded-xl border bg-surface text-brand shadow-soft md:left-1/2 md:-translate-x-1/2"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand/12 to-accent/12" aria-hidden="true" />
              <Icon name={step.icon} className="relative h-5 w-5" />
            </span>

            <Reveal
              delay={0.04 * i}
              className={cn(
                'pl-16 md:w-1/2 md:pl-0',
                rightSide ? 'md:ml-auto md:pl-14' : 'md:pr-14 md:text-right'
              )}
            >
              <span className="font-mono text-[0.72rem] font-semibold tracking-widest text-accent">
                {step.number}
              </span>
              <h3 className="mt-1 text-[1.12rem] font-bold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted">
                {detailed ? step.detail : step.summary}
              </p>

              {detailed && (
                <ul className={cn('mt-4 flex flex-wrap gap-1.5', !rightSide && 'md:justify-end')}>
                  {step.deliverables.map((d) => (
                    <li key={d} className="rounded-md border bg-elevated/60 px-2 py-1 text-[0.7rem] font-medium text-muted">
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
