import { Link } from 'react-router-dom';
import cn from '@/utils/cn';
import Icon from './Icon';

const variants = {
  primary:
    'shine relative overflow-hidden text-white bg-gradient-to-r from-brand to-accent shadow-glow hover:brightness-110 active:brightness-95',
  secondary:
    'bg-elevated text-ink border hover:bg-surface hover:border-brand/40',
  outline:
    'border border-brand/40 text-ink hover:bg-brand/10 hover:border-brand/70',
  ghost: 'text-muted hover:text-ink hover:bg-elevated',
  whatsapp: 'text-white bg-[#25D366] hover:brightness-105 shadow-soft',
};

const sizes = {
  sm: 'h-9 px-3.5 text-[0.8rem] gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-[3.25rem] px-7 text-[0.95rem] gap-2.5 rounded-xl',
};

export default function Button({
  as, to, href, variant = 'primary', size = 'md', icon, iconRight, loading = false,
  className, children, disabled, full, ...rest
}) {
  const classes = cn(
    'inline-flex items-center justify-center font-semibold tracking-tight',
    'transition-all duration-200 will-change-transform',
    'hover:-translate-y-0.5 active:translate-y-0',
    'disabled:opacity-55 disabled:pointer-events-none',
    variants[variant], sizes[size], full && 'w-full', className
  );

  const content = (
    <>
      {loading ? <Icon name="Loader2" className="h-4 w-4 animate-spin" /> : icon ? <Icon name={icon} className="h-4 w-4" /> : null}
      {children}
      {iconRight && !loading ? <Icon name={iconRight} className="h-4 w-4" /> : null}
    </>
  );

  if (to) return <Link to={to} className={classes} {...rest}>{content}</Link>;
  if (href) {
    const external = href.startsWith('http');
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }

  const Tag = as || 'button';
  return <Tag className={classes} disabled={disabled || loading} {...rest}>{content}</Tag>;
}
