import { motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { MapPin, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { company } from '../../data/content';

const HeroScene = lazy(() =>
  import('../three/HeroScene').then((m) => ({ default: m.HeroScene }))
);

const title = ['Propreté', 'pilotée par', "l'IA & l'humain."];

const letterIn = {
  hidden: { y: '110%', opacity: 0 },
  show: (i) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.1 + i * 0.04, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden pt-32 pb-24 grain">
      {/* Mesh animated gradient */}
      <div aria-hidden className="absolute inset-0 -z-20 mesh-gradient" />

      {/* Grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-grid-faint bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      {/* Scan line */}
      <motion.div
        aria-hidden
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 1 }}
        className="scan-line top-[55%]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12">
        {/* Left: text */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-glow opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-glow" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">
              <MapPin className="mr-1 inline h-3 w-3" aria-hidden /> {company.zone}
            </span>
          </motion.div>

          <h1 className="font-display text-[clamp(2.6rem,7vw,5.4rem)] font-medium leading-[1.02] tracking-tightest">
            {title.map((line, li) => (
              <span key={li} className="block overflow-hidden">
                <motion.span
                  initial="hidden"
                  animate="show"
                  className="inline-block"
                >
                  {Array.from(line).map((ch, i) => (
                    <motion.span
                      key={`${li}-${i}`}
                      custom={li * 10 + i}
                      variants={letterIn}
                      className={`inline-block ${
                        li === 2 ? 'bg-gradient-to-r from-cyan-glow via-cyan to-warm-accent bg-clip-text text-transparent' : ''
                      }`}
                    >
                      {ch === ' ' ? ' ' : ch}
                    </motion.span>
                  ))}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-white/70 md:text-xl"
          >
            {company.mission} L'excellence opérationnelle, certifiée par une IA — et vérifiée par
            des humains qui connaissent vos lieux par cœur.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button href="#contact">Demander un devis flash</Button>
            <Button href="#tech" variant="ghost">
              Découvrir Alpha Control
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-10 flex items-center gap-3 text-xs text-white/50"
          >
            <ShieldCheck className="h-4 w-4 text-cyan-glow" aria-hidden />
            <span>Double contrôle IA + humain · Réponse en moins de 24h ouvrées</span>
          </motion.div>
        </div>

        {/* Right: 3D scene */}
        <div className="relative h-[420px] lg:col-span-5 lg:h-[560px]">
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </div>
          {/* Floating chips */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest text-white/60"
          >
            {['IA · vision', 'GPS · géofencing', 'photo · horodatage', 'SLA · 24h'].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-ink-900/50 px-2.5 py-1 backdrop-blur"
              >
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
