import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import api from '@/services/api';
import { applySeo } from '@/utils/seo';
import { useSettings } from '@/context/SettingsContext';
import { whatsappLink, whatsappMessages } from '@/utils/whatsapp';
import PageHero from '@/components/ui/PageHero';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

import { emptyRequest, steps, validateStep, toPayload } from '@/components/wizard/wizardState';
import WizardProgress from '@/components/wizard/WizardProgress';
import Step1Contact from '@/components/wizard/Step1Contact';
import Step2Type from '@/components/wizard/Step2Type';
import Step3Business from '@/components/wizard/Step3Business';
import Step4Requirements from '@/components/wizard/Step4Requirements';
import Step5Design from '@/components/wizard/Step5Design';
import Step6Practical from '@/components/wizard/Step6Practical';
import Step7Review from '@/components/wizard/Step7Review';

// Maps a ?service= / ?webapp= / ?type= link into a preselected project type.
const serviceToType = {
  'website-development': 'business-website',
  'web-application-development': 'web-application',
  'google-sheets-web-apps': 'sheets-web-app',
  'business-automation': 'automation',
  'ecommerce-development': 'ecommerce',
  'admin-dashboard-development': 'dashboard',
  'custom-software-solutions': 'custom-software',
  'website-maintenance': 'maintenance',
};

export default function StartProject() {
  const navigate = useNavigate();
  const site = useSettings();
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [furthest, setFurthest] = useState(1);
  const [values, setValues] = useState(emptyRequest);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | error

  // Preselect from the link that brought the visitor here
  const preselected = useMemo(() => {
    const fromService = serviceToType[params.get('service')];
    const fromType = params.get('type');
    const fromWebApp = params.get('webapp') ? 'sheets-web-app' : null;
    return [fromService, fromType, fromWebApp].filter(Boolean);
  }, [params]);

  useEffect(() => {
    applySeo({
      title: 'Start your project',
      description: 'Send your project requirements: business details, features, design direction, budget and timeline. A written quotation follows within 24 hours.',
      path: '/start-project',
    });
  }, []);

  useEffect(() => {
    if (preselected.length === 0) return;
    setValues((v) => ({ ...v, projectTypes: [...new Set([...v.projectTypes, ...preselected])] }));
  }, [preselected]);

  const set = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  const toggle = (field, value) => {
    setValues((v) => {
      const list = v[field];
      return { ...v, [field]: list.includes(value) ? list.filter((i) => i !== value) : [...list, value] };
    });
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  const goTo = (target) => {
    setStep(target);
    setFurthest((f) => Math.max(f, target));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const next = () => {
    const found = validateStep(step, values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    goTo(Math.min(step + 1, steps.length));
  };

  const back = () => goTo(Math.max(step - 1, 1));

  const submit = async () => {
    const found = validateStep(7, values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus('submitting');
    try {
      const result = await api.submitProjectRequest(toPayload(values));
      navigate('/request-received', {
        state: {
          reference: result.reference,
          name: values.fullName,
          email: values.email,
          // How it was actually delivered, so the confirmation page can tell the
          // truth rather than assuming an email went out.
          emailed: result.emailed,
          whatsappUrl: result.whatsappUrl,
          hasFiles: result.hasFiles,
        },
        replace: true,
      });
    } catch {
      setStatus('error');
    }
  };

  const stepProps = { values, errors, set, toggle };

  const stepContent = {
    1: <Step1Contact {...stepProps} />,
    2: <Step2Type {...stepProps} />,
    3: <Step3Business {...stepProps} />,
    4: <Step4Requirements {...stepProps} />,
    5: <Step5Design {...stepProps} />,
    6: <Step6Practical {...stepProps} />,
    7: <Step7Review {...stepProps} onEdit={goTo} />,
  }[step];

  return (
    <>
      <PageHero
        eyebrow="Start your project"
        title="Tell me what you need built"
        description="Seven short steps. It takes a few minutes and covers everything needed to quote accurately — which means no back-and-forth just to understand the scope."
        breadcrumbs={[{ label: 'Start your project' }]}
      />

      <Section className="pt-12">
        <div className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-12">
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <WizardProgress steps={steps} current={step} furthest={furthest} onJump={goTo} />

            <div className="mt-8 hidden rounded-2xl border bg-surface/50 p-5 lg:block">
              <h2 className="text-[0.88rem] font-bold text-ink">Prefer to talk instead?</h2>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-muted">
                A form is not for everyone. Message me and we can go through it together.
              </p>
              <Button
                href={whatsappLink(site.contact.whatsapp, whatsappMessages.general)}
                variant="whatsapp"
                size="sm"
                full
                className="mt-4"
                icon="MessageCircle"
              >
                WhatsApp
              </Button>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="rounded-2xl border bg-surface/50 p-6 shadow-soft sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {stepContent}
                </motion.div>
              </AnimatePresence>

              {status === 'error' && (
                <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/[0.07] p-4 text-[0.85rem] text-red-500">
                  <Icon name="AlertCircle" className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    The request could not be submitted. Please try again — or send the same details on WhatsApp
                    and nothing is lost.
                  </p>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between gap-4 border-t pt-6">
                <Button
                  variant="ghost"
                  onClick={back}
                  disabled={step === 1}
                  icon="ArrowLeft"
                  className={step === 1 ? 'invisible' : ''}
                >
                  Back
                </Button>

                {step < steps.length ? (
                  <Button onClick={next} size="lg" iconRight="ArrowRight">Continue</Button>
                ) : (
                  <Button onClick={submit} size="lg" loading={status === 'submitting'} iconRight="Send">
                    {status === 'submitting' ? 'Submitting' : 'Submit project request'}
                  </Button>
                )}
              </div>
            </div>

            <p className="mt-5 flex items-start gap-2 text-[0.78rem] leading-relaxed text-faint">
              <Icon name="Lock" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Your answers are used only to prepare a quotation for this project. Nothing is shared with third
              parties or added to a mailing list.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
