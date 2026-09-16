import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import useScrollProgress from '@/hooks/useScrollProgress';

/** Circular progress ring that doubles as a back-to-top control. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const progress = useScrollProgress();
  const circumference = 2 * Math.PI * 20;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="group fixed bottom-5 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border bg-surface/85 text-muted shadow-lift backdrop-blur transition-colors hover:text-ink sm:bottom-7 sm:left-7"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
            <circle
              cx="24" cy="24" r="20" fill="none" strokeWidth="2"
              className="stroke-line/12"
            />
            <circle
              cx="24" cy="24" r="20" fill="none" strokeWidth="2" strokeLinecap="round"
              className="stroke-brand"
              style={{ strokeDasharray: circumference, strokeDashoffset: circumference * (1 - progress) }}
            />
          </svg>
          <Icon name="ArrowRight" className="relative h-4 w-4 -rotate-90 transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
