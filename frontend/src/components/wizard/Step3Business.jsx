import StepShell from './StepShell';
import { Input, Textarea, Select } from '@/components/ui/Field';
import { industries } from '@/data/wizardOptions';

export default function Step3Business({ values, errors, set }) {
  return (
    <StepShell
      title="Tell me about your business"
      description="This shapes the structure, the tone and what needs to be on the first screen. It is the part that stops a website being generic."
      hint="If the business is new and some of this is undecided, say so — that is useful information too."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Business / project name" name="businessName" required value={values.businessName} onChange={(e) => set('businessName', e.target.value)} error={errors.businessName} placeholder="Acme Trading Co." />
        <Select label="Industry" name="industry" required value={values.industry} onChange={(e) => set('industry', e.target.value)} error={errors.industry} options={industries} placeholder="Choose an industry" />
        <Textarea label="What does your business do?" name="businessDescription" required rows={4} value={values.businessDescription} onChange={(e) => set('businessDescription', e.target.value)} error={errors.businessDescription} placeholder="We sell handmade jewellery to customers across Pakistan, mostly through Instagram…" className="sm:col-span-2" />
        <Textarea label="Who are your customers?" name="targetAudience" rows={3} value={values.targetAudience} onChange={(e) => set('targetAudience', e.target.value)} placeholder="Women aged 20–40, mostly shopping on their phones" hint="optional" className="sm:col-span-2" />
        <Input label="Business location" name="businessLocation" value={values.businessLocation} onChange={(e) => set('businessLocation', e.target.value)} placeholder="Lahore, Pakistan" hint="optional" />
        <Input label="Existing website" name="existingWebsite" type="url" value={values.existingWebsite} onChange={(e) => set('existingWebsite', e.target.value)} placeholder="https://…" hint="if you have one" />
        <Textarea label="Social media links" name="socialLinks" rows={3} value={values.socialLinks} onChange={(e) => set('socialLinks', e.target.value)} placeholder="Instagram, Facebook, LinkedIn — one per line" hint="optional" className="sm:col-span-2" />
      </div>
    </StepShell>
  );
}
