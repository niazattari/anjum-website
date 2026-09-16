import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import adminApi, { AdminApiError } from '../adminApi';
import resources from '../resources';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { Input, Label, Select, Textarea, FieldError } from '@/components/ui/Field';
import { EmptyState, LoadingBlock } from '@/components/ui/States';
import {
  Card, ConfirmDialog, ListEditor, PageHeader, SearchInput, Toast, Toolbar, useToast,
} from '../components/AdminUi';
import { formatShortDate, slugify } from '@/utils/format';
import cn from '@/utils/cn';

/** Repeatable block editor for blog article bodies. */
function BlocksEditor({ value = [], onChange }) {
  const update = (i, patch) => onChange(value.map((b, x) => (x === i ? { ...b, ...patch } : b)));
  const add = (type) => onChange([...value, type === 'ul' ? { type, items: [''] } : { type, text: '' }]);
  const move = (i, delta) => {
    const next = [...value];
    const t = i + delta;
    if (t < 0 || t >= next.length) return;
    [next[i], next[t]] = [next[t], next[i]];
    onChange(next);
  };

  return (
    <div>
      <Label>Article</Label>
      <div className="space-y-3">
        {value.map((block, i) => (
          <div key={i} className="rounded-xl border bg-surface p-3">
            <div className="mb-2 flex items-center gap-2">
              <select
                value={block.type}
                onChange={(e) => {
                  const type = e.target.value;
                  update(i, type === 'ul' ? { type, items: block.items || [''], text: undefined } : { type, text: block.text || '', items: undefined });
                }}
                className="h-8 rounded-lg border bg-elevated px-2 text-[0.78rem] font-semibold text-ink focus:outline-none"
              >
                <option value="p">Paragraph</option>
                <option value="h2">Heading</option>
                <option value="ul">Bullet list</option>
              </select>
              <span className="ml-auto flex gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"
                  className="rounded p-1 text-faint hover:text-ink disabled:opacity-30">
                  <Icon name="ChevronDown" className="h-3.5 w-3.5 rotate-180" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Move down"
                  className="rounded p-1 text-faint hover:text-ink disabled:opacity-30">
                  <Icon name="ChevronDown" className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => onChange(value.filter((_, x) => x !== i))} aria-label="Remove block"
                  className="rounded p-1 text-faint hover:text-red-500">
                  <Icon name="X" className="h-3.5 w-3.5" />
                </button>
              </span>
            </div>

            {block.type === 'ul' ? (
              <ListEditor label="" value={block.items || []} onChange={(items) => update(i, { items })} placeholder="Add a bullet" />
            ) : (
              <textarea
                value={block.text || ''}
                onChange={(e) => update(i, { text: e.target.value })}
                rows={block.type === 'h2' ? 1 : 4}
                placeholder={block.type === 'h2' ? 'Section heading' : 'Paragraph text'}
                className="w-full resize-y rounded-lg border bg-elevated px-3 py-2 text-[0.86rem] leading-relaxed text-ink focus:border-brand/50 focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        {[['p', 'Paragraph'], ['h2', 'Heading'], ['ul', 'List']].map(([type, label]) => (
          <button key={type} type="button" onClick={() => add(type)}
            className="rounded-lg border px-3 py-1.5 text-[0.78rem] font-semibold text-muted transition-colors hover:border-brand/40 hover:text-ink">
            + {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-surface p-3.5">
      <input type="checkbox" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span className={cn('mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors',
        checked ? 'bg-brand' : 'bg-line/20')}>
        <span className={cn('h-4 w-4 rounded-full bg-white transition-transform', checked && 'translate-x-4')} />
      </span>
      <span className="min-w-0">
        <span className="block text-[0.86rem] font-semibold text-ink">{label}</span>
        {hint && <span className="block text-[0.76rem] text-muted">{hint}</span>}
      </span>
    </label>
  );
}

export default function ResourcePage() {
  const { resource } = useParams();
  const schema = resources[resource];

  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [relations, setRelations] = useState({});
  const [state, setState] = useState({ loading: true, error: null });
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);      // record or 'new'
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    if (!schema) return;
    setState({ loading: true, error: null });
    try {
      const { data } = await adminApi.list(schema.endpoint);
      setRows(data);

      const relationFields = schema.fields.filter((f) => f.type === 'relation');
      const loaded = {};
      await Promise.all(relationFields.map(async (f) => {
        const res = await adminApi.list(f.resource);
        loaded[f.resource] = res.data;
      }));
      setRelations(loaded);
      setState({ loading: false, error: null });
    } catch (error) {
      setState({ loading: false, error });
    }
  }, [schema]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setEditing(null); setSearch(''); }, [resource]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) =>
      schema.columns.some((c) => String(r[c.key] ?? '').toLowerCase().includes(q))
    );
  }, [rows, search, schema]);

  if (!schema) {
    return <EmptyState icon="CircleHelp" title="Unknown section" description={`There is no “${resource}” section.`} />;
  }

  const startCreate = () => {
    setForm({ ...schema.blank });
    setErrors({});
    setEditing('new');
  };

  const startEdit = (row) => {
    // Relations come back as objects; the form works with plain values.
    const values = { ...schema.blank };
    schema.fields.forEach((f) => {
      let v = row[f.key];
      if (f.type === 'list' && Array.isArray(v)) {
        v = v.map((item) => (typeof item === 'string' ? item : item.value ?? item.name ?? ''));
      }
      if (f.type === 'date' && v) v = String(v).slice(0, 10);
      values[f.key] = v ?? schema.blank[f.key];
    });

    // Child lists arrive under their relation names on some resources.
    if (schema.endpoint === 'services') {
      values.features = (row.all_features || []).filter((f) => f.kind === 'feature').map((f) => f.value);
      values.deliverables = (row.all_features || []).filter((f) => f.kind === 'deliverable').map((f) => f.value);
      values.ideal_for = (row.all_features || []).filter((f) => f.kind === 'ideal_for').map((f) => f.value);
    }
    if (row.features && Array.isArray(row.features) && schema.endpoint !== 'services') {
      values.features = row.features.map((f) => (typeof f === 'string' ? f : f.value));
    }
    if (row.technologies) values.technologies = row.technologies.map((t) => t.name ?? t);
    if (row.tags) values.tags = row.tags.map((t) => t.name ?? t);

    setForm({ ...values, id: row.id });
    setErrors({});
    setEditing(row);
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});

    const payload = { ...form };
    delete payload.id;
    if (payload.published_at === '') payload.published_at = null;

    try {
      if (editing === 'new') {
        await adminApi.create(schema.endpoint, payload);
        toast.success(`${schema.title} entry created.`);
      } else {
        await adminApi.update(schema.endpoint, editing.id, payload);
        toast.success('Saved.');
      }
      setEditing(null);
      await load();
    } catch (error) {
      if (error instanceof AdminApiError && error.errors) {
        setErrors(error.fieldErrors);
        toast.error('Please check the highlighted fields.');
      } else {
        toast.error(error.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await adminApi.remove(schema.endpoint, deleting.id);
      toast.success('Deleted.');
      setDeleting(null);
      await load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const setValue = (key, value) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Auto-fill the slug from its source field while creating.
      const slugField = schema.fields.find((x) => x.type === 'slug' && x.from === key);
      if (slugField && editing === 'new') next[slugField.key] = slugify(value);
      return next;
    });
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const renderField = (field) => {
    const value = form[field.key];
    const error = errors[field.key];

    switch (field.type) {
      case 'textarea':
        return <Textarea key={field.key} label={field.label} name={field.key} rows={field.rows || 3}
          value={value ?? ''} onChange={(e) => setValue(field.key, e.target.value)}
          error={error} required={field.required} hint={field.hint} />;
      case 'number':
        return <Input key={field.key} label={field.label} name={field.key} type="number"
          value={value ?? ''} onChange={(e) => setValue(field.key, e.target.value === '' ? '' : Number(e.target.value))}
          error={error} required={field.required} hint={field.hint} />;
      case 'date':
        return <Input key={field.key} label={field.label} name={field.key} type="date"
          value={value ?? ''} onChange={(e) => setValue(field.key, e.target.value)}
          error={error} hint={field.hint} />;
      case 'boolean':
        return <div key={field.key}><Toggle label={field.label} hint={field.hint} checked={value}
          onChange={(v) => setValue(field.key, v)} /></div>;
      case 'select':
        return <Select key={field.key} label={field.label} name={field.key} options={field.options}
          value={value ?? ''} onChange={(e) => setValue(field.key, e.target.value)}
          error={error} required={field.required} placeholder="Choose…" />;
      case 'relation': {
        const options = (relations[field.resource] || []).map((r) => ({ id: r.id, label: r.name || r.title }));
        return <Select key={field.key} label={field.label} name={field.key} options={options}
          value={value ?? ''} onChange={(e) => setValue(field.key, Number(e.target.value))}
          error={error} required={field.required} placeholder="Choose…" />;
      }
      case 'color':
        return (
          <div key={field.key}>
            <Label required={field.required}>{field.label}</Label>
            <div className="flex gap-2">
              <input type="color" value={value || '#3B82F6'} onChange={(e) => setValue(field.key, e.target.value)}
                aria-label={field.label}
                className="h-12 w-14 cursor-pointer rounded-xl border bg-surface p-1" />
              <input type="text" value={value ?? ''} onChange={(e) => setValue(field.key, e.target.value)}
                className="h-12 flex-1 rounded-xl border bg-surface px-4 font-mono text-[0.86rem] text-ink focus:border-brand/50 focus:outline-none" />
            </div>
            <FieldError>{error}</FieldError>
          </div>
        );
      case 'list':
        return <ListEditor key={field.key} label={field.label} value={value || []}
          onChange={(v) => setValue(field.key, v)} />;
      case 'blocks':
        return <BlocksEditor key={field.key} value={value || []} onChange={(v) => setValue(field.key, v)} />;
      case 'media':
        return <Input key={field.key} label={field.label} name={field.key} value={value ?? ''}
          onChange={(e) => setValue(field.key, e.target.value)} error={error}
          hint={field.hint || 'Path from the media library, e.g. /projects/name/cover.webp'} />;
      case 'slug':
      case 'text':
      default:
        return <Input key={field.key} label={field.label} name={field.key} value={value ?? ''}
          onChange={(e) => setValue(field.key, e.target.value)} error={error}
          required={field.required} hint={field.hint} />;
    }
  };

  const cell = (row, column) => {
    const value = row[column.key];
    if (column.type === 'boolean') {
      return value
        ? <Icon name="CheckCircle2" className="h-4 w-4 text-emerald-500" />
        : <Icon name="X" className="h-4 w-4 text-faint" />;
    }
    if (column.type === 'date') return value ? formatShortDate(value) : '—';
    return <span className="line-clamp-1">{value ?? '—'}</span>;
  };

  return (
    <>
      <PageHeader title={schema.title} description={schema.description}>
        <Button as="button" onClick={startCreate} icon="Plus" size="sm">Add new</Button>
      </PageHeader>

      {editing ? (
        <Card title={editing === 'new' ? `New ${schema.title.toLowerCase()} entry` : 'Edit entry'}>
          <form onSubmit={save} noValidate>
            <div className="grid gap-5 md:grid-cols-2">
              {schema.fields.map((field) => (
                <div key={field.key} className={['textarea', 'list', 'blocks'].includes(field.type) ? 'md:col-span-2' : ''}>
                  {renderField(field)}
                </div>
              ))}
            </div>

            <div className="mt-7 flex gap-2.5 border-t pt-5">
              <Button type="submit" loading={busy} iconRight="Check">Save</Button>
              <Button as="button" type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </form>
        </Card>
      ) : (
        <>
          <Toolbar>
            <SearchInput value={search} onChange={setSearch} placeholder={`Search ${schema.title.toLowerCase()}…`} />
            <span className="text-[0.8rem] text-faint">{filtered.length} of {rows.length}</span>
          </Toolbar>

          <Card padded={false}>
            {state.loading ? (
              <LoadingBlock />
            ) : state.error ? (
              <EmptyState icon="AlertCircle" title="Could not load" description={state.error.message} />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={schema.icon}
                title={rows.length === 0 ? `No ${schema.title.toLowerCase()} yet` : 'Nothing matches that search'}
                description={rows.length === 0 ? 'Add your first entry to see it on the site.' : undefined}
                action={rows.length === 0 ? <Button as="button" onClick={startCreate} icon="Plus">Add new</Button> : null}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[0.85rem]">
                  <thead>
                    <tr className="border-b text-[0.72rem] uppercase tracking-wider text-faint">
                      {schema.columns.map((c) => (
                        <th key={c.key} className={cn('px-5 py-3 font-semibold',
                          c.hideBelow === 'sm' && 'hidden sm:table-cell',
                          c.hideBelow === 'md' && 'hidden md:table-cell')}>
                          {c.label}
                        </th>
                      ))}
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr key={row.id} className="border-b last:border-0 transition-colors hover:bg-elevated/50">
                        {schema.columns.map((c) => (
                          <td key={c.key} className={cn('max-w-xs px-5 py-3 text-ink',
                            c.hideBelow === 'sm' && 'hidden sm:table-cell',
                            c.hideBelow === 'md' && 'hidden md:table-cell')}>
                            {cell(row, c)}
                          </td>
                        ))}
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-1">
                            <button type="button" onClick={() => startEdit(row)} aria-label={`Edit ${row[schema.labelKey]}`}
                              className="rounded-lg p-2 text-muted transition-colors hover:bg-elevated hover:text-ink">
                              <Icon name="PenTool" className="h-3.5 w-3.5" />
                            </button>
                            <button type="button" onClick={() => setDeleting(row)} aria-label={`Delete ${row[schema.labelKey]}`}
                              className="rounded-lg p-2 text-muted transition-colors hover:bg-red-500/10 hover:text-red-500">
                              <Icon name="X" className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this entry?"
        body={deleting ? `“${deleting[schema.labelKey]}” will be removed from the site.` : ''}
        busy={busy}
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
      />
      <Toast toast={toast.toast} onDismiss={toast.dismiss} />
    </>
  );
}
