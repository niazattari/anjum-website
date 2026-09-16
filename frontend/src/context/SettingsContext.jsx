import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/services/api';
import { site as bundledSite } from '@/data/site';
import { setSeoDefaults } from '@/utils/seo';

/**
 * Site settings, live from the API when a backend is connected.
 *
 * The bundled `site` object is the initial value, so the first paint never
 * waits on a request and the site still works with no backend at all. When the
 * API answers, its values replace them — which is what makes the admin panel's
 * Settings screen actually change the public site.
 */
const SettingsContext = createContext(bundledSite);

/** Deep-merges the API response over the bundled defaults, so a field the
 *  backend omits keeps its fallback rather than becoming undefined. */
function merge(base, incoming) {
  if (!incoming || typeof incoming !== 'object') return base;

  const out = { ...base };

  Object.entries(incoming).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      out[key] = value;
    } else if (typeof value === 'object') {
      out[key] = merge(base?.[key] ?? {}, value);
    } else if (value !== '') {
      out[key] = value;
    }
  });

  return out;
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(bundledSite);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const remote = await api.getSettings();
        if (cancelled) return;
        const merged = merge(bundledSite, remote);
        setSettings(merged);
        setSeoDefaults(merged);
      } catch {
        // No backend, or it is down — the bundled defaults already apply.
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}

export default SettingsContext;
