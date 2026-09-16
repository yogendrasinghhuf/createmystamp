interface ColorSwatchProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export default function ColorSwatch({ label, value, onChange }: ColorSwatchProps) {
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
