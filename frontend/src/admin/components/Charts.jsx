import { useId, useState } from 'react';
import cn from '@/utils/cn';

/**
 * Charts are inline SVG on the site's own tokens — no chart library, no extra
 * bundle, and light/dark come free because every colour is a CSS variable.
 *
 * Every chart here plots a single series, so the colour job is sequential
 * (one hue, more-is-darker) rather than categorical. A single series needs no
 * legend: the card heading names what is plotted.
 *
 * Mark specs: bars capped at 24px with a 4px rounded data-end square to the
 * baseline, 2px lines, ≥8px markers, hairline solid gridlines, values labelled
 * selectively rather than on every mark.
 */

const AXIS = 'rgb(var(--c-line) / 0.14)';
const SERIES = 'rgb(var(--c-brand))';

function Tooltip({ x, y, children, visible }) {
  if (!visible) return null;
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border bg-surface px-2.5 py-1.5 text-[0.75rem] font-medium text-ink shadow-lift"
      style={{ left: x, top: y - 8 }}
    >
      {children}
    </div>
  );
}

/** Twelve-month enquiry trend. Columns, because the reader compares months. */
export function TrendColumns({ data, label = 'requests' }) {
  const [hover, setHover] = useState(null);
  const gradientId = useId();

  const max = Math.max(1, ...data.map((d) => d.count));
  const ticks = [0, Math.round(max / 2), max].filter((v, i, a) => a.indexOf(v) === i);

  const W = 720;
  const H = 220;
  const PAD = { top: 16, right: 8, bottom: 28, left: 34 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const band = plotW / data.length;
  const barW = Math.min(24, band - 8);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Monthly ${label}`}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES} stopOpacity="0.95" />
            <stop offset="100%" stopColor={SERIES} stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {ticks.map((tick) => {
          const y = PAD.top + plotH - (tick / max) * plotH;
          return (
            <g key={tick}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke={AXIS} strokeWidth="1" />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" className="fill-faint text-[10px]">
                {tick}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const h = d.count === 0 ? 0 : Math.max(3, (d.count / max) * plotH);
          const x = PAD.left + i * band + (band - barW) / 2;
          const y = PAD.top + plotH - h;
          const isPeak = d.count === max && max > 0;

          return (
            <g
              key={d.key}
              onMouseEnter={() => setHover({ i, x: x + barW / 2, y, d })}
              onMouseLeave={() => setHover(null)}
            >
              {/* Full-height hit area — the bar itself is a small target */}
              <rect x={PAD.left + i * band} y={PAD.top} width={band} height={plotH} fill="transparent" />
              <rect
                x={x} y={y} width={barW} height={h}
                rx="4" ry="4"
                fill={`url(#${gradientId})`}
                opacity={hover && hover.i !== i ? 0.45 : 1}
                className="transition-opacity"
              />
              {/* Square off the rounded bottom so the bar sits on the baseline */}
              {h > 4 && <rect x={x} y={y + h - 4} width={barW} height="4" fill={`url(#${gradientId})`} />}
              {isPeak && (
                <text x={x + barW / 2} y={y - 6} textAnchor="middle" className="fill-muted text-[10px] font-semibold">
                  {d.count}
                </text>
              )}
              <text
                x={PAD.left + i * band + band / 2}
                y={H - 8}
                textAnchor="middle"
                className="fill-faint text-[10px]"
              >
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>

      <Tooltip
        visible={Boolean(hover)}
        x={hover ? `${(hover.x / W) * 100}%` : 0}
        y={hover ? (hover.y / H) * 100 * 2.2 : 0}
      >
        {hover && `${hover.d.count} ${label} · ${hover.d.month}`}
      </Tooltip>
    </div>
  );
}

/**
 * Ranked horizontal bars. Long category names need the horizontal form, and
 * lightness carries magnitude — sequential, one hue.
 */
export function RankedBars({ data, valueKey = 'count', labelKey = 'label', emptyLabel = 'Nothing yet' }) {
  const max = Math.max(1, ...data.map((d) => d[valueKey]));

  if (data.length === 0 || data.every((d) => d[valueKey] === 0)) {
    return <p className="py-8 text-center text-[0.85rem] text-faint">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-2.5">
      {data.map((d) => {
        const pct = (d[valueKey] / max) * 100;
        // 0.35 → 1 opacity: more is darker, the sequential rule
        const strength = 0.35 + 0.65 * (d[valueKey] / max);

        return (
          <li key={d[labelKey]} className="group flex items-center gap-3">
            <span className="w-[9.5rem] shrink-0 truncate text-right text-[0.78rem] text-muted" title={d[labelKey]}>
              {d[labelKey]}
            </span>
            <span className="relative h-5 flex-1 overflow-hidden rounded-md bg-elevated/70">
              <span
                className="absolute inset-y-0 left-0 rounded-md transition-[width] duration-500"
                style={{
                  width: `${Math.max(pct, d[valueKey] > 0 ? 2 : 0)}%`,
                  background: SERIES,
                  opacity: strength,
                }}
              />
            </span>
            <span className="w-8 shrink-0 text-right font-mono text-[0.78rem] font-semibold text-ink">
              {d[valueKey]}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Compact 12-point sparkline for stat tiles. */
export function Sparkline({ data, className }) {
  const values = data.map((d) => d.count);
  const max = Math.max(1, ...values);
  const points = values
    .map((v, i) => `${(i / Math.max(1, values.length - 1)) * 100},${28 - (v / max) * 26}`)
    .join(' ');

  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={cn('h-7 w-full', className)} aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={SERIES}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
