// ---------------------------------------------------------------------------
// CapabilityHub — the ANJUM identity graphic, built as a live component.
//
// Six capability nodes on a ring, each wired back to the mark at the centre:
// one node per thing Niaz builds, all terminating in the same place. It is the
// brand's central idea drawn literally, so it earns its place in the hero
// rather than being decoration.
//
// Geometry is computed, not hard-coded, so changing CAPABILITIES to five or
// seven entries re-spaces the ring correctly. Everything scales from a single
// viewBox and percentage positions, which is what lets it survive from a 1600px
// desktop down to a 340px phone without a second layout.
// ---------------------------------------------------------------------------
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import BrandMark from '@/components/ui/BrandMark';
import cn from '@/utils/cn';

export const CAPABILITIES = [
  { id: 'software', label: 'Software Development', icon: 'Code2', color: '#2F6FED', to: '/services' },
  { id: 'databases', label: 'Databases', icon: 'Database', color: '#7C5CFC', to: '/services' },
  { id: 'web-apps', label: 'Web Applications', icon: 'AppWindow', color: '#14B8A6', to: '/web-apps' },
  { id: 'design', label: 'Web Design', icon: 'Paintbrush', color: '#EC4899', to: '/services' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3', color: '#F59E0B', to: '/services' },
  { id: 'dashboards', label: 'Dashboards', icon: 'LayoutDashboard', color: '#22C55E', to: '/portfolio' },
];

// viewBox units. The ring radius is a fraction of the box so the whole thing
// scales with its container rather than with a pixel size.
const BOX = 440;
const CENTRE = BOX / 2;
const RING_R = 150;

// Start at 12 o'clock and go clockwise.
const pointAt = (index, total, radius) => {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return { x: CENTRE + Math.cos(angle) * radius, y: CENTRE + Math.sin(angle) * radius };
};

export default function CapabilityHub({ className }) {
  const total = CAPABILITIES.length;

  return (
    <div className={cn('hub relative mx-auto aspect-square w-full max-w-[440px]', className)}>
      {/* Wires and orbit. Sits behind the nodes and ignores the pointer so the
          node links stay clickable across their whole circle. */}
      <svg
        viewBox={`0 0 ${BOX} ${BOX}`}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <circle
          className="hub-orbit"
          cx={CENTRE}
          cy={CENTRE}
          r={RING_R}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.16"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        {CAPABILITIES.map((cap, i) => {
          const p = pointAt(i, total, RING_R);
          return (
            <line
              key={cap.id}
              className="hub-wire"
              x1={CENTRE}
              y1={CENTRE}
              x2={p.x}
              y2={p.y}
              stroke={cap.color}
              strokeOpacity="0.32"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {/* Centre: the mark itself.
          The wrapper fills the hub and centres its child rather than being
          positioned at 50%/50% and pulled back by half its own width. An
          absolutely positioned box with auto width resolves percentage children
          against the space left over to its right, which put the mark half its
          own width off-centre — subtle enough to look like a drawing mistake
          rather than a layout one. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <BrandMark
          size="h-[25%] w-[25%]"
          className="shadow-[0_10px_26px_rgb(27_35_64_/_0.26)]"
        />
      </div>

      {/* The six capability nodes */}
      {CAPABILITIES.map((cap, i) => {
        const p = pointAt(i, total, RING_R);
        return (
          <Link
            key={cap.id}
            to={cap.to}
            title={cap.label}
            aria-label={cap.label}
            className={cn(
              'hub-node absolute flex items-center justify-center rounded-full',
              'h-[19%] w-[19%] min-h-[58px] min-w-[58px]',
              'border-2 bg-surface shadow-soft',
              'focus-visible:outline-offset-4'
            )}
            style={{
              left: `${(p.x / BOX) * 100}%`,
              top: `${(p.y / BOX) * 100}%`,
              // Translate rather than offsetting left/top by half the node size:
              // the node size is a percentage, so there is no pixel value to
              // subtract.
              transform: 'translate(-50%, -50%)',
              borderColor: cap.color,
              color: cap.color,
            }}
          >
            <Icon name={cap.icon} className="h-[42%] w-[42%]" strokeWidth={1.6} />
          </Link>
        );
      })}
    </div>
  );
}

/** The same six capabilities as a flat row of chips, for use under the ring. */
export function CapabilityChips({ className }) {
  return (
    <div className={cn('flex flex-wrap justify-center gap-2.5', className)}>
      {CAPABILITIES.map((cap) => (
        <Link
          key={cap.id}
          to={cap.to}
          className="group flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.08em] text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:text-ink hover:shadow-soft"
        >
          <i className="h-2 w-2 rounded-full" style={{ background: cap.color }} />
          {cap.label}
        </Link>
      ))}
    </div>
  );
}
