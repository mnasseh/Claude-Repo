import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export function Button({ children, href = '#', variant = 'primary', className = '', ...rest }) {
  const base =
    'relative inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-medium text-sm tracking-wide transition-all duration-300 cursor-pointer';
  const styles = {
    primary:
      'bg-cyan-glow text-ink-900 hover:bg-white shadow-glow hover:shadow-glow-strong animate-pulse-glow',
    ghost:
      'border border-white/15 text-white/90 hover:border-cyan-glow/60 hover:text-white hover:bg-white/[0.03]',
    warm:
      'bg-cream-100 text-cream-ink hover:bg-cream-50',
  };
  const Comp = motion.a;
  return (
    <Comp
      href={href}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
      <ArrowUpRight className="w-4 h-4" strokeWidth={2.2} aria-hidden />
    </Comp>
  );
}
