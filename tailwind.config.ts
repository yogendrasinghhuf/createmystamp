import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FBF8F3',
        ink: '#221F1C',
        accent: {
          DEFAULT: '#C1571C',
          light: '#E2884C',
          dark: '#8F3F13',
        },
        line: '#E7E0D4',
      },
      fontFamily: {
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
        'paper-fade': 'radial-gradient(circle at 20% 0%, rgba(193,87,28,0.06), transparent 45%)',
      },
    },
  },
  plugins: [],
} satisfies Config
