import { BRAND } from '../../config/brand'

export default function EditorHeroHeader() {
  return (
    <div className="bg-paper-fade border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-3 text-center">
        <h1 className="text-xl font-semibold leading-tight tracking-tight md:text-2xl">
          {BRAND.tagline}
        </h1>
        <p className="mt-1 text-xs text-ink/60 md:text-sm">{BRAND.supportingCopy}</p>
      </div>
    </div>
  )
}
