import { Plus, Sliders, Download } from 'lucide-react'

interface MobileToolbarProps {
  onOpenAdd: () => void
  onOpenProperties: () => void
  onOpenExport: () => void
}

export default function MobileToolbar({ onOpenAdd, onOpenProperties, onOpenExport }: MobileToolbarProps) {
  return (
    <div className="flex items-center justify-around border-t border-line bg-paper py-2 md:hidden">
      <button
        onClick={onOpenAdd}
        className="flex min-h-11 min-w-11 flex-col items-center gap-1 rounded-xl2 px-3 py-1 text-xs text-ink"
      >
        <Plus size={20} />
        Add
      </button>
      <button
        onClick={onOpenProperties}
        className="flex min-h-11 min-w-11 flex-col items-center gap-1 rounded-xl2 px-3 py-1 text-xs text-ink"
      >
        <Sliders size={20} />
        Edit
      </button>
      <button
        onClick={onOpenExport}
        className="flex min-h-11 min-w-11 flex-col items-center gap-1 rounded-xl2 px-3 py-1 text-xs text-ink"
      >
        <Download size={20} />
        Export
      </button>
    </div>
  )
}
