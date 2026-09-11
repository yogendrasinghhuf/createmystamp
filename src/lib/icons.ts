import { sanitizeSvgString } from './sanitizeSvg'

export interface StampIconOption {
  name: string
  label: string
  /** Inner SVG markup (path/circle/rect elements only, no outer <svg> wrapper). */
  innerMarkup: string
}

// Hand-written, static SVG path data for a small fixed set of lucide-react icons
// chosen for relevance to real stamp use cases (approval/compliance marks, dates,
// signatures, shipping, confidentiality) rather than generic decorative icons.
// Path data copied from node_modules/lucide-react/dist/esm/icons/*.mjs (v1.43.0, ISC license).
// Kept as static strings instead of rendering the lucide-react components at runtime so this
// module never needs react-dom/server (which previously pulled React's server renderer, and
// ~57KB gzip, into the client bundle just to stringify 10 fixed icons).
export const STAMP_ICONS: StampIconOption[] = [
  {
    name: 'stamp',
    label: 'Stamp',
    innerMarkup:
      '<path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13"/><path d="M20 15.5a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1z"/><path d="M5 22h14"/>',
  },
  {
    name: 'check-circle',
    label: 'Approved',
    innerMarkup: '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
  },
  {
    name: 'calendar',
    label: 'Date',
    innerMarkup:
      '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>',
  },
  {
    name: 'pen-line',
    label: 'Signature',
    innerMarkup:
      '<path d="M13 21h8"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
  },
  {
    name: 'shield-check',
    label: 'Verified',
    innerMarkup:
      '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  },
  {
    name: 'lock',
    label: 'Confidential',
    innerMarkup:
      '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  },
  {
    name: 'package',
    label: 'Package',
    innerMarkup:
      '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/>',
  },
  {
    name: 'file-check',
    label: 'Document',
    innerMarkup:
      '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="m9 15 2 2 4-4"/>',
  },
  {
    name: 'star',
    label: 'Quality',
    innerMarkup:
      '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  },
  {
    name: 'ban',
    label: 'Void',
    innerMarkup: '<circle cx="12" cy="12" r="10"/><path d="M4.929 4.929 19.07 19.071"/>',
  },
]

export function iconToSvgDataUrl(innerMarkup: string, color: string): string | null {
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${innerMarkup}</svg>`
  const cleaned = sanitizeSvgString(markup)
  if (!cleaned) return null
  return `data:image/svg+xml,${encodeURIComponent(cleaned)}`
}
