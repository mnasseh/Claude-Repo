import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionLabel } from '../ui/SectionLabel';
import { testimonials } from '../../data/content';

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const len = testimonials.length;
  const go = (d) => setI((i + d + len) % len);

  return (
    <section className="relative bg-cream-100 py-24 text-cream-ink">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="relative inline-flex items-center gap-3 pl-5 font-mono text-[11px] uppercase tracking-[0.22em] text-cream-ink/65 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-px before:bg-cream-ink/40">
              Ils nous font confiance
            </div>
            <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">
              Les retours qui comptent.
            </h2>
          </div>

          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Témoignage précédent"
              className="rounded-full border border-cream-ink/15 p-3 transition hover:border-cream-ink/40 hover:bg-white cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Témoignage suivant"
              className="rounded-full border border-cream-ink/15 p-3 transition hover:border-cream-ink/40 hover:bg-white cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={t.author}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-cream-ink/10 bg-white p-8 md:p-12"
            >
              <Quote className="h-9 w-9 text-warm-accent" strokeWidth={1.5} aria-hidden />
              <blockquote className="mt-5 font-display text-3xl leading-snug text-cream-ink md:text-4xl">
                « {t.quote} »
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-warm-accent/20 font-display text-base font-semibold text-cream-ink">
                  {t.author
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="font-semibold text-cream-ink">{t.author}</div>
                  <div className="text-sm text-cream-ink/60">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {testimonials.map((_, k) => (
            <button
              type="button"
              key={k}
              onClick={() => setI(k)}
              aria-label={`Témoignage ${k + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                k === i ? 'w-8 bg-cream-ink' : 'w-1.5 bg-cream-ink/25 hover:bg-cream-ink/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
