import { motion } from 'framer-motion';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { clientLogos, stats } from '../../data/content';

export function TrustBand() {
  return (
    <section className="relative border-y border-white/5 bg-ink-950 py-14">
      {/* Stats */}
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 gap-6 md:grid-cols-4"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-5"
            >
              <div className="text-3xl md:text-4xl text-white">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-white/55">{s.label}</div>
              <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-cyan-glow shadow-glow" />
            </motion.div>
          ))}
        </motion.div>

        {/* Logos marquee */}
        <div className="relative mt-12 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent" />
          <div className="flex w-[200%] animate-marquee gap-12">
            {[...clientLogos, ...clientLogos].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                loading="lazy"
                className="h-10 w-auto shrink-0 opacity-50 grayscale brightness-[2.2] contrast-75 transition hover:opacity-90 hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
