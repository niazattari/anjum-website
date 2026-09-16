import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sourceProducts, licences } from '@/data/sourceCode';
import { useSettings } from '@/context/SettingsContext';
import { whatsappLink } from '@/utils/whatsapp';
import { applySeo } from '@/utils/seo';

import PageHero from '@/components/ui/PageHero';
import Section, { SectionHeading } from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';

const steps = [
  { icon: 'MessageCircle', title: 'Tell me which one', body: 'Message on WhatsApp or email with the system you want and the licence you need.' },
  { icon: 'Receipt', title: 'Invoice and payment', body: 'You get an invoice with the price and payment details. Bank transfer, or whatever suits you.' },
  { icon: 'PackageCheck', title: 'The package arrives', body: 'A download link to the full repository, the documentation, and the sample data — usually the same day.' },
  { icon: 'LifeBuoy', title: 'Getting it running', body: 'Thirty days of setup support. If it will not run on your machine, that is my problem to solve, not yours.' },
];

function ProductCard({ product }) {
  const site = useSettings();
  const enquiry = `Hello! I would like to buy the source code for: ${product.name}.`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-surface/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div
        className="relative aspect-[16/9] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${product.accent}22, ${product.accent}05)` }}
      >
        {product.cover ? (
          <img
            src={product.cover}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Icon name="Braces" className="h-12 w-12" style={{ color: product.accent }} strokeWidth={1.2} />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white backdrop-blur">
          Full source code
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1.08rem] font-bold leading-snug text-ink">{product.name}</h3>
        <p className="mt-1.5 text-[0.86rem] font-medium" style={{ color: product.accent }}>
          {product.tagline}
        </p>
        <p className="mt-3 text-[0.86rem] leading-relaxed text-muted">{product.summary}</p>

        <ul className="mt-4 space-y-1.5">
          {product.includes.map((line) => (
            <li key={line} className="flex gap-2 text-[0.82rem] leading-relaxed text-muted">
              <Icon name="Check" className="mt-[3px] h-3.5 w-3.5 shrink-0 text-emerald-500" />
              {line}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.stack.map((tech) => (
            <span key={tech} className="rounded-md bg-elevated px-2 py-1 text-[0.68rem] font-medium text-muted">
              {tech}
            </span>
          ))}
        </div>

        <p className="mt-4 flex items-center gap-2 text-[0.78rem] text-faint">
          <Icon name="Clock" className="h-3.5 w-3.5" />
          Setup: {product.setup}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
          <Button
            href={whatsappLink(site.contact.whatsapp, enquiry)}
            size="sm"
            iconRight="ArrowRight"
          >
            {product.price ? `Buy — ${product.currency} ${product.price}` : 'Ask for the price'}
          </Button>
          {product.projectSlug && (
            <Link
              to={`/portfolio/${product.projectSlug}`}
              className="text-[0.84rem] font-semibold text-muted transition-colors hover:text-ink"
            >
              Read the case study
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default function SourceCode() {
  useEffect(() => {
    applySeo({
      path: '/source-code',
      title: 'Buy source code',
      description:
        'Complete, working applications sold as a download — the full repository, documentation and sample data, with setup support.',
    });
  }, []);

  const featured = sourceProducts.filter((p) => p.featured);
  const rest = sourceProducts.filter((p) => !p.featured);

  return (
    <>
      <PageHero
        eyebrow="Source code"
        title="Buy the whole system, not a subscription"
        description="Every application below is one I built and run. You get the complete repository, the documentation that comes with it, and the sample data — to deploy, modify and keep."
      />

      <Section className="pt-4">
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {[...featured, ...rest].map((product, i) => (
            <Reveal key={product.id} delay={i * 0.05}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="How buying works"
          title="Four steps, no account to create"
          description="There is no card form on this site. Payment is handled on an invoice, which means you talk to a person and I know who I am supporting."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.05}>
              <div className="h-full rounded-2xl border bg-surface/60 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20">
                  <Icon name={step.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[1rem] font-bold text-ink">
                  <span className="mr-2 text-faint">{i + 1}.</span>
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            align="left"
            eyebrow="Licensing"
            title="What you are allowed to do with it"
            description="Two licences, both perpetual. Neither expires, and neither phones home."
          />
          <div className="space-y-4">
            {licences.map((licence) => (
              <div key={licence.id} className="rounded-2xl border bg-surface/60 p-6">
                <h3 className="text-[1rem] font-bold text-ink">{licence.name}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{licence.blurb}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-dashed p-6">
              <h3 className="flex items-center gap-2 text-[1rem] font-bold text-ink">
                <Icon name="ShieldCheck" className="h-4 w-4 text-brand" />
                What neither licence allows
              </h3>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">
                Reselling the code as a product of its own, or republishing it on a marketplace. Build with
                it, deploy it, charge for the work you do on top of it — just do not sell the package itself.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="pb-24 pt-0">
        <div className="rounded-3xl border bg-surface/60 p-8 text-center sm:p-12">
          <h2 className="text-display-md text-ink">Want something close to one of these, but not quite?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[1rem] leading-relaxed text-muted">
            Most of these started as custom work. If one of them is nearly what you need, adapting it is
            usually cheaper and faster than building from nothing — tell me the difference and I will quote it.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/start-project" size="lg" iconRight="ArrowRight">Start a project</Button>
            <Button to="/portfolio" variant="secondary" size="lg" icon="Eye">See the work first</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
