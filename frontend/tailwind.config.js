/** @type {import('tailwindcss').Config} */
const rgb = (v) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      // Minimal gutters. The page should reach close to the screen edge on every
      // size; individual text blocks hold their own max-width so lines never get
      // too long to read.
      padding: { DEFAULT: '0.75rem', sm: '1rem', lg: '1.15rem' },
      screens: { '2xl': '1600px' },
    },
    extend: {
      colors: {
        bg: rgb('--c-bg'),
        surface: rgb('--c-surface'),
        elevated: rgb('--c-elevated'),
        line: rgb('--c-line'),
        ink: rgb('--c-ink'),
        muted: rgb('--c-muted'),
        faint: rgb('--c-faint'),
        brand: { DEFAULT: rgb('--c-brand'), soft: rgb('--c-brand-soft') },
        accent: rgb('--c-accent'),
        // The six capability colours from the ANJUM identity. Fixed hexes rather
        // than theme tokens: they are brand constants and must read the same in
        // light and dark, the way the logo does.
        node: {
          dev: '#2F6FED',
          data: '#7C5CFC',
          apps: '#14B8A6',
          design: '#EC4899',
          analytics: '#F59E0B',
          dash: '#22C55E',
        },
      },
      fontFamily: {
        sans: ['Barlow', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Barlow Condensed"', 'Barlow', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Barlow Condensed is narrow, so it carries a larger size at the same
        // measure and wants looser tracking than the previous face.
        'display-xl': ['clamp(2.6rem, 5.6vw, 4.25rem)', { lineHeight: '1.02', letterSpacing: '-0.012em' }],
        'display-lg': ['clamp(2.1rem, 4.3vw, 3.25rem)', { lineHeight: '1.06', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.85rem, 3.4vw, 2.65rem)', { lineHeight: '1.12', letterSpacing: '-0.008em' }],
      },
      letterSpacing: { wordmark: '0.07em' },
      borderRadius: { xl: '0.9rem', '2xl': '1.25rem', '3xl': '1.75rem' },
      boxShadow: {
        soft: '0 1px 2px rgb(27 35 64 / 0.06), 0 8px 24px -12px rgb(27 35 64 / 0.22)',
        lift: '0 24px 60px -28px rgb(27 35 64 / 0.55)',
        glow: '0 0 0 1px rgb(var(--c-brand) / 0.28), 0 18px 50px -22px rgb(var(--c-brand) / 0.55)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        aurora: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(6%,-4%,0) scale(1.12)' },
          '66%': { transform: 'translate3d(-5%,5%,0) scale(0.94)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        'orbit-dash': { to: { strokeDashoffset: '-160' } },
        'orbit-spin': { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        aurora: 'aurora 22s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.24,0,0.38,1) infinite',
        'orbit-dash': 'orbit-dash 7s linear infinite',
        'orbit-spin': 'orbit-spin 60s linear infinite',
      },
    },
  },
  plugins: [],
};
