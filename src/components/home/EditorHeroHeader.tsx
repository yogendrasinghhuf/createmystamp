import { BRAND } from '../../config/brand'

export default function EditorHeroHeader() {
  return (
    <div className="bg-paper-fade border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-6 text-center">
        <span className="inline-block rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent shadow-card">
          Free · No login required
        </span>
        <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          {BRAND.tagline}
        </h1>
        <p className="mt-1 text-sm text-ink/60 md:text-base">{BRAND.supportingCopy}</p>
      </div>
    </div>
  )
}
