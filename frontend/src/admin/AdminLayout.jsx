import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import ThemeToggle from '@/components/layout/ThemeToggle';
import useTheme from '@/hooks/useTheme';
import { useAdminAuth } from './AdminAuth';
import cn from '@/utils/cn';

const nav = [
  {
    group: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: 'LayoutDashboard', end: true },
      { to: '/admin/requests', label: 'Project requests', icon: 'ClipboardList' },
      { to: '/admin/messages', label: 'Messages', icon: 'Mail' },
    ],
  },
  {
    group: 'Content',
    items: [
      { to: '/admin/portfolio', label: 'Portfolio', icon: 'Layers' },
      { to: '/admin/services', label: 'Services', icon: 'Globe' },
      { to: '/admin/web-apps', label: 'Web apps', icon: 'Table2' },
      { to: '/admin/posts', label: 'Blog', icon: 'Newspaper' },
      { to: '/admin/testimonials', label: 'Testimonials', icon: 'Quote' },
      { to: '/admin/faqs', label: 'FAQs', icon: 'CircleHelp' },
    ],
  },
  {
    group: 'Site',
    items: [
      { to: '/admin/technologies', label: 'Technologies', icon: 'Cpu' },
      { to: '/admin/stats', label: 'Statistics', icon: 'BarChart3' },
      { to: '/admin/process', label: 'Process', icon: 'Map' },
      { to: '/admin/advantages', label: 'Why choose me', icon: 'Target' },
      { to: '/admin/media', label: 'Media library', icon: 'Copy' },
      { to: '/admin/settings', label: 'Settings', icon: 'Wrench' },
    ],
  },
];

export default function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-2.5 rounded-xl px-3 py-2 text-[0.86rem] font-medium transition-colors',
      isActive ? 'bg-brand/12 text-brand' : 'text-muted hover:bg-elevated hover:text-ink'
    );

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-4 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent text-white shadow-glow">
          <Icon name="Code2" className="h-[1.1rem] w-[1.1rem]" strokeWidth={2.2} />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-[0.95rem] font-extrabold text-ink">Admin</span>
          <span className="block truncate text-[0.7rem] text-faint">Content &amp; enquiries</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Admin sections">
        {nav.map((section) => (
          <div key={section.group} className="mb-5">
            <p className="mb-1.5 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-faint">
              {section.group}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} className={linkClass}>
                    <Icon name={item.icon} className="h-[1.05rem] w-[1.05rem]" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t p-3">
        <NavLink to="/admin/profile" className={linkClass}>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand/25 to-accent/25 text-[0.7rem] font-bold text-brand">
            {(user?.name || 'A').slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1 truncate">{user?.name || 'Account'}</span>
        </NavLink>
        <button type="button" onClick={logout} className={cn(linkClass({ isActive: false }), 'w-full')}>
          <Icon name="ArrowLeft" className="h-[1.05rem] w-[1.05rem]" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-surface/50 lg:sticky lg:top-0 lg:block lg:h-screen">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-surface lg:hidden">{sidebar}</aside>
        </>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-bg/85 px-4 py-3 backdrop-blur-xl lg:px-7">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border text-ink lg:hidden"
          >
            <Icon name="Menu" className="h-4 w-4" />
          </button>

          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-muted transition-colors hover:text-ink"
          >
            <Icon name="ExternalLink" className="h-3.5 w-3.5" />
            View site
          </a>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={toggle} />
          </div>
        </header>

        <main className="px-4 py-7 lg:px-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
