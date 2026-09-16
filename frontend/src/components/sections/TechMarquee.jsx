import TechLogo from '@/components/ui/TechLogo';

/**
 * Continuously scrolling technology strip. Sits directly under the header.
 * The track duplicates its items so the loop is seamless, and pauses on hover
 * so a visitor can actually read it.
 */
export default function TechMarquee({ technologies, label = 'Built with' }) {
  const featured = technologies.filter((t) => t.featured);
  if (featured.length === 0) return null;

  const items = [...featured, ...featured];

  return (
    <div className="relative border-b bg-surface/55 backdrop-blur-sm">
      <div className="mask-fade-x relative flex items-center overflow-hidden py-2.5">
        <span className="pointer-events-none absolute left-1/2 z-10 hidden -translate-x-1/2 sm:block">
          <span className="sr-only">{label}</span>
        </span>

        <ul className="marquee-track flex w-max animate-marquee items-center gap-2.5 pr-2.5">
          {items.map((tech, i) => (
            <li
              key={`${tech.id}-${i}`}
              aria-hidden={i >= featured.length}
              className="group flex shrink-0 items-center gap-2 rounded-lg border bg-surface/80 px-3 py-1.5 text-[0.8rem] font-semibold text-muted transition-colors hover:border-brand/40 hover:text-ink"
            >
              <TechLogo tech={tech} size="sm" />
              {tech.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
