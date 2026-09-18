import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FFFFFF',
        ink: '#221F1C',
        // Sealing-wax red: the color of a real stamp pad, not a decorative
        // terracotta -- this is the site's one bold accent.
        accent: {
          DEFAULT: '#B0361E',
          light: '#D6613F',
          dark: '#7A2313',
        },
        // A secondary ink color (many templates and stamp pads run blue),
        // used sparingly to mark the "Add to PDF" workflow apart from the
        // Studio/red workflow.
        stamp: {
          blue: '#1F4E8B',
          'blue-dark': '#163A66',
        },
        line: '#E7E0D4',
      },
      fontFamily: {
        // A slab/display serif for headings -- gives the marketing pages a
        // letterhead/officialdom character that a plain sans can't.
        display: ['"Fraunces"', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['Consolas', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(34, 31, 28, 0.04), 0 8px 24px -8px rgba(34, 31, 28, 0.10)',
        card: '0 1px 2px rgba(34, 31, 28, 0.05), 0 4px 16px -6px rgba(34, 31, 28, 0.08)',
      },
      backgroundImage: {
        'paper-fade': 'radial-gradient(circle at 20% 0%, rgba(176,54,30,0.07), transparent 45%)',
        // A faint dot-grid, evoking the millimetre ruler in Stamp Studio,
        // used as subtle section texture instead of a flat gradient wash.
        'paper-grid':
          'radial-gradient(circle, rgba(34,31,28,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '18px 18px',
      },
    },
  },
  plugins: [],
} satisfies Config
