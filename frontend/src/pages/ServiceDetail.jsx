import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';
import useAsync from '@/hooks/useAsync';
import { applySeo } from '@/utils/seo';
import { useSettings } from '@/context/SettingsContext';
import { whatsappLink, whatsappMessages } from '@/utils/whatsapp';
import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';
import { LoadingBlock, EmptyState } from '@/components/ui/States';
import ServiceCard from '@/components/cards/ServiceCard';
import CtaBand from '@/components/sections/CtaBand';

export default function ServiceDetail() {
  const { slug } = useParams();
  const site = useSettings();
  const { data, loading, error } = useAsync(async () => {
    const [service, services] = await Promise.all([api.getService(slug), api.getServices()]);
    return { service, services };
  }, [slug]);

  useEffect(() => {
    if (data?.service) {
      applySeo({
        title: data.service.title,
        description: data.service.short,
        path: `/services/${slug}`,
      });
    }
  }, [data, slug]);

  if (loading) return <LoadingBlock label="Loading service" />;

  if (error || !data?.service) {
    return (
      <Section className="pt-32">
        <EmptyState
          icon="CircleHelp"
          title="Service not found"
          description="That service does not exist, or its address has changed."
          action={<Button to="/services" icon="ArrowLeft">Back to all services</Button>}
        />
      </Section>
    );
  }

  const { service, services } = data;
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={service.tagline}
        title={service.title}
        description={service.description}
        breadcrumbs={[{ label: 'Services', to: '/services' }, { label: service.title }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button to={`/start-project?service=${service.slug}`} size="lg" iconRight="ArrowRight">
            Request this service
          </Button>
          <Button
            href={whatsappLink(site.contact.whatsapp, whatsappMessages.service(service.title))}
            variant="secondary"
            size="lg"
            icon="MessageCircle"
          >
            Ask a question
          </Button>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-display-md text-ink">What is included</h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {service.features.map((feature, i) => (
                <Reveal key={feature} delay={i * 0.03}>
                  <li className="flex items-start gap-3 rounded-xl border bg-surface/50 p-4">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
                      <Icon name="Check" className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                    <span className="text-[0.88rem] leading-relaxed text-muted">{feature}</span>
                  </li>
                </Reveal>
              ))}
            </ul>

            <h2 className="mt-14 text-display-md text-ink">Who it is for</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {service.idealFor.map((item) => (
                <span key={item} className="rounded-full border bg-surface px-4 py-2 text-[0.85rem] font-medium text-muted">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border bg-surface/70 p-6 shadow-soft">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand/15 to-accent/15 text-brand ring-1 ring-brand/20">
                <Icon name={service.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{service.title}</h3>

              <dl className="mt-5 space-y-4 border-t pt-5 text-[0.88rem]">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted">Typical timeline</dt>
                  <dd className="text-right font-semibold text-ink">{service.timeline}</dd>
                </div>
                <div>
                  <dt className="mb-2 text-muted">You receive</dt>
                  <dd>
                    <ul className="space-y-1.5">
                      {service.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-ink">
                          <Icon name="Check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.5} />
                          <span className="text-[0.85rem]">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted">Response time</dt>
                  <dd className="text-right font-semibold text-ink">{site.contact.responseTime}</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col gap-2.5">
                <Button to={`/start-project?service=${service.slug}`} full iconRight="ArrowRight">
                  Request this service
                </Button>
                <Button
                  href={whatsappLink(site.contact.whatsapp, whatsappMessages.service(service.title))}
                  variant="whatsapp"
                  full
                  icon="MessageCircle"
                >
                  WhatsApp
                </Button>
              </div>

              <p className="mt-4 text-center text-[0.75rem] text-faint">
                A fixed quotation follows before any work begins.
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="surface">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Badge tone="brand" className="mb-4">Related</Badge>
            <h2 className="text-display-md text-ink">Other services</h2>
          </div>
          <Link to="/services" className="hidden shrink-0 items-center gap-1.5 text-[0.88rem] font-semibold text-brand hover:text-accent sm:inline-flex">
            All services
            <Icon name="ArrowRight" className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((s) => <ServiceCard key={s.id} service={s} compact />)}
        </div>
      </Section>

      <Section className="pb-24 pt-0">
        <CtaBand
          title={`Ready to start your ${service.title.toLowerCase()} project?`}
          whatsappMessage={whatsappMessages.service(service.title)}
        />
      </Section>
    </>
  );
}
