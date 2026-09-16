import { SAMPLE_CONTENT } from '@/data/site';
import Icon from './Icon';
import cn from '@/utils/cn';

/**
 * Honest labelling for seeded placeholder records. While SAMPLE_CONTENT is true
 * the site marks illustrative content as such, so nothing reads as a real
 * client engagement or a real quote. Set SAMPLE_CONTENT to false in
 * `src/data/site.js` once genuine content replaces it.
 */
export function SampleChip({ className, label = 'Sample' }) {
  if (!SAMPLE_CONTENT) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5',
        'text-[0.62rem] font-semibold uppercase tracking-[0.09em] text-amber-600 dark:text-amber-400',
        className
      )}
    >
      <Icon name="Info" className="h-3 w-3" />
      {label}
    </span>
  );
}

export default function SampleNotice({ children, className }) {
  if (!SAMPLE_CONTENT) return null;
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] px-4 py-3',
        'text-[0.82rem] leading-relaxed text-amber-700 dark:text-amber-300/90',
        className
      )}
    >
      <Icon name="Info" className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
}
