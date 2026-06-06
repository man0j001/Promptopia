/** @type {import('tailwindcss').Config} */
module.exports = {
  // Light-only app: make dark: variants opt-in (class) so the Hero's dark: classes
  // don't activate via the OS prefers-color-scheme.
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Single-grotesk system (Inter as the Labil Grotesk substitute)
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        satoshi: ['Inter', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Amplemarket palette
      colors: {
        // Theme tokens (CSS vars) — light/dark values swapped in styles/global.css
        ink: 'rgb(var(--ink) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
        graphite: 'rgb(var(--graphite) / <alpha-value>)',
        cream: 'rgb(var(--cream) / <alpha-value>)',
        pearl: 'rgb(var(--pearl) / <alpha-value>)',
        stone: 'rgb(var(--stone) / <alpha-value>)',
        'violet-deep': 'rgb(var(--violet-deep) / <alpha-value>)',
        // Fixed accents (same in both themes)
        obsidian: '#272625',
        'violet-shade': '#2e2460',
        ember: '#e8400d',
        blush: '#ffd7f0',
        mint: '#b7efb2',
        'pale-yellow': '#ffef99',
        lilac: '#e2ddfd',
        'primary-orange': '#FF5722',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Opacity-only — no transform, so it never overrides a centering -translate-x.
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out forwards',
        'fade-up': 'fade-up 1s ease-out forwards',
        fade: 'fade 1s ease-out forwards',
      },
    },
  },
  plugins: [],
}
