export const BRAND = {
  name: 'Create My Stamp',
  tagline: 'Make your mark.',
  supportingCopy:
    'Design a clean, professional stamp in your browser. Customize it and export or add it to your PDF when you\'re ready.',
  accent: '#C4571F',
  contactEmail: 'support@createmystamp.com',
  supportHours: 'Monday – Friday, 9 AM to 6 PM IST',
  // Per-download pricing. Product IDs match the server's src/products.js,
  // which is the actual source of truth for the amount charged.
  stampDownloadPrice: '₹199',
  stampedPdfDownloadPrice: '₹249',
} as const

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
