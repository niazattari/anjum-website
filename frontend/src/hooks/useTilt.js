import { useCallback, useRef } from 'react';

/**
 * Pointer-driven 3D tilt with a cursor-following highlight.
 *
 * Writes CSS custom properties (--rx, --ry, --mx, --my, --active) instead of
 * re-rendering, so the effect costs nothing in React terms. Pair with the
 * `.tilt-3d` / `.tilt-glow` classes in index.css.
 */
export function useTilt({ max = 7, scale = 1.012 } = {}) {
  const ref = useRef(null);
  const frame = useRef(0);

  const onPointerMove = useCallback(
    (event) => {
      const node = ref.current;
      if (!node) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (event.pointerType && event.pointerType !== 'mouse') return;

      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        node.style.setProperty('--rx', `${(0.5 - py) * max * 2}deg`);
        node.style.setProperty('--ry', `${(px - 0.5) * max * 2}deg`);
        node.style.setProperty('--mx', `${px * 100}%`);
        node.style.setProperty('--my', `${py * 100}%`);
        node.style.setProperty('--tilt-scale', String(scale));
        node.style.setProperty('--active', '1');
      });
    },
    [max, scale]
  );

  const onPointerLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    node.style.setProperty('--rx', '0deg');
    node.style.setProperty('--ry', '0deg');
    node.style.setProperty('--tilt-scale', '1');
    node.style.setProperty('--active', '0');
  }, []);

  return { ref, tiltProps: { onPointerMove, onPointerLeave } };
}

export default useTilt;
