import { useRef } from 'react'

interface ColorSwatchProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export default function ColorSwatch({ label, value, onChange }: ColorSwatchProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <label className="flex items-center justify-between text-sm">
      <span className="text-ink/70">{label}</span>
      <button
        type="button"
        onClick={() => inputRef.current?.showPicker?.() ?? inputRef.current?.click()}
        className="h-8 w-8 shrink-0 rounded border border-line"
        style={{ backgroundColor: value }}
        aria-label={label}
      >
        {/* Kept off-screen (not just invisible) so browser extensions that
            scan the DOM for color inputs and inject their own icon next to
            them -- e.g. eyedropper-style extensions -- have no visible
            element to anchor that icon to. The button above is the only
            thing users ever see or click; it opens this input's native
            picker programmatically. */}
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1, opacity: 0 }}
          tabIndex={-1}
          aria-hidden="true"
        />
      </button>
    </label>
  )
}
