import { useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { applySeo } from '@/utils/seo';
import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import Icon from '@/components/ui/Icon';

const buildDocuments = (site) => ({
  privacy: {
    title: 'Privacy policy',
    updated: site.legal.privacyUpdated,
    intro:
      'This policy explains what information this website collects, why it is collected, and what happens to it. It is written to be read rather than to be legally impressive — but you should have a solicitor review it before you rely on it for your own business.',
    sections: [
      {
        heading: 'What is collected',
        body: 'Only what you submit yourself. The contact form collects your name, email address, phone number, subject and message. The project requirement form collects the details you enter about your business and the project, including any files you attach. Nothing is collected about you unless you type it in and submit it.',
      },
      {
        heading: 'Why it is collected',
        body: 'To respond to your enquiry, prepare a quotation, and deliver work you commission. Nothing more.',
      },
      {
        heading: 'Who it is shared with',
        body: 'Nobody. Your enquiry details are not sold, rented or passed to third parties for marketing. Where a third-party service is required to deliver a project you have commissioned — hosting, email delivery, payment processing — only the information necessary for that purpose is shared.',
      },
      {
        heading: 'How long it is kept',
        body: 'Enquiries that do not become projects are removed after a reasonable period. Records relating to completed projects are kept for as long as needed for support, warranty and accounting obligations.',
      },
      {
        heading: 'Analytics and cookies',
        body: 'This site uses no advertising or tracking cookies. Any analytics in use are configured to measure page traffic in aggregate, not to identify individuals. Your browser stores your light or dark theme preference locally — this never leaves your device.',
      },
      {
        heading: 'Your rights',
        body: `You can ask what information is held about you, ask for it to be corrected, or ask for it to be deleted. Email ${site.contact.email} and it will be handled promptly.`,
      },
      {
        heading: 'Security',
        body: 'Data submitted through this site is transmitted over an encrypted connection and stored with access restricted to those who need it. No system is perfectly secure, but information is not kept longer or more widely than necessary.',
      },
    ],
  },
  terms: {
    title: 'Terms & conditions',
    updated: site.legal.termsUpdated,
    intro:
      'These terms cover use of this website and the basis on which project work is carried out. Each project is also governed by its own written quotation and scope, which takes precedence where the two differ. Have a solicitor review these before relying on them commercially.',
    sections: [
      {
        heading: 'Scope of work',
        body: 'Every project begins with a written scope and a fixed quotation. Work included is what that document lists. Anything added afterwards is quoted separately before it is started — you will never receive an invoice for work you did not agree to.',
      },
      {
        heading: 'Payment',
        body: 'Payment terms are set out in the quotation, normally an advance to begin, a milestone payment, and the balance on completion. Work may be paused if an agreed payment is significantly overdue.',
      },
      {
        heading: 'Your responsibilities',
        body: 'Timely provision of content, feedback and approvals. Most delays on web projects come from waiting for material rather than development, and extended delays may affect the delivery timeline and the quoted price.',
      },
      {
        heading: 'Revisions',
        body: 'The quotation states how many revision rounds are included at the design stage. Additional rounds, or changes requested after a stage has been approved and built, are quoted separately.',
      },
      {
        heading: 'Ownership',
        body: 'On final payment, ownership of the source code, database and project files transfers to you. Third-party components remain under their own licences. I may reference the completed project in my portfolio unless you ask me not to.',
      },
      {
        heading: 'Support and warranty',
        body: 'Each project includes a support period after handover during which defects in delivered work are fixed at no charge. This covers faults, not new features or changes of requirement.',
      },
      {
        heading: 'Third-party services',
        body: 'Domains, hosting, payment gateways and other external services are registered in your name and billed by their providers. I am not responsible for their outages, price changes or policy decisions.',
      },
      {
        heading: 'Limitation of liability',
        body: 'Liability is limited to the value of the work carried out. Indirect or consequential losses — lost profit, lost data, business interruption — are not covered.',
      },
    ],
  },
});

export default function Legal({ kind = 'privacy' }) {
  const site = useSettings();
  const documents = buildDocuments(site);
  const doc = documents[kind] || documents.privacy;

  useEffect(() => {
    applySeo({ title: doc.title, description: doc.intro.slice(0, 155), path: `/${kind}` });
  }, [doc, kind]);

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={doc.title}
        description={doc.intro}
        breadcrumbs={[{ label: doc.title }]}
      >
        <p className="flex items-center gap-2 text-[0.83rem] text-muted">
          <Icon name="Calendar" className="h-4 w-4 text-brand" />
          Last updated: {doc.updated}
        </p>
      </PageHero>

      <Section className="pt-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] px-4 py-3 text-[0.82rem] leading-relaxed text-amber-700 dark:text-amber-300/90">
            <Icon name="Info" className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Template wording, provided as a starting point. Replace it with text reviewed for your jurisdiction
              and business before launch — it is editable from the admin panel.
            </p>
          </div>

          <div className="space-y-8">
            {doc.sections.map((section, i) => (
              <section key={section.heading}>
                <h2 className="flex items-baseline gap-3 text-[1.15rem] font-bold text-ink">
                  <span className="font-mono text-[0.8rem] text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {section.heading}
                </h2>
                <p className="mt-3 text-[0.95rem] leading-[1.75] text-muted">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border bg-surface/50 p-6">
            <h2 className="text-[1rem] font-bold text-ink">Questions about this document?</h2>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">
              Email <a href={`mailto:${site.contact.email}`} className="font-semibold text-brand hover:text-accent">{site.contact.email}</a> and you will get a straight answer.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
