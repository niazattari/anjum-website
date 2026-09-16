import cn from '@/utils/cn';
import Badge from './Badge';
import Reveal from './Reveal';

export function SectionHeading({ eyebrow, title, description, align = 'center', className, tone = 'brand' }) {
  return (
    <Reveal className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <Badge tone={tone} className="mb-4">{eyebrow}</Badge>}
      <h2 className="text-display-md text-ink">{title}</h2>
      {description && <p className="mt-4 text-[1.02rem] leading-relaxed text-muted">{description}</p>}
    </Reveal>
  );
}

export default function Section({ id, children, className, container = true, tone = 'default', ...rest }) {
  const tones = {
    default: '',
    surface: 'bg-surface/50',
    elevated: 'bg-elevated/40',
  };
  return (
    <section id={id} className={cn('relative py-20 sm:py-24', tones[tone], className)} {...rest}>
      {container ? <div className="container relative">{children}</div> : children}
    </section>
  );
}
