import StepShell from './StepShell';
import { FieldError } from '@/components/ui/Field';
import { OptionCard } from '@/components/ui/Field';
import { projectTypes } from '@/data/wizardOptions';

export default function Step2Type({ values, errors, toggle }) {
  const groups = projectTypes.reduce((acc, type) => {
    (acc[type.group] ||= []).push(type);
    return acc;
  }, {});

  return (
    <StepShell
      title="What do you need built?"
      description="Select everything that applies — many projects are a combination, and choosing more than one is normal."
      hint="Not sure which of these fits? Choose the closest and describe it properly at the last step."
    >
      <div className="space-y-7">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <h3 className="mb-3 flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-faint">
              <span className="h-px w-5 bg-gradient-to-r from-brand to-transparent" />
              {group}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((type) => (
                <OptionCard
                  key={type.id}
                  multi
                  icon={type.icon}
                  title={type.label}
                  selected={values.projectTypes.includes(type.id)}
                  onClick={() => toggle('projectTypes', type.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <FieldError>{errors.projectTypes}</FieldError>
      </div>

      {values.projectTypes.length > 0 && (
        <p className="mt-5 rounded-xl border bg-elevated/50 px-4 py-3 text-[0.83rem] text-muted">
          <strong className="text-ink">{values.projectTypes.length}</strong> selected
        </p>
      )}
    </StepShell>
  );
}
