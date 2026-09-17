import { useEffect, useRef } from 'react'

interface ColorSwatchProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export default function ColorSwatch({ label, value, onChange }: ColorSwatchProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // A color input that's never been focused before renders its native
    // picker popup with a hue-slider that doesn't respond to the first
    // interaction (only the 2D saturation/lightness box works) -- this
    // shows up right after adding a new element, whose properties panel
    // (and this input) mounts for the first time. Focusing and blurring it
    // once, right on mount, gives the browser the same "already seen this
    // input" state that an existing, previously-opened element already has,
    // so newly added elements behave the same as existing ones.
    const el = inputRef.current
    el?.focus({ preventScroll: true })
    el?.blur()
  }, [])

  return (
    <label className="flex items-center justify-between text-sm">
      <span className="text-ink/70">{label}</span>
      <span className="relative inline-block h-8 w-8 shrink-0">
        <span
          className="pointer-events-none absolute inset-0 rounded border border-line"
          style={{ backgroundColor: value }}
        />
        {/* Kept in normal layout (required for showPicker()/click() to work
            reliably) but visually clipped to nothing, so browser extensions
            that anchor an injected icon on the input's own box (e.g.
            eyedropper-style extensions) have no visible area to draw into.
            The swatch square above is what the user actually sees. */}
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer"
          style={{ clipPath: 'inset(50%)' }}
          aria-label={label}
        />
      </span>
    </label>
  )
}
