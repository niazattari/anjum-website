import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import FloatingWhatsApp from './FloatingWhatsApp';
import AuroraBackground from './AuroraBackground';
import BackToTop from './BackToTop';
import ScrollToTop from './ScrollToTop';
import { LoadingBlock } from '@/components/ui/States';
import useTheme from '@/hooks/useTheme';
import { useSettings } from '@/context/SettingsContext';

export default function Layout() {
  const { theme, toggle } = useTheme();
  const site = useSettings();

  return (
    <div className="relative flex min-h-screen flex-col">
      <AuroraBackground />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <ScrollToTop />
      <AnnouncementBar announcement={site.announcement} />
      <Header settings={site} theme={theme} onToggleTheme={toggle} />

      <main id="main" className="flex-1">
        <Suspense fallback={<LoadingBlock label="Loading page" />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer settings={site} />
      <FloatingWhatsApp settings={site} />
      <BackToTop />
    </div>
  );
}
