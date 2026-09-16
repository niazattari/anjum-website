import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';

/** Full-screen image viewer with keyboard navigation. */
export default function Lightbox({ items, index, onClose, onNavigate }) {
  const open = index !== null && index >= 0;

  const go = useCallback(
    (delta) => onNavigate((index + delta + items.length) % items.length),
    [index, items.length, onNavigate]
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose, go]);

  const current = open ? items[index] : null;

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex flex-col bg-black/88 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Project screenshot viewer"
          onClick={onClose}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-white/70 sm:px-6">
            <span className="font-mono text-[0.75rem]">
              {index + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              className="rounded-lg p-2 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon name="X" className="h-5 w-5" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center gap-2 px-2 sm:gap-4 sm:px-6">
            {items.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                aria-label="Previous image"
                className="shrink-0 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 sm:p-3"
              >
                <Icon name="ArrowLeft" className="h-5 w-5" />
              </button>
            )}

            <motion.img
              key={current.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              src={current.src}
              alt={current.caption || ''}
              onClick={(e) => e.stopPropagation()}
              className="mx-auto max-h-full min-h-0 flex-1 rounded-xl object-contain shadow-2xl"
            />

            {items.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); go(1); }}
                aria-label="Next image"
                className="shrink-0 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 sm:p-3"
              >
                <Icon name="ArrowRight" className="h-5 w-5" />
              </button>
            )}
          </div>

          {current.caption && (
            <p className="px-6 py-4 text-center text-[0.85rem] text-white/75">{current.caption}</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
