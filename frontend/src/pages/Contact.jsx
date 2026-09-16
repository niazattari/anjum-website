import { useEffect, useState } from 'react';
import api from '@/services/api';
import { applySeo } from '@/utils/seo';
import { useSettings } from '@/context/SettingsContext';
import { whatsappLink, whatsappMessages } from '@/utils/whatsapp';
import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import { Input, Textarea } from '@/components/ui/Field';

const initial = { name: '', email: '', phone: '', subject: '', message: '' };

const validate = (values) => {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name';
  if (!values.email.trim()) errors.email = 'Please enter your email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) errors.email = 'That email address does not look right';
  if (!values.subject.trim()) errors.subject = 'Please add a subject';
  if (!values.message.trim()) errors.message = 'Please describe what you need';
  else if (values.message.trim().length < 20) errors.message = 'A little more detail helps — at least 20 characters';
  return errors;
};

export default function Contact() {
  const site = useSettings();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    applySeo({
      title: 'Contact',
      description: 'Get in touch by WhatsApp, email or the contact form. Replies usually within 24 hours.',
      path: '/contact',
    });
  }, []);

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus('sending');
    try {
      const result = await api.submitContactMessage(values);
      setReceipt(result);
      setStatus('sent');
      setValues(initial);
    } catch {
      setStatus('error');
    }
  };

  const channels = [
    {
      icon: 'MessageCircle', label: 'WhatsApp', value: site.contact.phone,
      href: whatsappLink(site.contact.whatsapp, whatsappMessages.general),
      note: 'Fastest reply', accent: 'text-[#25D366]',
    },
    { icon: 'Mail', label: 'Email', value: site.contact.email, href: `mailto:${site.contact.email}`, note: site.contact.responseTime, accent: 'text-brand' },
    ...site.social
      .filter((s) => s.enabled && ['facebook', 'linkedin', 'fiverr'].includes(s.id))
      .map((s) => ({ icon: s.icon, label: s.label, value: 'Message me there', href: s.url, note: '', accent: 'text-accent' })),
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's build something great"
        description="Tell me what you need. For anything with real scope, the project form collects more useful detail — but a message here works perfectly well to start."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <Section className="pt-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr]">
          {/* Channels */}
          <div>
            <div className="space-y-3">
              {channels.map((c, i) => (
                <Reveal key={c.label} delay={i * 0.05}>
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border bg-surface/60 p-4 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-soft"
                  >
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-elevated ${c.accent}`}>
                      <Icon name={c.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9rem] font-bold text-ink">{c.label}</span>
                      <span className="block truncate text-[0.82rem] text-muted">{c.value}</span>
                    </span>
                    {c.note && <span className="hidden shrink-0 text-[0.72rem] text-faint sm:block">{c.note}</span>}
                    <Icon name="ArrowUpRight" className="h-4 w-4 shrink-0 text-faint transition-colors group-hover:text-brand" />
                  </a>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2} className="mt-6 rounded-2xl border bg-surface/50 p-6">
              <h2 className="text-[0.95rem] font-bold text-ink">Before you write</h2>
              <ul className="mt-3.5 space-y-2.5">
                {[
                  'What your business does, in a sentence.',
                  'What you want the site or system to achieve.',
                  'Any deadline you are working towards.',
                  'A rough budget range, if you have one in mind.',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[0.86rem] leading-relaxed text-muted">
                    <Icon name="Check" className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.5} />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-5 border-t pt-5">
                <p className="text-[0.82rem] text-muted">
                  Have a full project in mind? The requirement form covers all of this properly.
                </p>
                <Button to="/start-project" size="sm" className="mt-3" iconRight="ArrowRight">
                  Start your project
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl border bg-surface/60 p-6 shadow-soft sm:p-8">
              {status === 'sent' ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
                    <Icon name="CheckCircle2" className="h-7 w-7" />
                  </span>
                  <h2 className="mt-5 text-xl font-bold text-ink">
                    {receipt?.emailed ? 'Message sent' : 'Almost there'}
                  </h2>
                  <p className="mt-2 max-w-sm text-[0.9rem] leading-relaxed text-muted">
                    {receipt?.emailed
                      ? `Thanks for getting in touch. You will get a reply ${site.contact.responseTime.toLowerCase()}.`
                      : 'One tap to finish: your message is written out and ready — send it on WhatsApp and it reaches me straight away.'}
                  </p>
                  {receipt?.reference && (
                    <p className="mt-3 font-mono text-[0.8rem] text-faint">Reference: {receipt.reference}</p>
                  )}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    {/* The link carries the whole message, so nothing is retyped
                        and nothing is lost if email delivery is not configured. */}
                    <Button
                      href={receipt?.whatsappUrl || whatsappLink(site.contact.whatsapp, whatsappMessages.general)}
                      variant="whatsapp"
                      icon="MessageCircle"
                    >
                      {receipt?.emailed ? 'Continue on WhatsApp' : 'Send on WhatsApp'}
                    </Button>
                    <Button variant="secondary" onClick={() => setStatus('idle')}>Send another</Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <h2 className="text-lg font-bold text-ink">Send a message</h2>
                  <p className="mt-1.5 text-[0.85rem] text-muted">
                    Fields marked <span className="text-brand">*</span> are required.
                  </p>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Input label="Full name" name="name" required value={values.name} onChange={set('name')} error={errors.name} placeholder="Your name" autoComplete="name" />
                    <Input label="Email" name="email" type="email" required value={values.email} onChange={set('email')} error={errors.email} placeholder="you@company.com" autoComplete="email" />
                    <Input label="Phone / WhatsApp" name="phone" value={values.phone} onChange={set('phone')} placeholder="+92 300 0000000" autoComplete="tel" hint="optional" />
                    <Input label="Subject" name="subject" required value={values.subject} onChange={set('subject')} error={errors.subject} placeholder="What is this about?" />
                    <Textarea label="Message" name="message" required rows={6} value={values.message} onChange={set('message')} error={errors.message} placeholder="Tell me about your business and what you need built…" className="sm:col-span-2" />
                  </div>

                  {status === 'error' && (
                    <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/[0.07] p-4 text-[0.85rem] text-red-500">
                      <Icon name="AlertCircle" className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        The message could not be sent. Please try again, or reach me on WhatsApp — that always works.
                      </p>
                    </div>
                  )}

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button type="submit" size="lg" loading={status === 'sending'} iconRight="Send">
                      {status === 'sending' ? 'Sending' : 'Send message'}
                    </Button>
                    <p className="text-[0.78rem] leading-relaxed text-faint">
                      Your details are used only to reply to this enquiry.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
