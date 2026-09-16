import { useEffect, useMemo, useState } from 'react';
import adminApi from '../adminApi';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { Input, Label, Textarea } from '@/components/ui/Field';
import { EmptyState, LoadingBlock } from '@/components/ui/States';
import { Card, PageHeader, Toast, useToast } from '../components/AdminUi';
import cn from '@/utils/cn';

const GROUP_LABELS = {
  general: 'General',
  owner: 'About you',
  contact: 'Contact',
  announcement: 'Announcement bar',
  whatsapp: 'WhatsApp button',
  seo: 'SEO',
  admin: 'Admin link',
  legal: 'Legal',
};

export default function AdminSettings() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [state, setState] = useState({ loading: true, error: null });
  const [values, setValues] = useState({});
  const [social, setSocial] = useState([]);
  const [group, setGroup] = useState('general');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApi.settings();
        setData(res.data);
        setValues(Object.fromEntries(res.data.settings.map((s) => [s.key, s.value ?? ''])));
        setSocial(res.data.social);
        setState({ loading: false, error: null });
      } catch (error) {
        setState({ loading: false, error });
      }
    })();
  }, []);

  const groups = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.settings.map((s) => s.group))];
  }, [data]);

  const save = async () => {
    setBusy(true);
    try {
      await adminApi.saveSettings(
        Object.entries(values).map(([key, value]) => ({ key, value }))
      );
      toast.success('Settings saved. Refresh the site to see them.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const saveSocial = async () => {
    setBusy(true);
    try {
      await adminApi.saveSocial(
        social.map((l, i) => ({ id: l.id, url: l.url || '', enabled: Boolean(l.enabled), sort_order: i }))
      );
      toast.success('Social links saved.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  if (state.loading) return <LoadingBlock label="Loading settings" />;
  if (state.error) return <EmptyState icon="AlertCircle" title="Could not load settings" description={state.error.message} />;

  const visible = data.settings.filter((s) => s.group === group);

  return (
    <>
      <PageHeader title="Settings" description="Everything the public site reads for branding and contact.">
        <Button as="button" onClick={save} loading={busy} iconRight="Check" size="sm">Save changes</Button>
      </PageHeader>

      <div className="mb-5 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {groups.map((g) => (
          <button key={g} type="button" onClick={() => setGroup(g)} aria-pressed={group === g}
            className={cn('shrink-0 rounded-xl border px-3.5 py-1.5 text-[0.8rem] font-semibold transition-colors',
              group === g ? 'border-brand/50 bg-brand/12 text-brand' : 'text-muted hover:text-ink')}>
            {GROUP_LABELS[g] || g}
          </button>
        ))}
        <button type="button" onClick={() => setGroup('social')} aria-pressed={group === 'social'}
          className={cn('shrink-0 rounded-xl border px-3.5 py-1.5 text-[0.8rem] font-semibold transition-colors',
            group === 'social' ? 'border-brand/50 bg-brand/12 text-brand' : 'text-muted hover:text-ink')}>
          Social links
        </button>
      </div>

      {group === 'social' ? (
        <Card title="Social links" subtitle="A link with no URL is hidden on the site rather than shown broken.">
          <ul className="space-y-3">
            {social.map((link, i) => (
              <li key={link.id} className="grid gap-3 rounded-xl border bg-surface p-4 sm:grid-cols-[10rem_1fr_auto] sm:items-center">
                <span className="flex items-center gap-2.5 text-[0.88rem] font-semibold text-ink">
                  <Icon name={link.icon} className="h-4 w-4 text-brand" />
                  {link.label}
                </span>
                <input
                  type="url"
                  value={link.url || ''}
                  placeholder={`https://…  (your ${link.label} URL)`}
                  onChange={(e) => setSocial((s) => s.map((l, x) => (x === i ? { ...l, url: e.target.value } : l)))}
                  className="h-10 w-full rounded-lg border bg-elevated px-3 text-[0.85rem] text-ink placeholder:text-faint focus:border-brand/50 focus:outline-none"
                />
                <label className="flex cursor-pointer items-center gap-2 text-[0.8rem] font-semibold text-muted">
                  <input type="checkbox" checked={Boolean(link.enabled)} className="sr-only"
                    onChange={(e) => setSocial((s) => s.map((l, x) => (x === i ? { ...l, enabled: e.target.checked } : l)))} />
                  <span className={cn('flex h-5 w-9 items-center rounded-full p-0.5 transition-colors',
                    link.enabled ? 'bg-brand' : 'bg-line/20')}>
                    <span className={cn('h-4 w-4 rounded-full bg-white transition-transform', link.enabled && 'translate-x-4')} />
                  </span>
                  Show
                </label>
              </li>
            ))}
          </ul>
          <Button as="button" onClick={saveSocial} loading={busy} className="mt-5" iconRight="Check">Save social links</Button>
        </Card>
      ) : (
        <Card title={GROUP_LABELS[group] || group}>
          <div className="grid gap-5 md:grid-cols-2">
            {visible.map((setting) => {
              const value = values[setting.key] ?? '';
              const set = (v) => setValues((s) => ({ ...s, [setting.key]: v }));

              if (setting.type === 'boolean') {
                const on = value === '1' || value === 1 || value === true;
                return (
                  <label key={setting.key} className="flex cursor-pointer items-start gap-3 rounded-xl border bg-surface p-3.5 md:col-span-2">
                    <input type="checkbox" checked={on} className="sr-only" onChange={(e) => set(e.target.checked ? '1' : '0')} />
                    <span className={cn('mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors', on ? 'bg-brand' : 'bg-line/20')}>
                      <span className={cn('h-4 w-4 rounded-full bg-white transition-transform', on && 'translate-x-4')} />
                    </span>
                    <span>
                      <span className="block text-[0.86rem] font-semibold text-ink">{setting.label}</span>
                      {setting.hint && <span className="block text-[0.76rem] text-muted">{setting.hint}</span>}
                    </span>
                  </label>
                );
              }

              if (setting.type === 'textarea') {
                return (
                  <Textarea key={setting.key} className="md:col-span-2" label={setting.label} name={setting.key}
                    rows={setting.key === 'owner_bio' ? 8 : 3} hint={setting.hint}
                    value={value} onChange={(e) => set(e.target.value)} />
                );
              }

              return (
                <Input key={setting.key} label={setting.label} name={setting.key} hint={setting.hint}
                  value={value} onChange={(e) => set(e.target.value)} />
              );
            })}
          </div>
          <Button as="button" onClick={save} loading={busy} className="mt-6" iconRight="Check">Save changes</Button>
        </Card>
      )}

      <Toast toast={toast.toast} onDismiss={toast.dismiss} />
    </>
  );
}
