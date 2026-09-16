import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import cn from '@/utils/cn';

export default function FaqAccordion({ items, defaultOpen = null }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="divide-y overflow-hidden rounded-2xl border bg-surface/50">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-elevated/60 sm:px-6"
              >
                <span className={cn('text-[0.98rem] font-semibold', isOpen ? 'text-brand' : 'text-ink')}>
                  {item.question}
                </span>
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-300',
                    isOpen ? 'rotate-180 border-brand/40 bg-brand/10 text-brand' : 'text-muted'
                  )}
                >
                  <Icon name="ChevronDown" className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-6 text-[0.92rem] leading-relaxed text-muted sm:px-6 sm:pr-16">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
