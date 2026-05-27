import { motion } from 'framer-motion';
import { Snowflake, Droplets, Wrench } from 'lucide-react';
import { SectionLabel } from '../ui/SectionLabel';
import { Button } from '../ui/Button';
import { cryoBenefits, cryoSectors } from '../../data/content';

const benefitIcons = [Droplets, Snowflake, Wrench];

export function Cryo() {
  return (
    <section id="cryo" className="relative overflow-hidden border-y border-white/5 bg-ink-950 py-28">
      {/* Cold blue radial */}
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-radial" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-end gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <SectionLabel>Décapage Cryogénique · -78°C</SectionLabel>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl">
              Zéro Eau. Zéro Chimie.{' '}
              <span className="bg-gradient-to-r from-cyan-glow to-white bg-clip-text text-transparent">
                Redémarrage immédiat.
              </span>
            </h2>
          </div>
          <p className="text-white/65">
            Élimination radicale des graisses, colles et résidus de production sur vos machines. Un
            procédé sec, sans produits chimiques et sans démontage — pour minimiser vos arrêts
            techniques.
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {cryoBenefits.map((b, i) => {
            const Icon = benefitIcons[i];
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="card-tech rounded-2xl p-6"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-glow/20 bg-cyan-glow/[0.06] text-cyan-glow">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-glow/80">
                  Bénéfice {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="mt-2 font-display text-xl font-medium text-white">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Sectors */}
        <div className="mt-16">
          <h3 className="mb-6 font-display text-xl font-medium text-white/80">Applications</h3>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-3">
            {cryoSectors.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative bg-ink-950 p-7 transition hover:bg-ink-900"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-glow/70">
                  Secteur {String(i + 1).padStart(2, '0')}
                </div>
                <h4 className="mt-3 font-display text-lg font-medium text-white">{s.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{s.desc}</p>
                <div className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-cyan-glow transition-transform duration-500 group-hover:scale-x-100" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing teasers */}
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card-tech relative rounded-2xl p-7"
          >
            <span className="absolute right-5 top-5 rounded-full bg-cyan-glow/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-glow">
              Le plus sollicité
            </span>
            <h4 className="font-display text-xl font-medium text-white">Intervention Industrielle</h4>
            <p className="mt-1 text-sm text-white/55">Idéal agroalimentaire & maintenance</p>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-4xl font-medium text-white">1350€</span>
              <span className="text-xs text-white/50">HT / jour</span>
            </div>
            <ul className="mt-5 space-y-2 text-sm text-white/65">
              {[
                'Technicien Expert Certifié',
                'Compresseur Autonome HP',
                '150 kg de Glace Carbonique',
                'Rapport Digital Alpha Control',
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-1 w-3 bg-cyan-glow" />
                  {t}
                </li>
              ))}
            </ul>
            <Button href="#contact" className="mt-6">
              Réserver un créneau
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-cream-200/20 bg-gradient-to-br from-cream-50 to-cream-100 p-7 text-cream-ink"
          >
            <h4 className="font-display text-xl font-medium">Rénovation Patrimoine</h4>
            <p className="mt-1 text-sm text-cream-ink/65">Pierre de Bordeaux & façades classées</p>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-4xl font-medium">40€</span>
              <span className="text-cream-ink/50">–</span>
              <span className="font-display text-4xl font-medium">70€</span>
              <span className="text-xs text-cream-ink/60">HT / heure</span>
            </div>
            <ul className="mt-5 space-y-2 text-sm text-cream-ink/75">
              {[
                'Expertise spécifique Pierre Blanche',
                'Respect total du calcin naturel',
                'Séchage instantané',
                'Zéro résidu chimique',
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-1 w-3 bg-cream-ink/50" />
                  {t}
                </li>
              ))}
            </ul>
            <Button href="#contact" variant="warm" className="mt-6">
              Audit sur place gratuit
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
