import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Check } from 'lucide-react';
import { SectionLabel } from '../ui/SectionLabel';
import { Button } from '../ui/Button';
import { company, packs } from '../../data/content';

const services = ['Médical', 'Tertiaire', 'Camping', 'Loisirs et événementiel', 'Décapage cryogénique'];

function Field({ label, name, type = 'text', required, as = 'input', children }) {
  const [focus, setFocus] = useState(false);
  const [val, setVal] = useState('');
  const float = focus || val.length > 0;
  const Comp = as;
  return (
    <label className="relative block">
      <span
        className={`pointer-events-none absolute left-4 z-10 origin-left font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-200 ${
          float
            ? 'top-2 scale-90 text-cyan-glow/80'
            : 'top-1/2 -translate-y-1/2 text-white/50'
        }`}
      >
        {label} {required && <span className="text-warm-accent">*</span>}
      </span>
      <Comp
        name={name}
        type={type}
        required={required}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => setVal(e.target.value)}
        value={val}
        className={`w-full rounded-xl border bg-white/[0.02] px-4 pb-3 ${
          as === 'textarea' ? 'pt-7 min-h-32' : 'pt-7'
        } text-sm text-white outline-none transition-all duration-300 ${
          focus
            ? 'border-cyan-glow/60 shadow-[0_0_0_4px_rgba(94,242,255,0.08)]'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        {children}
      </Comp>
    </label>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="relative overflow-hidden py-28">
      <div aria-hidden className="absolute inset-0 -z-10 mesh-gradient opacity-50" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Packs strip */}
        <div className="mb-20">
          <SectionLabel>Nos packs intégrés</SectionLabel>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl">
            Un interlocuteur. <span className="text-white/50">Un standard.</span>
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {packs.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className={`card-tech relative rounded-2xl p-7 ${
                  p.featured ? 'md:-mt-4 md:mb-4 md:shadow-glow' : ''
                }`}
              >
                {p.featured && (
                  <span className="absolute right-5 top-5 rounded-full bg-warm-accent/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-warm-accent">
                    Recommandé
                  </span>
                )}
                <h3 className="font-display text-xl font-medium text-white">{p.name}</h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-glow/80">
                  {p.composition}
                </p>
                <ul className="mt-6 space-y-2 text-sm text-white/65">
                  {p.bullet.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-cyan-glow" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <SectionLabel>Démarrons</SectionLabel>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl">
              Prêt à passer{' '}
              <span className="bg-gradient-to-r from-cyan-glow to-warm-accent bg-clip-text text-transparent">
                au niveau supérieur ?
              </span>
            </h2>
            <p className="mt-6 text-white/65">
              Réponse en moins de 24 heures ouvrées. Audit gratuit et devis flash sur simple photo.
            </p>

            <div className="mt-10 space-y-4">
              <a
                href={`tel:${company.phone.replace(/\s/g, '')}`}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-cyan-glow/40"
              >
                <div className="rounded-xl border border-cyan-glow/20 bg-cyan-glow/[0.06] p-3 text-cyan-glow">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                    Téléphone
                  </div>
                  <div className="mt-0.5 font-display text-lg text-white">{company.phone}</div>
                </div>
              </a>

              <a
                href={`mailto:${company.email}`}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-cyan-glow/40"
              >
                <div className="rounded-xl border border-cyan-glow/20 bg-cyan-glow/[0.06] p-3 text-cyan-glow">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                    Email
                  </div>
                  <div className="mt-0.5 font-display text-lg text-white">{company.email}</div>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="rounded-xl border border-cyan-glow/20 bg-cyan-glow/[0.06] p-3 text-cyan-glow">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                    Adresse
                  </div>
                  <div className="mt-0.5 text-white">{company.address}</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            onSubmit={submit}
            className="card-tech rounded-3xl p-6 md:p-8 lg:col-span-7"
          >
            {!sent ? (
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Nom" name="name" required />
                <Field label="Entreprise" name="company" />
                <Field label="E-mail" name="email" type="email" required />
                <Field label="Téléphone" name="phone" type="tel" />

                <div className="md:col-span-2">
                  <Field label="Type de service" name="service" as="select" required>
                    <option value=""></option>
                    {services.map((s) => (
                      <option key={s} className="bg-ink-900">
                        {s}
                      </option>
                    ))}
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Message" name="message" as="textarea" required />
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-4 md:col-span-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                    SLA · Réponse sous 24h ouvrées
                  </p>
                  <Button as="button" href="#">
                    Envoyer la demande
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 py-16 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-glow/20 text-cyan-glow shadow-glow">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="font-display text-2xl font-medium text-white">
                  Demande transmise.
                </h3>
                <p className="max-w-md text-white/65">
                  Nous revenons vers vous dans les prochaines heures avec un audit personnalisé et
                  un devis flash.
                </p>
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
