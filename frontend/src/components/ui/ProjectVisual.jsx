import cn from '@/utils/cn';

// Generated cover artwork. Projects ship without photography, so each one gets a
// deterministic abstract mockup derived from its `visual` spec. Replace with real
// screenshots from the admin media library when they exist.

const Chrome = ({ children, from, to, label }) => (
  <div className="relative h-full w-full overflow-hidden">
    <div
      className="absolute inset-0 opacity-90"
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    />
    <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,.28),transparent_60%)]" />
    <div className="absolute inset-x-4 top-5 bottom-0 sm:inset-x-6 sm:top-7">
      <div className="flex h-full flex-col overflow-hidden rounded-t-xl bg-[#0B1220]/92 shadow-[0_24px_60px_-20px_rgba(2,6,23,.7)] ring-1 ring-white/10 backdrop-blur">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2.5">
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <span className="ml-2 h-3.5 flex-1 rounded-full bg-white/8" />
          {label && (
            <span className="hidden truncate text-[0.6rem] font-medium uppercase tracking-widest text-white/45 sm:block">
              {label}
            </span>
          )}
        </div>
        <div className="flex-1 p-3.5">{children}</div>
      </div>
    </div>
  </div>
);

const Bar = ({ w = '100%', h = 8, className }) => (
  <div className={cn('rounded-full bg-white/12', className)} style={{ width: w, height: h }} />
);

