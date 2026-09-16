import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TestimonialCard from '@/components/cards/TestimonialCard';
import Icon from '@/components/ui/Icon';
import cn from '@/utils/cn';

export default function TestimonialsCarousel({ testimonials }) {
  const [index, setIndex] = useState(0);
  const perView = 2;
  const pages = Math.max(1, Math.ceil(testimonials.length / perView));
  const visible = testimonials.slice(index * perView, index * perView + perView);

  const go = (dir) => setIndex((i) => (i + dir + pages) % pages);

  return (
    <div>
      <div className="min-h-[19rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-6 md:grid-cols-2 [&>*]:min-w-0"
          >
            {visible.map((t) => <TestimonialCard key={t.id} testimonial={t} />)}
          </motion.div>
        </AnimatePresence>
      </div>

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonials"
            className="flex h-10 w-10 items-center justify-center rounded-xl border text-muted transition-colors hover:border-brand/40 hover:text-ink"
          >
            <Icon name="ArrowLeft" className="h-4 w-4" />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial page ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === index ? 'w-7 bg-gradient-to-r from-brand to-accent' : 'w-2 bg-line/20 hover:bg-line/30'
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonials"
            className="flex h-10 w-10 items-center justify-center rounded-xl border text-muted transition-colors hover:border-brand/40 hover:text-ink"
          >
            <Icon name="ArrowRight" className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
