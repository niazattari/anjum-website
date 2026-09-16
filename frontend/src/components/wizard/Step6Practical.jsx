import StepShell from './StepShell';
import { Input, Textarea, Label, Select, OptionCard, CheckRow, FieldError } from '@/components/ui/Field';
import { contentReadiness, contentAssets, budgetRanges, timelines, referralSources } from '@/data/wizardOptions';

const YesNo = ({ value, onChange }) => (
  <div className="flex gap-3">
    {['yes', 'no'].map((option) => (
      <button
        key={option}
        type="button"
        onClick={() => onChange(option)}
        aria-pressed={value === option}
        className={`flex-1 rounded-xl border px-4 py-3 text-[0.86rem] font-semibold capitalize transition-all ${
          value === option
            ? 'border-brand/60 bg-brand/[0.08] text-ink'
            : 'bg-surface text-muted hover:border-brand/35 hover:text-ink'
        }`}
      >
        {option}
      </button>
    ))}
  </div>
);

export default function Step6Practical({ values, errors, set, toggle }) {
  return (
    <StepShell
      title="Content, budget and timing"
      description="The practical part. An honest budget range gets you an honest scope — it is not a negotiating position."
      hint="No budget in mind yet? Choose &ldquo;I need a consultation&rdquo; and you will get options at different price points."
    >
      {/* Content */}
      <div>
        <Label>Is your content ready?</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          {contentReadiness.map((option) => (
            <OptionCard
              key={option.id}
              title={option.label}
              description={option.hint}
              selected={values.contentReadiness === option.id}
              onClick={() => set('contentReadiness', option.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Label hint="tick what you already have">Available material</Label>
        <div className="grid gap-2 sm:grid-cols-3">
          {contentAssets.map((asset) => (
            <CheckRow
              key={asset}
              label={asset}
              checked={values.contentAssets.includes(asset)}
              onChange={() => toggle('contentAssets', asset)}
            />
          ))}
        </div>
      </div>

      {/* Domain & hosting */}
      <div className="mt-9 grid gap-6 sm:grid-cols-2">
        <div>
          <Label>Do you have a domain?</Label>
          <YesNo value={values.hasDomain} onChange={(v) => set('hasDomain', v)} />
          {values.hasDomain === 'yes' && (
            <Input className="mt-3" name="domainName" value={values.domainName} onChange={(e) => set('domainName', e.target.value)} placeholder="yourbusiness.com" />
          )}
        </div>
        <div>
          <Label>Do you have hosting?</Label>
          <YesNo value={values.hasHosting} onChange={(v) => set('hasHosting', v)} />
          {values.hasHosting === 'yes' && (
            <Input className="mt-3" name="hostingProvider" value={values.hostingProvider} onChange={(e) => set('hostingProvider', e.target.value)} placeholder="Hosting provider" />
          )}
        </div>
      </div>

      {/* Budget */}
      <div className="mt-9">
        <Label required>Budget range</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          {budgetRanges.map((range) => (
            <OptionCard
              key={range.id}
              title={range.label}
              selected={values.budget === range.id}
              onClick={() => set('budget', range.id)}
            />
          ))}
        </div>
        <FieldError>{errors.budget}</FieldError>
      </div>

      {/* Timeline */}
      <div className="mt-8">
        <Label required>When do you need it?</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          {timelines.map((t) => (
            <OptionCard
              key={t.id}
              title={t.label}
              selected={values.timeline === t.id}
              onClick={() => set('timeline', t.id)}
            />
          ))}
        </div>
        <FieldError>{errors.timeline}</FieldError>
      </div>

      <Textarea
        className="mt-8"
        label="Tell me about your project"
        name="projectDescription"
        required
        rows={7}
        value={values.projectDescription}
        onChange={(e) => set('projectDescription', e.target.value)}
        error={errors.projectDescription}
        placeholder="What should it do, who uses it, what is going wrong today, and what would make this project a success? The more you write here, the more accurate the quotation."
      />

      <Select
        className="mt-6 sm:max-w-sm"
        label="How did you find me?"
        name="referralSource"
        value={values.referralSource}
        onChange={(e) => set('referralSource', e.target.value)}
        options={referralSources}
        placeholder="Optional"
      />
    </StepShell>
  );
}
