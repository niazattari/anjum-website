import { useRef } from 'react';
import StepShell from './StepShell';
import { Input, Textarea, Label, OptionCard, CheckRow } from '@/components/ui/Field';
import Icon from '@/components/ui/Icon';
import { designStyles } from '@/data/wizardOptions';

const MAX_FILES = 8;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB per file

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const YesNo = ({ value, onChange, name }) => (
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
        name={name}
      >
        {option}
      </button>
    ))}
  </div>
);

export default function Step5Design({ values, set, toggle }) {
  const inputRef = useRef(null);

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList).filter((f) => f.size <= MAX_SIZE);
    const next = [...values.files, ...incoming].slice(0, MAX_FILES);
    set('files', next);
  };

  const removeFile = (index) => set('files', values.files.filter((_, i) => i !== index));

  const setReference = (index, value) => {
    const next = [...values.referenceSites];
    next[index] = value;
    set('referenceSites', next);
  };

  return (
    <StepShell
      title="How should it look?"
      description="Design taste is hard to describe in words, which is why the reference websites matter more than the style labels."
      hint="No logo or brand colours yet? That is fine — say no and it gets handled as part of the project."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label>Do you have a logo?</Label>
          <YesNo name="hasLogo" value={values.hasLogo} onChange={(v) => set('hasLogo', v)} />
        </div>
        <div>
          <Label>Do you have brand colours?</Label>
          <YesNo name="hasBrandColors" value={values.hasBrandColors} onChange={(v) => set('hasBrandColors', v)} />
        </div>
      </div>

      {values.hasBrandColors === 'yes' && (
        <Input
          className="mt-4"
          label="Which colours?"
          name="brandColors"
          value={values.brandColors}
          onChange={(e) => set('brandColors', e.target.value)}
          placeholder="e.g. deep green #0F5132 and gold #C9A227"
        />
      )}

      <div className="mt-8">
        <Label hint="choose any that appeal">Design direction</Label>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {designStyles.map((style) => (
            <OptionCard
              key={style.id}
              multi
              title={style.label}
              selected={values.designStyles.includes(style.id)}
              onClick={() => toggle('designStyles', style.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Label hint="the most useful thing on this page">Websites you like</Label>
        <div className="space-y-3">
          {values.referenceSites.map((url, i) => (
            <Input
              key={i}
              name={`reference-${i}`}
              type="url"
              value={url}
              onChange={(e) => setReference(i, e.target.value)}
              placeholder={`https://example.com${i === 0 ? '  — a site whose look you like' : ''}`}
            />
          ))}
        </div>
        <Textarea
          className="mt-3"
          label="What do you like about them?"
          name="referenceNotes"
          rows={3}
          value={values.referenceNotes}
          onChange={(e) => set('referenceNotes', e.target.value)}
          placeholder="&ldquo;Clean&rdquo; tells me nothing. &ldquo;Their pricing page answers everything before you contact them&rdquo; tells me a lot."
        />
      </div>

      {/* Files */}
      <div className="mt-8">
        <Label hint={`up to ${MAX_FILES} files, 10MB each`}>Logo, screenshots or documents</Label>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
          className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed bg-surface px-6 py-8 text-center transition-colors hover:border-brand/50 hover:bg-elevated/50"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-elevated text-brand">
            <Icon name="Copy" className="h-5 w-5" />
          </span>
          <span className="text-[0.88rem] font-semibold text-ink">Click to choose files, or drop them here</span>
          <span className="text-[0.78rem] text-muted">Images, PDFs and documents</span>
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          accept="image/*,.pdf,.doc,.docx,.xlsx,.csv,.txt"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
        />

        {values.files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {values.files.map((file, i) => (
              <li key={`${file.name}-${i}`} className="flex items-center gap-3 rounded-lg border bg-surface px-3.5 py-2.5">
                <Icon name="FileText" className="h-4 w-4 shrink-0 text-brand" />
                <span className="min-w-0 flex-1 truncate text-[0.83rem] text-ink">{file.name}</span>
                <span className="shrink-0 text-[0.75rem] text-faint">{formatSize(file.size)}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label={`Remove ${file.name}`}
                  className="shrink-0 rounded p-1 text-faint transition-colors hover:text-red-500"
                >
                  <Icon name="X" className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-2.5 text-[0.76rem] leading-relaxed text-faint">
          File names are recorded with your request. Until the backend upload endpoint is connected, the files
          themselves are not transmitted — I will ask you for them directly when we speak.
        </p>
      </div>
    </StepShell>
  );
}
