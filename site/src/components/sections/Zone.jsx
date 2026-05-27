import { motion } from 'framer-motion';
import { MapPin, Radio } from 'lucide-react';
import { SectionLabel } from '../ui/SectionLabel';

// Approximate lat/long points around Nouvelle-Aquitaine, projected to a
// stylised dataviz grid (relative percentages, anchored on Bordeaux).
const nodes = [
  { x: 50, y: 50, label: 'Bordeaux', primary: true },
  { x: 32, y: 38, label: 'Arcachon' },
  { x: 65, y: 24, label: 'Libourne' },
  { x: 70, y: 60, label: 'Bergerac' },
  { x: 38, y: 72, label: 'Mont-de-Marsan' },
  { x: 18, y: 58, label: 'Cap-Ferret' },
  { x: 80, y: 78, label: 'Agen' },
  { x: 28, y: 18, label: 'La Rochelle' },
];

export function Zone() {
  return (
    <section className="relative overflow-hidden py-28">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel>Zone d'intervention</SectionLabel>
          <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl">
            Toute la{' '}
            <span className="bg-gradient-to-r from-cyan-glow to-warm-accent bg-clip-text text-transparent">
              Nouvelle-Aquitaine
            </span>
            , avec Bordeaux comme base avancée.
          </h2>
          <p className="mt-6 text-pretty text-white/65">
            39 rue Robert Caumont, 33000 Bordeaux. Nos équipes interviennent en zone urbaine,
            périurbaine et industrielle — du Bassin d'Arcachon au Lot-et-Garonne.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">
            {['Gironde', 'Landes', 'Dordogne', 'Lot-et-Garonne', 'Charente-Maritime'].map((t) => (
              <li
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="terminal-frame relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400/70" />
                <span className="h-2 w-2 rounded-full bg-amber-300/70" />
                <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
                <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  alpha-control / coverage-map
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-cyan-glow/80">
                <Radio className="h-3 w-3" />
                {nodes.length} pôles
              </span>
            </div>

            {/* Map canvas */}
            <div className="relative h-full w-full bg-ink-950">
              {/* Subtle scan */}
              <motion.div
                aria-hidden
                animate={{ y: ['-10%', '110%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-cyan-glow/8 to-transparent"
              />

              {/* Dotted grid */}
              <svg className="absolute inset-0 h-full w-full opacity-50" aria-hidden>
                <defs>
                  <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="rgba(94,242,255,0.18)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>

              {/* Connections from Bordeaux */}
              <svg className="absolute inset-0 h-full w-full" aria-hidden>
                {nodes
                  .filter((n) => !n.primary)
                  .map((n, i) => (
                    <motion.line
                      key={i}
                      x1="50%"
                      y1="50%"
                      x2={`${n.x}%`}
                      y2={`${n.y}%`}
                      stroke="rgba(94,242,255,0.35)"
                      strokeWidth="1"
                      strokeDasharray="3 5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 1.2 }}
                    />
                  ))}
              </svg>

              {/* Nodes */}
              {nodes.map((n, i) => (
                <motion.div
                  key={n.label}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.5 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <div className="relative">
                    {n.primary && (
                      <span className="absolute inset-[-14px] animate-ping rounded-full bg-cyan-glow/30" />
                    )}
                    <div
                      className={`relative flex h-3 w-3 items-center justify-center rounded-full ${
                        n.primary
                          ? 'bg-cyan-glow shadow-glow-strong'
                          : 'bg-cyan-glow/60 shadow-glow'
                      }`}
                    >
                      {n.primary && <MapPin className="absolute -top-7 h-5 w-5 text-cyan-glow" />}
                    </div>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
                      {n.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
