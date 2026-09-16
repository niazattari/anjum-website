import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import useCountUp from '@/hooks/useCountUp';

function StatItem({ stat, index }) {
  const { ref, value } = useCountUp(stat.value);
  return (
    <Reveal delay={index * 0.06} className="text-center">
      <div ref={ref} className="flex flex-col items-center">
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand/15 to-accent/15 text-brand ring-1 ring-brand/20">
          <Icon name={stat.icon} className="h-5 w-5" />
        </span>
        <span className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {value}
          <span className="gradient-text">{stat.suffix}</span>
        </span>
        <span className="mt-1.5 text-[0.8rem] leading-tight text-muted">{stat.label}</span>
      </div>
    </Reveal>
  );
}

export default function StatsBand({ stats }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-surface/60 px-6 py-12 shadow-soft sm:px-10">
      <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="glow-orb -left-16 top-0 h-48 w-48 bg-brand/20" aria-hidden="true" />
      <div className="glow-orb -right-16 bottom-0 h-48 w-48 bg-accent/20" aria-hidden="true" />
      <dl className="relative grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat, i) => <StatItem key={stat.id} stat={stat} index={i} />)}
      </dl>
    </div>
  );
}
