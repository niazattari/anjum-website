import cn from '@/utils/cn';
import Icon from './Icon';

const tones = {
  brand: 'bg-brand/12 text-brand border-brand/25',
  accent: 'bg-accent/12 text-accent border-accent/25',
  neutral: 'bg-elevated text-muted border-line/10',
  success: 'bg-emerald-500/12 text-emerald-500 border-emerald-500/25',
  warn: 'bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/25',
};

export default function Badge({ children, tone = 'neutral', icon, className, ...rest }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em]',
        tones[tone], className
      )}
      {...rest}
    >
      {icon && <Icon name={icon} className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}
