import Icon from '@/components/ui/Icon';
import { SampleChip } from '@/components/ui/SampleNotice';
import { initials } from '@/utils/format';

export default function TestimonialCard({ testimonial }) {
  return (
    <figure className="flex h-full min-w-0 flex-col rounded-2xl border bg-surface/60 p-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5" aria-label={`${testimonial.rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon
              key={i}
              name="Star"
              className={i < testimonial.rating ? 'h-4 w-4 fill-amber-400 text-amber-400' : 'h-4 w-4 text-faint'}
            />
          ))}
        </div>
        {testimonial.isSample && <SampleChip />}
      </div>

      <Icon name="Quote" className="mt-4 h-7 w-7 text-brand/25" />
      <blockquote className="mt-2 flex-1 text-[0.92rem] leading-relaxed text-muted">
        {testimonial.quote}
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand/20 to-accent/20 text-[0.8rem] font-bold text-brand">
          {initials(testimonial.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.9rem] font-semibold text-ink">{testimonial.name}</p>
          <p className="truncate text-[0.78rem] text-muted">
            {testimonial.position}, {testimonial.company}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
