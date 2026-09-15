interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}

function roundToStep(value: number, step: number): number {
  const rounded = Math.round(value / step) * step
  return Math.round(rounded * 1000) / 1000
}

export default function Slider({ label, value, min, max, step = 1, onChange }: SliderProps) {
  const displayValue = roundToStep(value, step)

  function nudge(direction: 1 | -1) {
    const next = Math.min(max, Math.max(min, roundToStep(value, step) + direction * step))
    onChange(next)
  }

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex items-center justify-between text-ink/70">
        <span>{label}</span>
        <span className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label={`Decrease ${label}`}
            className="flex h-5 w-5 items-center justify-center rounded border border-line text-xs leading-none hover:border-accent hover:text-accent"
          >
            &lt;
          </button>
          <span className="min-w-[2.5em] text-center tabular-nums">{displayValue}</span>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label={`Increase ${label}`}
            className="flex h-5 w-5 items-center justify-center rounded border border-line text-xs leading-none hover:border-accent hover:text-accent"
          >
            &gt;
          </button>
        </span>
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
