import { STAMP_ICONS } from '../../lib/icons'

interface IconPickerPopoverProps {
  open: boolean
  onClose: () => void
  onSelect: (iconName: string) => void
}

export default function IconPickerPopover({ open, onClose, onSelect }: IconPickerPopoverProps) {
  if (!open) return null

  return (
    <div className="absolute left-full top-0 z-20 ml-2 grid w-48 grid-cols-4 gap-2 rounded-xl2 border border-line bg-paper p-3 shadow-lg">
      {STAMP_ICONS.map(({ name, label, Icon }) => (
        <button
          key={name}
          type="button"
          aria-label={label}
          title={label}
          onClick={() => {
            onSelect(name)
            onClose()
          }}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line text-ink transition-colors hover:border-accent hover:text-accent"
        >
          <Icon size={18} />
        </button>
      ))}
    </div>
  )
}
