import { BRAND } from '../../config/brand'

export default function EditorHeroHeader() {
  return (
    <div className="relative overflow-hidden border-b border-line bg-paper-fade bg-paper-grid bg-grid">
      {/* A faint stamp-ring motif, like an impression pressed just off the
          edge of the page -- purely decorative, sized to not crowd the
          compact hero text. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border-[10px] border-accent/10 md:-right-10 md:-top-24 md:h-64 md:w-64"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border-4 border-accent/10 md:-right-2 md:top-0 md:h-36 md:w-36"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-3 text-center">
        <h1 className="font-display text-xl font-semibold leading-tight tracking-tight text-ink md:text-2xl">
          {BRAND.tagline}
        </h1>
        <p className="mt-1 text-xs text-ink/60 md:text-sm">{BRAND.supportingCopy}</p>
      </div>
    </div>
  )
}