const layouts = {
  landing: (accent) => (
    <div className="flex h-full flex-col gap-2.5">
      <div className="rounded-lg p-3" style={{ background: `linear-gradient(120deg, ${accent}33, transparent)` }}>
        <Bar w="62%" h={10} className="bg-white/35" />
        <Bar w="42%" h={7} className="mt-2" />
        <div className="mt-3 flex gap-2">
          <div className="h-5 w-16 rounded-md" style={{ background: accent }} />
          <div className="h-5 w-14 rounded-md bg-white/12" />
        </div>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg bg-white/7 p-2">
            <div className="h-4 w-4 rounded" style={{ background: accent, opacity: 0.85 }} />
            <Bar w="80%" h={5} className="mt-2" />
            <Bar w="60%" h={5} className="mt-1.5" />
          </div>
        ))}
      </div>
    </div>
  ),
  storefront: (accent) => (
    <div className="flex h-full flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <Bar w="30%" h={7} className="bg-white/25" />
        <div className="ml-auto h-4 w-4 rounded" style={{ background: accent }} />
      </div>
      <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col rounded-lg bg-white/7 p-1.5">
            <div
              className="flex-1 rounded"
              style={{ background: `linear-gradient(140deg, ${accent}${i % 2 ? '55' : '33'}, transparent)` }}
            />
            <Bar w="70%" h={4} className="mt-1.5" />
          </div>
        ))}
      </div>
    </div>
  ),
  table: (accent) => (
    <div className="flex h-full flex-col gap-1.5">
      <div className="flex gap-2 rounded-md bg-white/10 px-2 py-1.5">
        {['26%', '20%', '18%', '16%'].map((w, i) => <Bar key={i} w={w} h={5} className="bg-white/30" />)}
      </div>
      {Array.from({ length: 6 }).map((_, r) => (
        <div key={r} className="flex items-center gap-2 rounded-md px-2 py-1.5" style={{ background: r % 2 ? 'rgba(255,255,255,.045)' : 'transparent' }}>
          <Bar w="26%" h={5} />
          <Bar w="20%" h={5} />
          <Bar w="18%" h={5} />
          <div className="h-2.5 w-8 rounded-full" style={{ background: r % 3 === 0 ? accent : 'rgba(255,255,255,.16)' }} />
        </div>
      ))}
    </div>
  ),
  dashboard: (accent) => (
    <div className="flex h-full gap-2">
      <div className="hidden w-1/5 flex-col gap-1.5 rounded-lg bg-white/6 p-2 sm:flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded" style={{ background: i === 0 ? accent : 'rgba(255,255,255,.2)' }} />
            <Bar w="70%" h={4} />
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg bg-white/7 p-2">
              <Bar w="55%" h={4} />
              <Bar w="75%" h={9} className="mt-1.5 bg-white/30" />
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-1.5 rounded-lg bg-white/6 p-2">
          {[42, 66, 38, 82, 54, 72, 46, 90].map((h, i) => (
            <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i % 2 ? `${accent}cc` : 'rgba(255,255,255,.2)' }} />
          ))}
        </div>
      </div>
    </div>
  ),
  charts: (accent) => (
    <div className="flex h-full flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-lg bg-white/7 p-2">
            <Bar w="50%" h={4} />
            <Bar w="70%" h={9} className="mt-1.5 bg-white/30" />
          </div>
        ))}
      </div>
      <div className="relative flex-1 overflow-hidden rounded-lg bg-white/6 p-2">
        <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="pv-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,62 L28,50 L56,58 L84,34 L112,42 L140,20 L168,28 L200,10 L200,80 L0,80 Z" fill="url(#pv-area)" />
          <path d="M0,62 L28,50 L56,58 L84,34 L112,42 L140,20 L168,28 L200,10" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  ),
  gallery: (accent) => (
    <div className="grid h-full grid-cols-4 grid-rows-3 gap-1.5">
      {[
        'col-span-2 row-span-2', '', '', '', '',
        'col-span-2', '',
      ].map((span, i) => (
        <div
          key={i}
          className={cn('rounded-md', span)}
          style={{ background: `linear-gradient(${120 + i * 24}deg, ${accent}${i % 2 ? '66' : '33'}, rgba(255,255,255,.06))` }}
        />
      ))}
    </div>
  ),
  app: (accent) => (
    <div className="flex h-full flex-col gap-2">
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-md" style={{ background: accent }} />
        <div className="h-5 w-12 rounded-md bg-white/10" />
        <div className="h-5 w-12 rounded-md bg-white/10" />
      </div>
      <div className="flex flex-1 gap-2">
        <div className="flex-1 rounded-lg bg-white/7 p-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="mb-2 flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full" style={{ background: `${accent}${i % 2 ? '99' : '55'}` }} />
              <div className="flex-1">
                <Bar w="70%" h={4} />
                <Bar w="45%" h={3} className="mt-1" />
              </div>
            </div>
          ))}
        </div>
        <div className="hidden w-1/3 rounded-lg bg-white/6 p-2 sm:block">
          <Bar w="60%" h={4} />
          <div className="mt-2 h-10 rounded" style={{ background: `linear-gradient(140deg, ${accent}55, transparent)` }} />
          <Bar w="80%" h={4} className="mt-2" />
          <Bar w="55%" h={4} className="mt-1.5" />
        </div>
      </div>
    </div>
  ),
  document: (accent) => (
    <div className="flex h-full items-stretch gap-2">
      <div className="flex-1 rounded-lg bg-white/90 p-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="h-2 w-16 rounded-full" style={{ background: accent }} />
            <div className="mt-1.5 h-1.5 w-10 rounded-full bg-slate-300" />
          </div>
          <div className="h-6 w-6 rounded" style={{ background: `${accent}44` }} />
        </div>
        <div className="mt-3 space-y-1.5">
          {['92%', '78%', '86%', '64%'].map((w, i) => (
            <div key={i} className="h-1.5 rounded-full bg-slate-200" style={{ width: w }} />
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <div className="h-3 w-14 rounded" style={{ background: accent, opacity: 0.8 }} />
        </div>
      </div>
    </div>
  ),
};

export default function ProjectVisual({ visual, label, className, ratio = 'aspect-[16/10]', image, alt, priority = false }) {
  // A real screenshot always wins over generated artwork.
  if (image) {
    return (
      <div className={cn('relative overflow-hidden bg-elevated', ratio, className)}>
        <img
          src={image}
          alt={alt || label || ''}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover object-top"
        />
      </div>
    );
  }

  const kind = visual?.kind || 'landing';
  const from = visual?.from || '#3B82F6';
  const to = visual?.to || '#22D3EE';
  const render = layouts[kind] || layouts.landing;

  return (
    <div className={cn('relative overflow-hidden bg-elevated', ratio, className)}>
      <Chrome from={from} to={to} label={label}>{render(to)}</Chrome>
    </div>
  );
}
