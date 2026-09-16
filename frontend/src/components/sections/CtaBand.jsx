import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useSettings } from '@/context/SettingsContext';
import { whatsappLink, whatsappMessages } from '@/utils/whatsapp';

export default function CtaBand({
  title = 'Have a project in mind?',
  description = 'Send your requirements through the project form and you will get a written scope, a fixed quotation and a realistic timeline.',
  primaryLabel = 'Start your project',
  primaryTo = '/start-project',
  whatsappMessage = whatsappMessages.general,
}) {
  const site = useSettings();
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-brand/12 via-surface to-accent/10 px-6 py-12 text-center shadow-soft sm:px-12 sm:py-16">
      <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="glow-orb left-1/2 top-0 h-56 w-56 -translate-x-1/2 bg-brand/25" aria-hidden="true" />

      <Reveal className="relative mx-auto max-w-2xl">
        <h2 className="text-display-md text-ink">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">{description}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to={primaryTo} size="lg" iconRight="ArrowRight">{primaryLabel}</Button>
          <Button
            href={whatsappLink(site.contact.whatsapp, whatsappMessage)}
            variant="secondary"
            size="lg"
            icon="MessageCircle"
          >
            Talk on WhatsApp
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
