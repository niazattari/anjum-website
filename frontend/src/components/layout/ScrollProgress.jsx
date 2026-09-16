import useScrollProgress from '@/hooks/useScrollProgress';

/** Reading-progress bar pinned to the bottom edge of the header. */
export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden">
      <div
        className="h-full origin-left bg-gradient-to-r from-brand via-accent to-brand transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
