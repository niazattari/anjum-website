import { useEffect, useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { applySeo } from '@/utils/seo';
import { useSettings } from '@/context/SettingsContext';
import { whatsappLink, whatsappMessages } from '@/utils/whatsapp';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

const buildNextSteps = (site, emailed) => [
  emailed
    ? { icon: 'Mail', title: 'Your request has reached me', text: 'A copy of everything you submitted is in my inbox.' }
    : { icon: 'MessageCircle', title: 'Send it on WhatsApp', text: 'Your answers are already written out — one tap and they reach me.' },
  { icon: 'ClipboardList', title: 'I read the requirements properly', text: 'And come back with anything that needs clarifying before quoting.' },
  { icon: 'FileText', title: 'A written scope and fixed quotation', text: `Usually ${site.contact.responseTime.toLowerCase()}, with a realistic timeline.` },
];

export default function RequestReceived() {
  const { state } = useLocation();
  const site = useSettings();
  const nextSteps = buildNextSteps(site, state?.emailed);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    applySeo({ title: 'Request received', description: 'Your project request has been submitted.', path: '/request-received' });
  }, []);

  if (!state?.reference) return <Navigate to="/start-project" replace />;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(state.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Section className="relative overflow-hidden pt-28">
      <div className="grid-backdrop absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="glow-orb left-1/2 top-6 h-72 w-72 -translate-x-1/2 bg-emerald-500/20" aria-hidden="true" />

      <div className="relative mx-auto max-w-2xl text-center">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500"
        >
          <Icon name="CheckCircle2" className="h-8 w-8" />
        </motion.span>

        <h1 className="mt-6 text-display-md text-ink">
          {state.emailed ? 'Your project request has been received' : 'One tap left to send it'}
        </h1>
        <p className="mt-4 text-muted">
          Thank you{state.name ? `, ${state.name.split(' ')[0]}` : ''}.{' '}
          {state.emailed
            ? `Everything you submitted has been recorded — you will get a reply ${site.contact.responseTime.toLowerCase()}.`
            : 'Your answers are written out and ready. Send them on WhatsApp below and you will get a reply ' +
              site.contact.responseTime.toLowerCase() + '.'}
        </p>

        {state.hasFiles && (
          <p className="mx-auto mt-4 max-w-md rounded-xl border border-dashed px-4 py-3 text-[0.82rem] leading-relaxed text-muted">
            <Icon name="Info" className="mr-1.5 inline h-3.5 w-3.5 text-brand" />
            Your files are listed by name but not attached — please send them along with the WhatsApp message.
          </p>
        )}

        <div className="mx-auto mt-8 max-w-sm rounded-2xl border bg-surface/70 p-5 shadow-soft">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-faint">Your reference</p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="font-mono text-xl font-bold text-ink">{state.reference}</span>
            <button
              type="button"
              onClick={copy}
              aria-label="Copy reference number"
              className="rounded-lg border p-2 text-muted transition-colors hover:border-brand/40 hover:text-ink"
            >
              <Icon name={copied ? 'Check' : 'Copy'} className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 text-[0.75rem] text-faint">
            {copied ? 'Copied' : 'Quote this if you message about the project'}
          </p>
        </div>

        <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
          {nextSteps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="rounded-2xl border bg-surface/60 p-5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/12 text-brand">
                <Icon name={s.icon} className="h-4 w-4" />
              </span>
              <h2 className="mt-3.5 text-[0.9rem] font-bold text-ink">{s.title}</h2>
              <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted">{s.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            href={state.whatsappUrl || whatsappLink(site.contact.whatsapp, whatsappMessages.request(state.reference))}
            variant="whatsapp"
            size="lg"
            icon="MessageCircle"
          >
            {state.emailed ? 'Continue on WhatsApp' : 'Send on WhatsApp'}
          </Button>
          <Button href={`mailto:${site.contact.email}?subject=Project request ${state.reference}`} variant="secondary" size="lg" icon="Mail">
            Email instead
          </Button>
        </div>

        <div className="mt-8">
          <Link to="/" className="inline-flex items-center gap-2 text-[0.88rem] font-semibold text-muted transition-colors hover:text-ink">
            <Icon name="ArrowLeft" className="h-4 w-4" />
            Back to homepage
          </Link>
        </div>

        <p className="mt-10 text-[0.76rem] leading-relaxed text-faint">
          While the site runs on sample data, submissions are logged in your browser only. Connecting the Laravel
          backend enables database storage plus confirmation emails to you and a notification to the admin.
        </p>
      </div>
    </Section>
  );
}
