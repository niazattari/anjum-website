// ---------------------------------------------------------------------------
// Form delivery for a site with no backend.
//
// The problem this solves: when VITE_API_BASE_URL is empty the mock API used to
// return `{ success: true }` and log the submission to the console. On a local
// machine that is a harmless stub. On a public site it is a trap — a client
// fills in the wizard, sees "thank you", and the enquiry reaches nobody.
//
// So delivery is now real, with two tiers:
//
//   1. Web3Forms, when VITE_WEB3FORMS_KEY is set. Free, 250 submissions a
//      month, emails each one straight through. No account is needed on the
//      site's side — the key is just a string.
//   2. WhatsApp, always, as the fallback and the receipt. The caller gets back
//      a wa.me link with the whole submission pre-written, and shows it. Even
//      if email delivery fails or was never configured, the enquiry is one tap
//      from arriving.
//
// The free Web3Forms tier cannot carry file attachments, so files are listed by
// name in the message and the confirmation screen asks for them over WhatsApp.
// Saying so is better than dropping them quietly.
// ---------------------------------------------------------------------------
import { site } from '@/data/site';

const KEY = import.meta.env.VITE_WEB3FORMS_KEY || '';
const ENDPOINT = 'https://api.web3forms.com/submit';

export const emailForwardingEnabled = Boolean(KEY);

/** A short human reference so the client and I can talk about one submission. */
export const makeReference = () =>
  `REQ-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

const label = (key) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

const printable = (value) => {
  if (value === null || value === undefined || value === '') return null;
  if (Array.isArray(value)) {
    const items = value.filter((v) => v !== '' && v !== null && v !== undefined);
    return items.length ? items.join(', ') : null;
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value instanceof File) return `${value.name} (${Math.round(value.size / 1024)} KB)`;
  return String(value);
};

/** Flattens a payload into ordered "Label: value" lines, dropping empties. */
export function toLines(payload) {
  const lines = [];
  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'files') {
      const names = (value || []).map((f) => f?.name).filter(Boolean);
      if (names.length) lines.push(`Attachments: ${names.join(', ')}`);
      return;
    }
    const text = printable(value);
    if (text) lines.push(`${label(key)}: ${text}`);
  });
  return lines;
}

export function whatsappUrlFor(subject, payload, reference) {
  const body = [`*${subject}*`, `Reference: ${reference}`, '', ...toLines(payload)].join('\n');
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(body)}`;
}

/**
 * Attempts email delivery. Never throws: a failed send must not turn into a
 * failed submission, because the WhatsApp link still works.
 * @returns {Promise<boolean>} whether the email actually went out
 */
async function sendEmail(subject, payload, reference) {
  if (!KEY) return false;

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: KEY,
        subject: `${subject} — ${reference}`,
        from_name: site.name,
        // Replying to the notification should reach the client, not me.
        replyto: payload.email || undefined,
        reference,
        message: toLines(payload).join('\n'),
      }),
    });
    const body = await response.json().catch(() => ({}));
    return response.ok && body.success !== false;
  } catch {
    return false;
  }
}

/**
 * Delivers a submission and reports honestly how it got there.
 * @returns {Promise<{success: true, reference: string, emailed: boolean, whatsappUrl: string, hasFiles: boolean}>}
 */
export async function deliver(subject, payload) {
  const reference = makeReference();
  const emailed = await sendEmail(subject, payload, reference);

  return {
    success: true,
    reference,
    emailed,
    whatsappUrl: whatsappUrlFor(subject, payload, reference),
    hasFiles: Boolean((payload.files || []).length),
  };
}

export default deliver;
