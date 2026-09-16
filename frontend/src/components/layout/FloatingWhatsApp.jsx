import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import { whatsappLink } from '@/utils/whatsapp';

export default function FloatingWhatsApp({ settings }) {
  const [visible, setVisible] = useState(false);
  const [tip, setTip] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    const show = setTimeout(() => setTip(true), 1200);
    const hide = setTimeout(() => setTip(false), 7000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [visible]);

  if (!settings.floatingWhatsApp?.enabled) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="fixed bottom-5 right-4 z-40 flex items-center gap-3 sm:bottom-7 sm:right-7"
        >
          <AnimatePresence>
            {tip && (
              <motion.span
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="hidden rounded-xl border bg-surface px-3.5 py-2 text-[0.8rem] font-medium text-ink shadow-lift sm:block"
              >
                Questions? Message me directly
              </motion.span>
            )}
          </AnimatePresence>

          <a
            href={whatsappLink(settings.contact.whatsapp, settings.floatingWhatsApp.message)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,.7)] transition-transform hover:scale-105"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20" aria-hidden="true" />
            <Icon name="MessageCircle" className="relative h-6 w-6" strokeWidth={2} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
