import { useCallback, useEffect, useState } from 'react';
import adminApi from '../adminApi';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { EmptyState, LoadingBlock } from '@/components/ui/States';
import { Card, ConfirmDialog, PageHeader, SearchInput, StatusBadge, Toast, Toolbar, useToast } from '../components/AdminUi';
import { formatDate } from '@/utils/format';
import cn from '@/utils/cn';

export default function AdminMessages() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [state, setState] = useState({ loading: true, error: null });
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setState({ loading: true, error: null });
    try {
      const res = await adminApi.messages(search.trim() ? { search: search.trim() } : {});
      setRows(res.data || []);
      setState({ loading: false, error: null });
    } catch (error) {
      setState({ loading: false, error });
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  const openMessage = async (row) => {
    try {
      const { data } = await adminApi.message(row.id);
      setOpen(data);
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, status: data.status } : r)));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setStatus = async (status) => {
    setBusy(true);
    try {
      await adminApi.updateMessage(open.id, { status });
      setOpen((m) => ({ ...m, status }));
      setRows((rs) => rs.map((r) => (r.id === open.id ? { ...r, status } : r)));
      toast.success('Updated.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await adminApi.deleteMessage(deleting.id);
      setRows((rs) => rs.filter((r) => r.id !== deleting.id));
      if (open?.id === deleting.id) setOpen(null);
      setDeleting(null);
      toast.success('Deleted.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Messages" description="Everything sent through the contact form." />

      <Toolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Name, email, subject…" />
      </Toolbar>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <Card padded={false} className="max-h-[36rem] overflow-y-auto">
          {state.loading ? (
            <LoadingBlock />
          ) : state.error ? (
            <EmptyState icon="AlertCircle" title="Could not load" description={state.error.message} />
          ) : rows.length === 0 ? (
            <EmptyState icon="Mail" title="No messages" description="Contact form submissions land here." />
          ) : (
            <ul className="divide-y">
              {rows.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => openMessage(m)}
                    className={cn('w-full px-5 py-4 text-left transition-colors hover:bg-elevated/60',
                      open?.id === m.id && 'bg-brand/[0.07]')}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className={cn('truncate text-[0.88rem]', m.status === 'new' ? 'font-bold text-ink' : 'font-medium text-muted')}>
                        {m.name}
                      </span>
                      <StatusBadge status={m.status} />
                    </div>
                    <p className="mt-1 truncate text-[0.83rem] text-ink">{m.subject}</p>
                    <p className="mt-0.5 truncate text-[0.76rem] text-faint">{formatDate(m.created_at)}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title={open ? open.subject : 'No message selected'} subtitle={open ? `${open.name} · ${open.email}` : undefined}>
          {!open ? (
            <p className="py-10 text-center text-[0.85rem] text-faint">Choose a message to read it.</p>
          ) : (
            <>
              <p className="whitespace-pre-wrap text-[0.92rem] leading-relaxed text-ink">{open.message}</p>

              <dl className="mt-6 space-y-2 border-t pt-5 text-[0.82rem]">
                <div className="flex justify-between gap-4"><dt className="text-muted">Reference</dt><dd className="font-mono text-ink">{open.reference}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted">Received</dt><dd className="text-ink">{formatDate(open.created_at)}</dd></div>
                {open.phone && <div className="flex justify-between gap-4"><dt className="text-muted">Phone</dt><dd className="text-ink">{open.phone}</dd></div>}
              </dl>

              <div className="mt-6 flex flex-wrap gap-2.5 border-t pt-5">
                <Button href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject)}`} size="sm" icon="Mail">
                  Reply by email
                </Button>
                {['replied', 'archived'].map((s) => (
                  <Button key={s} as="button" type="button" variant="secondary" size="sm" disabled={busy}
                    onClick={() => setStatus(s)}>
                    Mark {s}
                  </Button>
                ))}
                <button type="button" onClick={() => setDeleting(open)}
                  className="ml-auto rounded-xl p-2 text-muted transition-colors hover:bg-red-500/10 hover:text-red-500" aria-label="Delete message">
                  <Icon name="X" className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(deleting)} title="Delete this message?"
        body={deleting ? `The message from ${deleting.name} will be removed.` : ''}
        busy={busy} onConfirm={remove} onCancel={() => setDeleting(null)}
      />
      <Toast toast={toast.toast} onDismiss={toast.dismiss} />
    </>
  );
}
