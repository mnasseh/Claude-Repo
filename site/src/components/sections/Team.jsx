import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { SectionLabel } from '../ui/SectionLabel';

const teamPhotos = [
  { src: '/images/team1.webp', tag: 'Sur le terrain · Bordeaux' },
  { src: '/images/team2.webp', tag: 'Contrôle qualité' },
];

export function Team() {
  return (
    <section
      id="team"
      className="relative overflow-hidden bg-cream-50 py-28 text-cream-ink"
    >
      {/* warm grid */}
      <div aria-hidden className="absolute inset-0 bg-grid-cream bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative inline-flex items-center gap-3 pl-5 font-mono text-[11px] uppercase tracking-[0.22em] text-cream-ink/70 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-px before:bg-cream-ink/40"
            >
              L'humain dans la boucle
            </motion.div>

            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.04] tracking-tight md:text-5xl">
              L'IA voit beaucoup.{' '}
              <span className="text-cream-ink/55">Nos équipes voient le reste.</span>
            </h2>

            <p className="mt-6 max-w-md text-pretty leading-relaxed text-cream-ink/75">
              Derrière chaque preuve de passage et chaque rapport, il y a des techniciens
              certifiés — formés à vos lieux, à vos contraintes et à vos collaborateurs. Une
              technologie qui sert l'humain, pas l'inverse.
            </p>

            <motion.figure
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-10 max-w-md"
            >
              <Quote className="h-8 w-8 text-warm-accent" strokeWidth={1.5} aria-hidden />
              <blockquote className="mt-3 font-display text-2xl leading-snug text-cream-ink md:text-3xl">
                « Le froid extrême au service de la productivité industrielle. »
              </blockquote>
              <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-cream-ink/55">
                Pôle Cryogénie — Alpha Clean
              </figcaption>
            </motion.figure>
          </div>

          <div className="grid gap-5 lg:col-span-7 lg:grid-cols-2">
            {teamPhotos.map((p, i) => (
              <motion.figure
                key={p.src}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative overflow-hidden rounded-3xl ${
                  i % 2 === 0 ? 'lg:mt-12' : ''
                }`}
              >
                <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-cream-200">
                  <img
                    src={p.src}
                    alt="Technicien Alpha Clean en intervention"
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cream-ink backdrop-blur">
                  {p.tag}
                </figcaption>
              </motion.figure>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="rounded-3xl border border-cream-ink/10 bg-white p-6 lg:col-span-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-ink/55">
                    Engagement employeur
                  </div>
                  <p className="mt-2 max-w-md text-pretty text-cream-ink/80">
                    Nous formons en interne — équipement, méthodes, certifications. Vous
                    rencontrerez les mêmes visages, mois après mois.
                  </p>
                </div>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-cream-ink px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-warm-accent hover:text-cream-ink cursor-pointer"
                >
                  Rejoindre l'équipe
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
