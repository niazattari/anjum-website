import StepShell from './StepShell';
import Icon from '@/components/ui/Icon';
import { FieldError } from '@/components/ui/Field';
import {
  projectTypes, contactMethods, budgetRanges, timelines, designStyles,
  contentReadiness, pageCountOptions, featureGroups,
} from '@/data/wizardOptions';

const allFeatures = featureGroups.flatMap((g) => g.items);
const labelOf = (list, id, key = 'label') => list.find((i) => i.id === id)?.[key] || id;

function Row({ label, value }) {
  const empty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
  return (
    <div className="flex flex-col gap-1 border-b py-2.5 last:border-0 sm:flex-row sm:items-start sm:gap-6">
      <dt className="shrink-0 text-[0.82rem] text-muted sm:w-44">{label}</dt>
      <dd className={`min-w-0 flex-1 text-[0.86rem] ${empty ? 'text-faint' : 'text-ink'}`}>
        {empty ? 'Not provided' : Array.isArray(value) ? value.join(', ') : value}
      </dd>
    </div>
  );
}

function Group({ title, step, onEdit, children }) {
  return (
    <section className="rounded-2xl border bg-surface/50 p-5 sm:p-6">
      <header className="mb-3 flex items-center justify-between gap-4">
        <h3 className="text-[0.95rem] font-bold text-ink">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.78rem] font-semibold text-brand transition-colors hover:bg-brand/10"
        >
          <Icon name="PenTool" className="h-3.5 w-3.5" />
          Edit
        </button>
      </header>
      <dl>{children}</dl>
    </section>
  );
}

export default function Step7Review({ values, errors, set, onEdit }) {
  const pages = [
    ...values.pages,
    ...values.customPages.split(',').map((p) => p.trim()).filter(Boolean),
  ];

  return (
    <StepShell
      title="Check everything before sending"
      description="Edit any section that needs correcting. Once submitted you will get a reference number and a reply within 24 hours."
    >
      <div className="space-y-4">
        <Group title="Your details" step={1} onEdit={onEdit}>
          <Row label="Name" value={values.fullName} />
          <Row label="Email" value={values.email} />
          <Row label="WhatsApp" value={values.whatsapp} />
          <Row label="Location" value={[values.city, values.country].filter(Boolean).join(', ')} />
          <Row label="Preferred contact" value={labelOf(contactMethods, values.preferredContact)} />
        </Group>

        <Group title="Project type" step={2} onEdit={onEdit}>
          <Row label="Requested" value={values.projectTypes.map((t) => labelOf(projectTypes, t))} />
        </Group>

        <Group title="Your business" step={3} onEdit={onEdit}>
          <Row label="Business name" value={values.businessName} />
          <Row label="Industry" value={values.industry} />
          <Row label="Description" value={values.businessDescription} />
          <Row label="Customers" value={values.targetAudience} />
          <Row label="Location" value={values.businessLocation} />
          <Row label="Existing website" value={values.existingWebsite} />
          <Row label="Social links" value={values.socialLinks} />
        </Group>

        <Group title="Requirements" step={4} onEdit={onEdit}>
          <Row label="Page count" value={values.pageCount ? labelOf(pageCountOptions, values.pageCount) : ''} />
          <Row label="Pages" value={pages} />
          <Row label="Features" value={values.features.map((f) => labelOf(allFeatures, f))} />
        </Group>

        <Group title="Design & references" step={5} onEdit={onEdit}>
          <Row label="Has logo" value={values.hasLogo} />
          <Row label="Brand colours" value={values.hasBrandColors === 'yes' ? values.brandColors || 'Yes' : values.hasBrandColors} />
          <Row label="Style" value={values.designStyles.map((s) => labelOf(designStyles, s))} />
          <Row label="Reference sites" value={values.referenceSites.filter(Boolean)} />
          <Row label="What you like" value={values.referenceNotes} />
          <Row label="Files" value={values.files.map((f) => f.name)} />
        </Group>

        <Group title="Content, budget & timing" step={6} onEdit={onEdit}>
          <Row label="Content ready" value={values.contentReadiness ? labelOf(contentReadiness, values.contentReadiness) : ''} />
          <Row label="Material available" value={values.contentAssets} />
          <Row label="Domain" value={values.hasDomain === 'yes' ? values.domainName || 'Yes' : values.hasDomain} />
          <Row label="Hosting" value={values.hasHosting === 'yes' ? values.hostingProvider || 'Yes' : values.hasHosting} />
          <Row label="Budget" value={values.budget ? labelOf(budgetRanges, values.budget) : ''} />
          <Row label="Timeline" value={values.timeline ? labelOf(timelines, values.timeline) : ''} />
          <Row label="Description" value={values.projectDescription} />
          <Row label="Found via" value={values.referralSource} />
        </Group>
      </div>

      {/* Consent */}
      <div className="mt-7 rounded-2xl border bg-surface/50 p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(e) => set('consent', e.target.checked)}
            className="sr-only"
          />
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
              values.consent ? 'border-brand bg-brand text-white' : 'border-line/25'
            }`}
          >
            {values.consent && <Icon name="Check" className="h-3 w-3" strokeWidth={3} />}
          </span>
          <span className="text-[0.85rem] leading-relaxed text-muted">
            I understand these details will be used only to respond to this request and prepare a quotation. They
            will not be shared with anyone else or added to a mailing list.
          </span>
        </label>
        <FieldError>{errors.consent}</FieldError>
      </div>
    </StepShell>
  );
}
