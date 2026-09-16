import { motion } from 'framer-motion';
import useParallax from '@/hooks/useParallax';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Badge from '@/components/ui/Badge';
import CapabilityHub, { CapabilityChips } from '@/components/home/CapabilityHub';
import { useSettings } from '@/context/SettingsContext';
import { whatsappLink, whatsappMessages } from '@/utils/whatsapp';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero({ stats }) {
  const site = useSettings();
  const orbA = useParallax(0.3);
  const orbB = useParallax(-0.22);

  return (
    <section className="relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-24">
      <div className="grid-backdrop absolute inset-0" aria-hidden="true" />
      <div ref={orbA} className="glow-orb left-[-8%] top-[-6%] h-[26rem] w-[26rem] bg-brand/20" aria-hidden="true" />
      <div ref={orbB} className="glow-orb right-[-6%] top-[18%] h-[22rem] w-[22rem] bg-accent/16" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-bg" aria-hidden="true" />

      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_1fr] lg:gap-10">
          <motion.div variants={container} initial="hidden" animate="show" className="min-w-0">
            <motion.div variants={item}>
              <Badge tone="brand" icon="Sparkles">Available for new projects</Badge>
            </motion.div>

            <motion.h1 variants={item} className="mt-6 text-display-xl uppercase text-ink">
              Full-stack development,{' '}
              <span className="gradient-text">engineered with AI</span>
            </motion.h1>

            <motion.p variants={item} className="mt-6 max-w-xl text-[1.06rem] leading-relaxed text-muted">
              Websites, custom web applications, dashboards and business automation. Every project starts
              with the problem your business actually has — and ends with a system you own outright,
              documented well enough that you are never locked in.
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button to="/start-project" size="lg" iconRight="ArrowRight">Start your project</Button>
              <Button to="/portfolio" variant="secondary" size="lg" icon="Eye">Explore my work</Button>
            </motion.div>

            <motion.div variants={item} className="mt-6">
              <a
                href={whatsappLink(site.contact.whatsapp, whatsappMessages.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-muted transition-colors hover:text-ink"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#25D366]">
                  <Icon name="MessageCircle" className="h-4 w-4" />
                </span>
                Prefer to talk first? Message me on WhatsApp
                <Icon name="ArrowRight" className="h-3.5 w-3.5" />
              </a>
            </motion.div>

            <motion.dl variants={item} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 border-t pt-7">
              {stats?.slice(0, 3).map((stat) => (
                <div key={stat.id}>
                  <dt className="text-[0.72rem] uppercase tracking-[0.14em] text-faint">{stat.label}</dt>
                  <dd className="wordmark mt-1 text-2xl text-ink">
                    {stat.value}<span className="gradient-text">{stat.suffix}</span>
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* The identity graphic, live: six capability nodes wired back to the
              mark. Each node is a link into the matching part of the site. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full min-w-0 max-w-[460px] text-ink"
          >
            <CapabilityHub />

            <div className="mt-8 text-center">
              <div className="wordmark text-4xl text-ink sm:text-5xl">ANJUM</div>
              <div className="wordmark-sub mt-2 text-[0.68rem] text-muted">
                Full-stack development, engineered with AI
              </div>
            </div>

            <CapabilityChips className="mt-7" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
