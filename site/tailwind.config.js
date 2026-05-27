/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#06060A',
          900: '#0A0A0F',
          800: '#101019',
          700: '#1A1A24',
          600: '#26263A',
          500: '#3A3A52',
        },
        cyan: {
          glow: '#5EF2FF',
          DEFAULT: '#22D3EE',
          deep: '#0891B2',
        },
        cream: {
          50: '#FBF7F0',
          100: '#F5EFE2',
          200: '#EBE1CC',
          300: '#D9C9A8',
          ink: '#2A2418',
        },
        warm: {
          accent: '#E8B27A',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Inter Tight"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(94,242,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(94,242,255,0.06) 1px, transparent 1px)',
        'grid-cream':
          'linear-gradient(rgba(42,36,24,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(42,36,24,0.05) 1px, transparent 1px)',
        radial:
          'radial-gradient(ellipse at top, rgba(34,211,238,0.18), transparent 60%)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(94,242,255,0.5)',
        'glow-strong': '0 0 80px -15px rgba(94,242,255,0.7)',
        'inner-glow': 'inset 0 0 24px rgba(94,242,255,0.12)',
        soft: '0 30px 60px -30px rgba(0,0,0,0.6)',
      },
      animation: {
        'scan-x': 'scan-x 6s linear infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        float: 'float 8s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        'scan-x': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(94,242,255,0.4), 0 0 40px -10px rgba(94,242,255,0.6)',
          },
          '50%': {
            boxShadow: '0 0 0 14px rgba(94,242,255,0), 0 0 60px -5px rgba(94,242,255,0.8)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
