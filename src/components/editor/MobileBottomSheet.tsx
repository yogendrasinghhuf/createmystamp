import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface MobileBottomSheetProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export default function MobileBottomSheet({ open, title, onClose, children }: MobileBottomSheetProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end md:hidden">
      <div className="flex-1 bg-ink/30" onClick={onClose} />
      <div className="max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-line bg-paper p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">{title}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-line/50"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
