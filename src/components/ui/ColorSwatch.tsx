interface ColorSwatchProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export default function ColorSwatch({ label, value, onChange }: ColorSwatchProps) {
  return (
    <label className="flex items-center justify-between text-sm">
      <span className="text-ink/70">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded border border-line"
      />
    </label>
  )
}
