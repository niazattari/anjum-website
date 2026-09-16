import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import adminApi from '../adminApi';
import { site } from '@/data/site';
import { whatsappLink, whatsappMessages } from '@/utils/whatsapp';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Field';
import { EmptyState, LoadingBlock } from '@/components/ui/States';
import { Card, ConfirmDialog, PageHeader, StatusBadge, Toast, useToast } from '../components/AdminUi';
import { formatDate } from '@/utils/format';
import cn from '@/utils/cn';

const STATUSES = [
  'new', 'contacted', 'discussion', 'quotation_sent',
  'approved', 'in_development', 'completed', 'cancelled',
];

function Row({ label, value }) {
  const empty = value === null || value === undefined || value === '' ||
    (Array.isArray(value) && value.length === 0);

  return (
    <div className="flex flex-col gap-1 border-b py-2.5 last:border-0 sm:flex-row sm:gap-6">
      <dt className="shrink-0 text-[0.8rem] text-muted sm:w-44">{label}</dt>
      <dd className={cn('min-w-0 flex-1 whitespace-pre-wrap text-[0.86rem]', empty ? 'text-faint' : 'text-ink')}>
        {empty ? 'Not provided' : Array.isArray(value) ? value.join(', ') : String(value)}
      </dd>
    </div>
  );
}

