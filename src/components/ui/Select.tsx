interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  compact?: boolean
}

export default function Select({ label, value, options, onChange, compact = false }: SelectProps) {
  if (compact) {
    return (
      <label className="flex items-center gap-1.5 text-xs text-ink/70">
        <span className="whitespace-nowrap">{label}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border border-line bg-paper px-1.5 py-1 text-xs"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    )
  }

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-ink/70">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-paper px-2 py-2"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
