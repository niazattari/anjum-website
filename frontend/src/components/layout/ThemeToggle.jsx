import Icon from '@/components/ui/Icon';
import cn from '@/utils/cn';

export default function ThemeToggle({ theme, onToggle, className }) {
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-xl border text-muted',
        'transition-all hover:text-ink hover:border-brand/40 hover:bg-elevated',
        className
      )}
    >
      <Icon name={isDark ? 'Sun' : 'Moon'} className="h-[1.05rem] w-[1.05rem]" />
    </button>
  );
}
