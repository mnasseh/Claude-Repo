import { motion } from 'framer-motion';
import { Workflow, MapPin, Sparkles, Gauge } from 'lucide-react';
import { SectionLabel } from '../ui/SectionLabel';
import { techFeatures } from '../../data/content';

const iconMap = { Workflow, MapPin, Sparkles, Gauge };

export function TechSection() {
  return (
    <section id="tech" className="relative overflow-hidden py-28">
      {/* Background grid + glow */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-glow/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <SectionLabel>Technologie · Alpha Clean Control V2.0</SectionLabel>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl">
              Vous voyez tout.{' '}
              <span className="bg-gradient-to-r from-cyan-glow to-warm-accent bg-clip-text text-transparent">
                En temps réel.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-pretty text-white/65">
              Nous ne nous contentons pas de nettoyer. Nous documentons chaque seconde de notre
              intervention. Grâce à notre application propriétaire, vous suivez nos techniciens en
              temps réel avec une traçabilité totale.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-white/70">
              {[
                'Devis flash en 24h sur simple photo.',
                'Preuves de passage certifiées par géofencing.',
                'Validation IA des standards de propreté.',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-2 inline-block h-1 w-4 shrink-0 bg-cyan-glow shadow-glow" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            {/* Terminal-style phone mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="terminal-frame relative mx-auto mb-10 max-w-md rounded-3xl p-2"
            >
              <div className="flex items-center gap-1.5 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-red-400/70" />
                <span className="h-2 w-2 rounded-full bg-amber-300/70" />
                <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
                <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  alpha-control-v2.app
                </span>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-black">
                <img
                  src="/images/smartphone.png"
                  alt="Application Alpha Clean Control — tableau de bord temps réel"
                  className="w-full"
                  loading="lazy"
                />
              </div>
            </motion.div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {techFeatures.map((f, i) => {
                const Icon = iconMap[f.icon];
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                    className="card-tech rounded-2xl p-5"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-cyan-glow" strokeWidth={1.8} />
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-glow/80">
                        // {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-medium text-white">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
