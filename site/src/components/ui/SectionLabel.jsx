import { motion } from 'framer-motion';

export function SectionLabel({ children, tone = 'cyan' }) {
  const toneClass =
    tone === 'cream'
      ? 'text-cream-ink/70 before:bg-cream-ink/40'
      : 'text-cyan-glow/90 before:bg-cyan-glow';
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      className={`relative inline-flex items-center gap-3 pl-5 font-mono text-[11px] uppercase tracking-[0.22em] ${toneClass}
        before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-px`}
    >
      {children}
    </motion.div>
  );
}
