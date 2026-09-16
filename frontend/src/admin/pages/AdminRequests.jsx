import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../adminApi';
import Icon from '@/components/ui/Icon';
import { LoadingBlock, EmptyState } from '@/components/ui/States';
import { Card, PageHeader, SearchInput, StatusBadge, Toolbar } from '../components/AdminUi';
import { formatShortDate } from '@/utils/format';
import cn from '@/utils/cn';

const STATUSES = [
  'all', 'new', 'contacted', 'discussion', 'quotation_sent',
  'approved', 'in_development', 'completed', 'cancelled',
];

export default function AdminRequests() {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ loading: true, data: null, error: null });

  const params = useMemo(() => {
    const p = { page, per_page: 20 };
    if (status !== 'all') p.status = status;
    if (search.trim()) p.search = search.trim();
    return p;
  }, [status, search, page]);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));

    // Debounced so typing in the search box does not fire a request per key.
    const timer = setTimeout(async () => {
      try {
        const data = await adminApi.requests(params);
        if (!cancelled) setState({ loading: false, data, error: null });
      } catch (error) {
        if (!cancelled) setState({ loading: false, data: null, error });
      }
    }, 250);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [params]);

  useEffect(() => { setPage(1); }, [status, search]);

  const rows = state.data?.data ?? [];
  const meta = state.data?.meta;

  return (
    <>
      <PageHeader title="Project requests" description="Everything submitted through the requirement wizard." />

      <Toolbar>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              aria-pressed={status === s}
              className={cn(
                'shrink-0 rounded-xl border px-3 py-1.5 text-[0.78rem] font-semibold capitalize transition-colors',
                status === s ? 'border-brand/50 bg-brand/12 text-brand' : 'text-muted hover:text-ink'
              )}
            >
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Reference, name, business…" />
      </Toolbar>

      <Card padded={false}>
        {state.loading && !state.data ? (
          <LoadingBlock label="Loading requests" />
        ) : state.error ? (
          <div className="p-5">
            <EmptyState icon="AlertCircle" title="Could not load requests" description={state.error.message} />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon="ClipboardList"
            title="No requests here"
            description={status === 'all'
              ? 'Submissions from the project form will appear here.'
              : `Nothing at the “${status.replace(/_/g, ' ')}” stage right now.`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[0.85rem]">
              <thead>
                <tr className="border-b text-[0.72rem] uppercase tracking-wider text-faint">
                  <th className="px-5 py-3 font-semibold">Reference</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="hidden px-5 py-3 font-semibold lg:table-cell">Contact</th>
                  <th className="hidden px-5 py-3 font-semibold sm:table-cell">Budget</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="hidden px-5 py-3 font-semibold md:table-cell">Received</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 transition-colors hover:bg-elevated/50">
                    <td className="px-5 py-3 font-mono text-[0.8rem] font-semibold text-brand">{r.reference}</td>
                    <td className="px-5 py-3">
                      <span className="block font-medium text-ink">{r.full_name}</span>
                      <span className="block text-[0.78rem] text-muted">{r.business_name}</span>
                    </td>
                    <td className="hidden px-5 py-3 lg:table-cell">
                      <span className="block text-[0.8rem] text-muted">{r.email}</span>
                      <span className="block text-[0.78rem] text-faint">{r.whatsapp}</span>
                    </td>
                    <td className="hidden px-5 py-3 text-muted sm:table-cell">{r.budget || '—'}</td>
                    <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                    <td className="hidden px-5 py-3 text-muted md:table-cell">{formatShortDate(r.created_at)}</td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/admin/requests/${r.reference}`}
                        className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-brand hover:text-accent"
                      >
                        Open <Icon name="ArrowRight" className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {meta && meta.last_page > 1 && (
        <div className="mt-5 flex items-center justify-between text-[0.82rem] text-muted">
          <span>Page {meta.current_page} of {meta.last_page} · {meta.total} total</span>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border px-3 py-1.5 font-semibold transition-colors hover:text-ink disabled:opacity-40">
              Previous
            </button>
            <button type="button" disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border px-3 py-1.5 font-semibold transition-colors hover:text-ink disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
