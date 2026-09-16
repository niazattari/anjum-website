import { useState } from 'react';
import cn from '@/utils/cn';

/**
 * Technology mark.
 *
 * Renders /logos/<tech.logo> when that file exists. If it is missing — which is
 * the default state, since official brand SVGs have to be downloaded from each
 * project (see public/logos/README.md) — it falls back to a monogram tile in
 * the technology's own colour, so the strip never looks broken or empty.
 */
export default function TechLogo({ tech, className, size = 'md' }) {
  const [failed, setFailed] = useState(false);

  const sizes = {
    sm: 'h-5 w-5 text-[0.6rem]',
    md: 'h-7 w-7 text-[0.7rem]',
    lg: 'h-10 w-10 text-[0.9rem]',
  };

  const monogram = tech.name
    .replace(/[^A-Za-z0-9 .]/g, '')
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  if (failed || !tech.logo) {
    return (
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-lg font-bold tracking-tight ring-1',
          sizes[size], className
        )}
        style={{
          background: `linear-gradient(145deg, ${tech.color}2e, ${tech.color}12)`,
          color: tech.color,
          boxShadow: `inset 0 0 0 1px ${tech.color}33`,
        }}
        aria-hidden="true"
      >
        {monogram}
      </span>
    );
  }

  return (
    <img
      src={`/logos/${tech.logo}`}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('shrink-0 object-contain', sizes[size], className)}
    />
  );
}
