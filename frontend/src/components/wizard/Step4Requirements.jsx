import StepShell from './StepShell';
import { Input, Label, OptionCard, CheckRow } from '@/components/ui/Field';
import { pageCountOptions, standardPages, featureGroups } from '@/data/wizardOptions';

export default function Step4Requirements({ values, set, toggle }) {
  const selectedCount = values.features.length;

  return (
    <StepShell
      title="What does it need to do?"
      description="Rough answers are fine — this is to size the work, not to lock you in. Anything unclear gets settled in the first conversation."
      hint="Selecting everything is not free. Pick what the business genuinely needs at launch; more can always be added later."
    >
      <div>
        <Label>How many pages, roughly?</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          {pageCountOptions.map((option) => (
            <OptionCard
              key={option.id}
              title={option.label}
              selected={values.pageCount === option.id}
              onClick={() => set('pageCount', option.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Label hint="select any you know you need">Which pages?</Label>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {standardPages.map((page) => (
            <CheckRow
              key={page}
              label={page}
              checked={values.pages.includes(page)}
              onChange={() => toggle('pages', page)}
            />
          ))}
        </div>
        <Input
          className="mt-3"
          name="customPages"
          value={values.customPages}
          onChange={(e) => set('customPages', e.target.value)}
          placeholder="Other pages, comma separated — e.g. Downloads, Branches, Case studies"
        />
      </div>

      <div className="mt-9">
        <div className="mb-3 flex items-baseline justify-between">
          <Label hint="select all that apply">Features and functionality</Label>
          {selectedCount > 0 && (
            <span className="text-[0.78rem] font-semibold text-brand">{selectedCount} selected</span>
          )}
        </div>

        <div className="space-y-6">
          {featureGroups.map((group) => (
            <div key={group.group}>
              <h3 className="mb-2.5 flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-faint">
                <span className="h-px w-5 bg-gradient-to-r from-brand to-transparent" />
                {group.group}
              </h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <CheckRow
                    key={item.id}
                    label={item.label}
                    checked={values.features.includes(item.id)}
                    onChange={() => toggle('features', item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </StepShell>
  );
}
