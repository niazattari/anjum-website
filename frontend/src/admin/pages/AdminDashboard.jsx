import { Link } from 'react-router-dom';
import useAsync from '@/hooks/useAsync';
import adminApi from '../adminApi';
import Icon from '@/components/ui/Icon';
import { ErrorState, LoadingBlock } from '@/components/ui/States';
import { Card, PageHeader, StatusBadge } from '../components/AdminUi';
import { RankedBars, TrendColumns } from '../components/Charts';
import { formatShortDate } from '@/utils/format';

export default function AdminDashboard() {
  const { data, loading, error, reload } = useAsync(() => adminApi.dashboard(), []);

  if (loading) return <LoadingBlock label="Loading dashboard" />;
  if (error) return <ErrorState onRetry={reload} message={error.message} />;

  const d = data.data;
  const totalThisYear = d.requestsByMonth.reduce((sum, m) => sum + m.count, 0);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Enquiries, content and what needs attention."
      />

      {/* KPI row — headline numbers belong in tiles, not a bar chart */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {d.cards.map((card) => (
          <div key={card.key} className="rounded-2xl border bg-surface/70 p-5">
            <div className="flex items-center justify-between">
              <span className="text-[0.78rem] text-muted">{card.label}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-elevated text-brand">
                <Icon name={card.icon} className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card
          title="Project requests"
          subtitle={`${totalThisYear} in the last 12 months`}
        >
          <TrendColumns data={d.requestsByMonth} label="requests" />
        </Card>

        <Card title="Pipeline" subtitle="Requests by stage">
          <RankedBars data={d.requestsByStatus} labelKey="label" emptyLabel="No requests yet" />
        </Card>

        <Card title="Portfolio" subtitle="Projects by category">
          <RankedBars data={d.projectsByCategory} labelKey="name" emptyLabel="No projects yet" />
        </Card>

        <Card title="Most viewed" subtitle="Case study page views">
          <RankedBars data={d.topProjects} labelKey="title" valueKey="views" emptyLabel="No views recorded yet" />
        </Card>
      </div>

      <Card
        className="mt-5"
        padded={false}
        title="Latest requests"
        action={
          <Link to="/admin/requests" className="text-[0.82rem] font-semibold text-brand hover:text-accent">
            View all
          </Link>
        }
      >
        {d.recentRequests.length === 0 ? (
          <p className="px-5 py-10 text-center text-[0.85rem] text-faint">
            Nothing yet. Submissions from the project form land here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[0.85rem]">
              <thead>
                <tr className="border-b text-[0.72rem] uppercase tracking-wider text-faint">
                  <th className="px-5 py-3 font-semibold">Reference</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="hidden px-5 py-3 font-semibold sm:table-cell">Budget</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="hidden px-5 py-3 font-semibold md:table-cell">Received</th>
                </tr>
              </thead>
              <tbody>
                {d.recentRequests.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 transition-colors hover:bg-elevated/50">
                    <td className="px-5 py-3">
                      <Link to={`/admin/requests/${r.reference}`} className="font-mono text-[0.8rem] font-semibold text-brand hover:text-accent">
                        {r.reference}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <span className="block font-medium text-ink">{r.name}</span>
                      <span className="block text-[0.78rem] text-muted">{r.business}</span>
                    </td>
                    <td className="hidden px-5 py-3 text-muted sm:table-cell">{r.budget || '—'}</td>
                    <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                    <td className="hidden px-5 py-3 text-muted md:table-cell">{formatShortDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
