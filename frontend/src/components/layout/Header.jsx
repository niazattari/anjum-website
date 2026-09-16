import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import ThemeToggle from './ThemeToggle';
import ScrollProgress from './ScrollProgress';
import useScrolled from '@/hooks/useScrolled';
import { whatsappLink, whatsappMessages } from '@/utils/whatsapp';
import cn from '@/utils/cn';
import BrandMark from '@/components/ui/BrandMark';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Web apps', to: '/web-apps' },
  { label: 'Source code', to: '/source-code' },
  { label: 'Process', to: '/process' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Header({ settings, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(16);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const linkClass = ({ isActive }) =>
    cn(
      'relative px-3 py-2 text-[0.86rem] font-medium transition-colors rounded-lg',
      isActive ? 'text-ink' : 'text-muted hover:text-ink'
    );

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-b bg-bg/80 py-2 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70'
          : 'bg-transparent py-4'
      )}
    >
      {scrolled && <ScrollProgress />}

      <div className="container flex items-center gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${settings.name} home`}>
          <BrandMark size="h-10 w-10" />
          <span className="flex flex-col gap-[3px]">
            <span className="wordmark text-[1.3rem] text-ink">{settings.logoText}</span>
            <span className="wordmark-sub hidden text-[0.52rem] text-faint sm:block">
              Full-stack &middot; AI systems
            </span>
          </span>
        </Link>

        <nav className="mx-auto hidden items-center lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-brand to-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} className="hidden sm:inline-flex" />
          <Button to="/start-project" size="sm" iconRight="ArrowRight" className="hidden sm:inline-flex">
            Start your project
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border text-ink lg:hidden"
          >
            <Icon name={open ? 'X' : 'Menu'} className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t bg-bg/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container flex flex-col gap-1 py-5">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-xl px-4 py-3 text-[0.95rem] font-medium transition-colors',
                        isActive ? 'bg-elevated text-ink' : 'text-muted hover:bg-elevated hover:text-ink'
                      )
                    }
                  >
                    {item.label}
                    <Icon name="ChevronRight" className="h-4 w-4 text-faint" />
                  </NavLink>
                </motion.div>
              ))}

              <div className="mt-4 flex flex-col gap-2.5">
                <Button to="/start-project" full size="lg" iconRight="ArrowRight">Start your project</Button>
                <Button
                  href={whatsappLink(settings.contact.whatsapp, whatsappMessages.general)}
                  variant="whatsapp"
                  full
                  size="lg"
                  icon="MessageCircle"
                >
                  Chat on WhatsApp
                </Button>
              </div>

              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  {settings.social.filter((s) => s.enabled).slice(0, 5).map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border text-muted transition-colors hover:text-ink"
                    >
                      <Icon name={s.icon} className="h-4 w-4" />
                    </a>
                  ))}
                </div>
                <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
