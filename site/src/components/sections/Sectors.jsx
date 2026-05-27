import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Stethoscope,
  Tent,
  PartyPopper,
  Building2,
  CalendarCheck,
  Hammer,
  PanelTop,
  Factory,
  Layers,
  Sparkles as SparklesIcon,
} from 'lucide-react';
import { SectionLabel } from '../ui/SectionLabel';
import { sectors, services } from '../../data/content';

const sectorIcons = {
  medical: Stethoscope,
  camping: Tent,
  loisirs: PartyPopper,
  tertiaire: Building2,
};
const serviceIcons = {
  CalendarCheck,
  Hammer,
  PanelTop,
  Building2,
  Rug: Layers,
  Factory,
};

function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 120, damping: 12 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 120, damping: 12 });

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Sectors() {
  return (
    <section id="sectors" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Nos secteurs</SectionLabel>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl">
              Quatre univers,{' '}
              <span className="text-white/50">un seul standard de propreté.</span>
            </h2>
          </div>
          <p className="max-w-md text-white/60">
            Nos équipes sont spécialisées par secteur — les protocoles, les produits et la cadence
            d'intervention s'adaptent à votre métier, pas l'inverse.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {sectors.map((s, i) => {
            const Icon = sectorIcons[s.key] ?? Building2;
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard className="card-tech group relative h-full rounded-2xl p-6">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-glow/20 bg-cyan-glow/[0.06] text-cyan-glow">
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </div>
                  <h3 className="font-display text-xl font-medium text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{s.desc}</p>
                  <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-glow/80">
                    <span className="h-px w-6 bg-cyan-glow/60" />
                    Voir les protocoles
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed services row */}
        <div className="mt-16">
          <SectionLabel>Nos prestations</SectionLabel>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {services.map((sv, i) => {
              const Icon = serviceIcons[sv.icon] ?? SparklesIcon;
              return (
                <motion.div
                  key={sv.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-cyan-glow/30 hover:bg-white/[0.04]"
                >
                  <Icon className="h-5 w-5 shrink-0 text-cyan-glow/80" strokeWidth={1.6} />
                  <span className="text-xs leading-snug text-white/75 md:text-sm">{sv.title}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
