import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';

export default function AnnouncementBar({ announcement }) {
  const [dismissed, setDismissed] = useState(false);
  if (!announcement?.enabled || dismissed) return null;

  return (
    <div className="relative z-50 bg-gradient-to-r from-brand to-accent text-white">
      <div className="container flex items-center justify-center gap-3 py-2 text-[0.8rem] font-medium">
        <span className="hidden h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-white sm:block" />
        <p className="text-center">
          {announcement.text}{' '}
          {announcement.linkUrl && (
            <Link to={announcement.linkUrl} className="ml-1 inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:no-underline">
              {announcement.linkLabel}
              <Icon name="ArrowRight" className="h-3.5 w-3.5" />
            </Link>
          )}
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="absolute right-4 rounded p-1 text-white/70 transition-colors hover:text-white"
        >
          <Icon name="X" className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
