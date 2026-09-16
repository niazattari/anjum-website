// ---------------------------------------------------------------------------
// BrandMark — the ANJUM "A".
//
// The A is drawn as a node graph: three endpoints (client, server, store) held
// by a crossbar whose centre node is the model. The dashed base closes the
// triangle only implicitly, so the letter stays open and light.
//
// Two builds, because one drawing cannot do both jobs:
//   - the node build, for anything 32px and up, where the nodes read;
//   - a solid build, for small sizes and favicons, where the nodes would fill
//     in and turn the letter into a blob.
//
// Drawn inline rather than loaded from /brand/*.svg so it inherits currentColor
// and costs no extra request. The standalone files in public/brand are the ones
// to hand to a printer, a client, or a social profile.
// ---------------------------------------------------------------------------
import cn from '@/utils/cn';

const NODE_PATHS = (
  <>
    <path d="M50 20 L24 80" />
    <path d="M50 20 L76 80" />
    <path d="M32 61 H68" />
    <path d="M24 80 L76 80" strokeDasharray="5 7" strokeOpacity="0.45" />
  </>
);

/**
 * @param {'node'|'solid'} build  which drawing to use
 * @param {'disc'|'ring'|'bare'}  container  navy disc, outlined ring, or nothing
 * @param {string} size  Tailwind height/width pair. A prop rather than part of
 *   className because two competing height/width utilities resolve by
 *   stylesheet order, not by the order they are written in the attribute.
 */
export default function BrandMark({ className, build = 'node', container = 'disc', size = 'h-9 w-9' }) {
  const solid = build === 'solid';

  const glyph = (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="ANJUM">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={solid ? 11 : 6}
        strokeLinecap={solid ? 'round' : 'square'}
        strokeLinejoin="round"
        transform={`translate(50 50) scale(${container === 'bare' ? 0.92 : 0.64}) translate(-50 -50)`}
      >
        {solid ? (
          <>
            <path d="M50 20 L24 80" />
            <path d="M50 20 L76 80" />
            <path d="M34 58 H66" />
          </>
        ) : (
          <>
            {NODE_PATHS}
            {/* The hollow nodes are punched out with the disc colour, so they
                have to be told what that colour is rather than inheriting it. */}
            <circle cx="50" cy="61" r="7.5" fill="currentColor" stroke="none" />
            <circle cx="50" cy="20" r="7" className="fill-[var(--node-fill)]" />
            <circle cx="24" cy="80" r="7" className="fill-[var(--node-fill)]" />
            <circle cx="76" cy="80" r="7" className="fill-[var(--node-fill)]" />
          </>
        )}
      </g>
    </svg>
  );

  if (container === 'bare') {
    return (
      <span
        className={cn('block text-ink [--node-fill:rgb(var(--c-bg))]', size, className)}
        aria-hidden={false}
      >
        {glyph}
      </span>
    );
  }

  // A navy disc vanishes on a navy page, so in dark mode the disc becomes an
  // outlined ring instead — the same move the printed dark lockup makes.
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full p-[3px]',
        size,
        'bg-[#1B2340] text-white [--node-fill:#1B2340]',
        'dark:bg-transparent dark:ring-[1.5px] dark:ring-white/85 dark:[--node-fill:rgb(var(--c-bg))]',
        container === 'ring' && 'bg-transparent text-ink ring-[1.5px] ring-ink/80 [--node-fill:rgb(var(--c-bg))]',
        className
      )}
    >
      {glyph}
    </span>
  );
}
