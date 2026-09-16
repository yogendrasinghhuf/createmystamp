interface ColorSwatchProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export default function ColorSwatch({ label, value, onChange }: ColorSwatchProps) {
  return (
    <label className="flex items-center justify-between text-sm">
      <span className="text-ink/70">{label}</span>
      <span
        className="relative inline-block h-8 w-8 shrink-0 overflow-hidden rounded border border-line"
        style={{ backgroundColor: value }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </span>
    </label>
  )
}
