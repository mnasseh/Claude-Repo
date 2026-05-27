import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SectionLabel } from '../ui/SectionLabel';
import { process } from '../../data/content';

export function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 30%'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <SectionLabel>Méthodologie</SectionLabel>
          <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl">
            Quatre étapes. <span className="text-white/50">Zéro angle mort.</span>
          </h2>
          <p className="mt-5 text-white/60">
            Du premier audit à la validation finale, chaque jalon est documenté, traçable et
            contrôlé par l'IA — puis revu par un humain.
          </p>
        </div>

        <div ref={ref} className="relative pl-10 md:pl-20">
          {/* Vertical track */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/8 md:left-[31px]">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-cyan-glow via-cyan to-warm-accent shadow-glow"
            />
          </div>

          <ol className="space-y-12">
            {process.map((step, i) => (
              <motion.li
                key={step.n}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Marker */}
                <div className="absolute -left-10 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-cyan-glow/40 bg-ink-900 text-[11px] font-mono text-cyan-glow shadow-glow md:-left-[60px]">
                  {step.n}
                </div>
                <div className="grid gap-3 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <h3 className="font-display text-2xl font-medium text-white">{step.title}</h3>
                  </div>
                  <p className="text-pretty text-white/65 md:col-span-7 md:col-start-6">
                    {step.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
