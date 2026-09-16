import Icon from '@/components/ui/Icon';

export default function StepShell({ title, description, children, hint }) {
  return (
    <div>
      <header className="mb-7">
        <h2 className="text-[1.4rem] font-bold text-ink sm:text-[1.6rem]">{title}</h2>
        {description && <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{description}</p>}
      </header>

      {children}

      {hint && (
        <p className="mt-7 flex items-start gap-2 text-[0.8rem] leading-relaxed text-faint">
          <Icon name="Info" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {hint}
        </p>
      )}
    </div>
  );
}
