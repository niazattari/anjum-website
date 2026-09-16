import StepShell from './StepShell';
import { Input, Label, FieldError, OptionCard } from '@/components/ui/Field';
import { contactMethods } from '@/data/wizardOptions';

export default function Step1Contact({ values, errors, set }) {
  return (
    <StepShell
      title="First, how do I reach you?"
      description="Only used to reply to this request and prepare your quotation."
      hint="Your details are never shared, sold or added to a mailing list."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Full name" name="fullName" required value={values.fullName} onChange={(e) => set('fullName', e.target.value)} error={errors.fullName} placeholder="Your name" autoComplete="name" />
        <Input label="Email" name="email" type="email" required value={values.email} onChange={(e) => set('email', e.target.value)} error={errors.email} placeholder="you@company.com" autoComplete="email" />
        <Input label="WhatsApp number" name="whatsapp" required value={values.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} error={errors.whatsapp} placeholder="+92 300 0000000" autoComplete="tel" hint="with country code" />
        <Input label="Country" name="country" required value={values.country} onChange={(e) => set('country', e.target.value)} error={errors.country} placeholder="Pakistan" autoComplete="country-name" />
        <Input label="City" name="city" value={values.city} onChange={(e) => set('city', e.target.value)} placeholder="Karachi" hint="optional" autoComplete="address-level2" />
      </div>

      <div className="mt-7">
        <Label required>How would you prefer to be contacted?</Label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method) => (
            <OptionCard
              key={method.id}
              icon={method.icon}
              title={method.label}
              selected={values.preferredContact === method.id}
              onClick={() => set('preferredContact', method.id)}
            />
          ))}
        </div>
        <FieldError>{errors.preferredContact}</FieldError>
      </div>
    </StepShell>
  );
}
