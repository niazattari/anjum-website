import { useCallback, useEffect, useState } from 'react';

const KEY = 'theme-preference';

const readStored = () => {
  try { return localStorage.getItem(KEY); } catch { return null; }
};

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = readStored();
    if (stored === 'light' || stored === 'dark') return stored;
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    try { localStorage.setItem(KEY, theme); } catch { /* storage unavailable */ }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return { theme, setTheme, toggle };
}

export default useTheme;
