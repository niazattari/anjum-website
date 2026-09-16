import { useEffect, useRef } from 'react';

/**
 * Scroll-linked parallax. Translates the element as it moves through the
 * viewport, driven by a single rAF-throttled scroll listener.
 *
 * speed  positive = moves slower than the page (drifts down), negative = faster
 * axis   'y' | 'x'
 */
export function useParallax(speed = 0.15, { axis = 'y', max = 140 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;
    let running = true;

    const apply = () => {
      frame = 0;
      if (!running || !node) return;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      // -1 (below the fold) → 1 (scrolled past the top)
      const progress = (viewport / 2 - (rect.top + rect.height / 2)) / viewport;
      const offset = Math.max(-max, Math.min(max, progress * speed * 220));
      node.style.transform = axis === 'x' ? `translate3d(${offset}px,0,0)` : `translate3d(0,${offset}px,0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [speed, axis, max]);

  return ref;
}

export default useParallax;
