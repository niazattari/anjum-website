import { useEffect, useState } from 'react';

/** True when the visitor has not asked for reduced motion and is on a pointer device. */
export function useMotionAllowed() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(pointer: fine)');
    const update = () => setAllowed(!reduce.matches && fine.matches);
    update();
    reduce.addEventListener('change', update);
    fine.addEventListener('change', update);
    return () => {
      reduce.removeEventListener('change', update);
      fine.removeEventListener('change', update);
    };
  }, []);

  return allowed;
}

export default useMotionAllowed;
