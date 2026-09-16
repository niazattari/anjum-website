import { useEffect, useRef } from 'react';

/**
 * Fixed, page-wide animated gradient. Three blurred colour fields drift on a
 * slow CSS loop and shift with scroll, giving depth behind every section
 * without a single image request.
 */
export default function AuroraBackground() {
  const layer = useRef(null);

  useEffect(() => {
    const node = layer.current;
    if (!node) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      node.style.setProperty('--scroll-a', `${y * -0.08}px`);
      node.style.setProperty('--scroll-b', `${y * 0.05}px`);
      node.style.setProperty('--scroll-c', `${y * -0.03}px`);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      ref={layer}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden noise-overlay"
    >
      <div
        className="aurora-blob animate-aurora left-[-12%] top-[-10%] h-[38rem] w-[38rem] bg-brand/45"
        style={{ translate: '0 var(--scroll-a, 0px)' }}
      />
      <div
        className="aurora-blob animate-aurora right-[-14%] top-[18%] h-[32rem] w-[32rem] bg-accent/40"
        style={{ translate: '0 var(--scroll-b, 0px)', animationDelay: '-7s' }}
      />
      <div
        className="aurora-blob animate-aurora bottom-[-16%] left-[22%] h-[34rem] w-[34rem] bg-violet-500/30"
        style={{ translate: '0 var(--scroll-c, 0px)', animationDelay: '-14s' }}
      />
      {/* Keeps text contrast intact over the colour fields */}
      <div className="absolute inset-0 bg-bg/72 backdrop-blur-[2px] dark:bg-bg/80" />
    </div>
  );
}
