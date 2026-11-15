/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        'surface-soft': 'var(--surface-soft)',
        ink: {
          DEFAULT: 'var(--ink)',
          2: 'var(--ink-2)',
          3: 'var(--ink-3)',
        },
        forest: {
          DEFAULT: 'var(--forest)',
          deep: 'var(--forest-deep)',
          soft: 'var(--forest-soft)',
        },
        earth: {
          DEFAULT: 'var(--earth)',
          soft: 'var(--earth-soft)',
        },
        line: {
          DEFAULT: 'var(--line)',
          strong: 'var(--line-strong)',
        },
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        sans: ['"Public Sans"', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.55' }],
        base: ['1rem', { lineHeight: '1.65' }],
        lg: ['1.25rem', { lineHeight: '1.5' }],
        xl: ['1.563rem', { lineHeight: '1.3' }],
        '2xl': ['1.953rem', { lineHeight: '1.2' }],
        '3xl': ['2.441rem', { lineHeight: '1.15' }],
        '4xl': ['3.052rem', { lineHeight: '1.1' }],
        '5xl': ['3.815rem', { lineHeight: '1.05' }],
        hero: ['clamp(2.441rem, 5.5vw, 3.815rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        display: '-0.02em',
      },
      maxWidth: {
        content: '1280px',
        prose: '68ch',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
        32: '8rem',
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '4px',
        lg: '4px',
        xl: '4px',
        '2xl': '4px',
      },
      boxShadow: {
        overlay: '0 1px 2px rgba(24,33,28,0.08), 0 8px 24px rgba(24,33,28,0.10)',
      },
      transitionDuration: {
        120: '120ms',
        200: '200ms',
        320: '320ms',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [],
}