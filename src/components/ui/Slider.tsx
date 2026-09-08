interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}

export default function Slider({ label, value, min, max, step = 1, onChange }: SliderProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex justify-between text-ink/70">
        <span>{label}</span>
        <span>{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-accent"
      />
    </label>
  )
}
