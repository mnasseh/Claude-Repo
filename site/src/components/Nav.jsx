import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navItems, company } from '../data/content';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed left-4 right-4 top-4 z-50 rounded-2xl border transition-all duration-300 ${
        scrolled
          ? 'border-white/10 bg-ink-900/80 backdrop-blur-xl shadow-soft'
          : 'border-white/5 bg-ink-900/40 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-7">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Alpha Clean — accueil">
          <img src="/images/logo.png" alt="" className="h-8 w-auto" />
          <span className="hidden font-display text-sm font-semibold tracking-tight md:inline">
            {company.name}
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-sm font-medium text-white/70 transition hover:text-white"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyan-glow transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full bg-cyan-glow px-4 py-2 text-xs font-semibold text-ink-900 transition hover:bg-white md:inline-flex md:items-center md:gap-1"
          >
            Demander un devis
          </a>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-white/10 p-2 text-white md:hidden cursor-pointer"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/5 px-5 py-4 md:hidden"
        >
          <nav className="flex flex-col gap-3" aria-label="Menu mobile">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-base text-white/80 hover:bg-white/5"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-cyan-glow px-4 py-3 text-center text-sm font-semibold text-ink-900"
            >
              Demander un devis
            </a>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