export default function AdminRequestDetail() {
  const { reference } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [request, setRequest] = useState(null);
  const [state, setState] = useState({ loading: true, error: null });
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await adminApi.request(reference);
      setRequest(data);
      setState({ loading: false, error: null });
    } catch (error) {
      setState({ loading: false, error });
    }
  }, [reference]);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (status) => {
    setBusy(true);
    try {
      const { data } = await adminApi.updateRequestStatus(reference, { status });
      setRequest((r) => ({ ...r, ...data }));
      toast.success(`Moved to “${status.replace(/_/g, ' ')}”.`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setBusy(true);
    try {
      const { data } = await adminApi.addRequestNote(reference, note.trim());
      setRequest((r) => ({ ...r, notes: [data, ...(r.notes || [])] }));
      setNote('');
      toast.success('Note added.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await adminApi.deleteRequest(reference);
      navigate('/admin/requests', { replace: true });
    } catch (error) {
      toast.error(error.message);
      setBusy(false);
      setConfirming(false);
    }
  };

  if (state.loading) return <LoadingBlock label="Loading request" />;

  if (state.error || !request) {
    return (
      <EmptyState
        icon="ClipboardList"
        title="Request not found"
        description={state.error?.message || 'That reference does not exist.'}
        action={<Button to="/admin/requests" icon="ArrowLeft">Back to requests</Button>}
      />
    );
  }

  const r = request;
  const pages = [
    ...(r.pages || []).map((p) => p.value),
    ...String(r.custom_pages || '').split(',').map((s) => s.trim()).filter(Boolean),
  ];

  return (
    <>
      <Link to="/admin/requests" className="mb-4 inline-flex items-center gap-1.5 text-[0.83rem] font-semibold text-muted transition-colors hover:text-ink">
        <Icon name="ArrowLeft" className="h-3.5 w-3.5" /> All requests
      </Link>

      <PageHeader title={r.business_name} description={`${r.full_name} · ${r.reference}`}>
        <Button
          href={whatsappLink(r.whatsapp, whatsappMessages.request(r.reference))}
          variant="whatsapp" size="sm" icon="MessageCircle"
        >
          WhatsApp
        </Button>
        <Button href={`mailto:${r.email}?subject=Your project request ${r.reference}`} variant="secondary" size="sm" icon="Mail">
          Email
        </Button>
        <Button as="button" variant="ghost" size="sm" icon="Printer" onClick={() => window.print()}>
          Print
        </Button>
      </PageHeader>

      {/* Pipeline */}
      <Card title="Status" subtitle="Move the request through the pipeline" className="mb-5">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={busy}
              onClick={() => setStatus(s)}
              aria-pressed={r.status === s}
              className={cn(
                'rounded-xl border px-3 py-1.5 text-[0.78rem] font-semibold capitalize transition-colors disabled:opacity-50',
                r.status === s ? 'border-brand/50 bg-brand/12 text-brand' : 'text-muted hover:text-ink'
              )}
            >
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.78rem] text-muted">
          <span>Received {formatDate(r.created_at)}</span>
          {r.contacted_at && <span>Contacted {formatDate(r.contacted_at)}</span>}
          {r.quoted_at && <span>Quoted {formatDate(r.quoted_at)}</span>}
        </p>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <Card title="Contact">
            <dl>
              <Row label="Name" value={r.full_name} />
              <Row label="Email" value={r.email} />
              <Row label="WhatsApp" value={r.whatsapp} />
              <Row label="Location" value={[r.city, r.country].filter(Boolean).join(', ')} />
              <Row label="Prefers" value={r.preferred_contact} />
              <Row label="Found via" value={r.referral_source} />
            </dl>
          </Card>

          <Card title="Business">
            <dl>
              <Row label="Business" value={r.business_name} />
              <Row label="Industry" value={r.industry} />
              <Row label="What they do" value={r.business_description} />
              <Row label="Customers" value={r.target_audience} />
              <Row label="Location" value={r.business_location} />
              <Row label="Existing site" value={r.existing_website} />
              <Row label="Social" value={r.social_links} />
            </dl>
          </Card>

          <Card title="Requirements">
            <dl>
              <Row label="Project type" value={(r.types || []).map((t) => t.value)} />
              <Row label="Page count" value={r.page_count} />
              <Row label="Pages" value={pages} />
              <Row label="Features" value={(r.features || []).map((f) => f.value)} />
            </dl>
          </Card>

          <Card title="Design">
            <dl>
              <Row label="Has logo" value={r.has_logo} />
              <Row label="Brand colours" value={r.has_brand_colors === 'yes' ? (r.brand_colors || 'Yes') : r.has_brand_colors} />
              <Row label="Styles" value={r.design_styles} />
              <Row label="References" value={(r.references || []).map((x) => x.url)} />
              <Row label="Likes about them" value={r.reference_notes} />
            </dl>
          </Card>

          <Card title="In their words">
            <p className="whitespace-pre-wrap text-[0.92rem] leading-relaxed text-ink">{r.project_description}</p>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Commercials">
            <dl>
              <Row label="Budget" value={r.budget} />
              <Row label="Timeline" value={r.timeline} />
              <Row label="Content" value={r.content_readiness} />
              <Row label="Has" value={r.content_assets} />
              <Row label="Domain" value={r.has_domain === 'yes' ? (r.domain_name || 'Yes') : r.has_domain} />
              <Row label="Hosting" value={r.has_hosting === 'yes' ? (r.hosting_provider || 'Yes') : r.has_hosting} />
              <Row label="Quoted" value={r.quoted_amount} />
            </dl>
          </Card>

          {(r.files || []).length > 0 && (
            <Card title="Attachments">
              <ul className="space-y-2">
                {r.files.map((f) => (
                  <li key={f.id}>
                    <a
                      href={f.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-[0.83rem] transition-colors hover:border-brand/40"
                    >
                      <Icon name="FileText" className="h-4 w-4 shrink-0 text-brand" />
                      <span className="min-w-0 flex-1 truncate text-ink">{f.original_name}</span>
                      <Icon name="ExternalLink" className="h-3.5 w-3.5 shrink-0 text-faint" />
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card title="Internal notes" subtitle="Only visible here">
            <form onSubmit={addNote}>
              <Textarea
                name="note" rows={3} value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Called, asked about the payment gateway…"
              />
              <Button type="submit" size="sm" className="mt-3" loading={busy} disabled={!note.trim()}>
                Add note
              </Button>
            </form>

            <ul className="mt-5 space-y-3">
              {(r.notes || []).map((n) => (
                <li key={n.id} className="rounded-xl bg-elevated/60 p-3.5">
                  <p className="whitespace-pre-wrap text-[0.85rem] text-ink">{n.body}</p>
                  <p className="mt-2 text-[0.72rem] text-faint">
                    {n.user?.name || 'Admin'} · {formatDate(n.created_at)}
                  </p>
                </li>
              ))}
              {(r.notes || []).length === 0 && (
                <li className="text-[0.82rem] text-faint">No notes yet.</li>
              )}
            </ul>
          </Card>

          <Card title="Danger zone">
            <p className="text-[0.83rem] leading-relaxed text-muted">
              Archiving removes this request from the list. It is a soft delete — the row stays in the database.
            </p>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="mt-4 rounded-xl border border-red-500/30 px-4 py-2 text-[0.83rem] font-semibold text-red-500 transition-colors hover:bg-red-500/10"
            >
              Archive request
            </button>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Archive this request?"
        body={`${r.reference} will be removed from the list. It stays recoverable in the database.`}
        confirmLabel="Archive"
        busy={busy}
        onConfirm={remove}
        onCancel={() => setConfirming(false)}
      />
      <Toast toast={toast.toast} onDismiss={toast.dismiss} />
    </>
  );
}
