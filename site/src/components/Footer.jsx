import { motion } from 'framer-motion';
import { Instagram, Linkedin } from 'lucide-react';
import { company, navItems } from '../data/content';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-ink-950 pt-20 pb-10">
      {/* Big easter-egg watermark */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-10 select-none text-center">
        <div className="bg-gradient-to-b from-white/[0.04] via-cyan-glow/[0.08] to-transparent bg-clip-text font-display text-[18vw] font-medium leading-none text-transparent">
          α · clean
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <img src="/images/logo.png" alt="" className="h-9 w-auto" />
              <span className="font-display text-lg font-semibold text-white">{company.name}</span>
            </div>
            <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-white/55">
              {company.tagline} Une technologie propriétaire — Alpha Clean Control V2.0 — au
              service d'équipes humaines.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={company.social.instagram}
                aria-label="Instagram"
                className="rounded-full border border-white/10 p-2.5 text-white/60 transition hover:border-cyan-glow/40 hover:text-cyan-glow"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={company.social.linkedin}
                aria-label="LinkedIn"
                className="rounded-full border border-white/10 p-2.5 text-white/60 transition hover:border-cyan-glow/40 hover:text-cyan-glow"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Navigation
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navItems.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="text-white/70 transition hover:text-cyan-glow"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Contact
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              <li>
                <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="hover:text-cyan-glow">
                  {company.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className="hover:text-cyan-glow">
                  {company.email}
                </a>
              </li>
              <li className="text-white/55">{company.address}</li>
            </ul>
            <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              alpha-control · synchronisé
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40"
        >
          <span>© {new Date().getFullYear()} Alpha Clean — Tous droits réservés</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-cyan-glow">Mentions légales</a>
            <a href="#" className="hover:text-cyan-glow">Politique des cookies</a>
            <a href="#" className="hover:text-cyan-glow">Confidentialité</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
