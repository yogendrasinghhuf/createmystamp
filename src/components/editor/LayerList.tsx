import { ArrowUp, ArrowDown, Trash2, Copy } from 'lucide-react'
import type { StampElement } from '../../types/stamp'
import { useProject, useSelectedIds, useStampStore } from '../../store/useStampStore'
import IconButton from '../ui/IconButton'

function labelFor(element: StampElement): string {
  switch (element.type) {
    case 'text':
      return element.text.trim() || 'Text'
    case 'curvedText':
      return element.text.trim() || 'Curved text'
    case 'shape':
      return `Shape (${element.shape})`
    case 'image':
      return 'Image'
    case 'qrCode':
      return 'QR code'
    default:
      return 'Element'
  }
}

const NUDGE_STEP = 0.5

export default function LayerList() {
  const project = useProject()
  const selectedIds = useSelectedIds()
  const select = useStampStore((s) => s.select)
  const removeElement = useStampStore((s) => s.removeElement)
  const duplicateElement = useStampStore((s) => s.duplicateElement)
  const updateElement = useStampStore((s) => s.updateElement)

  const sorted = [...project.elements].sort((a, b) => b.zIndex - a.zIndex)

  if (sorted.length === 0) {
    return <p className="text-sm text-ink/50">No layers yet. Add an element to get started.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((element) => {
        const isSelected = selectedIds.includes(element.id)
        return (
          <li
            key={element.id}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
              isSelected ? 'border-accent bg-accent/10' : 'border-line'
            }`}
          >
            <button className="truncate text-left" onClick={() => select([element.id])}>
              {labelFor(element)}
            </button>
            <div className="flex shrink-0 gap-1">
              <IconButton
                icon={<ArrowUp size={14} />}
                label="Move up"
                onClick={() => updateElement(element.id, { y: element.y - NUDGE_STEP })}
                className="min-h-8 min-w-8"
              />
              <IconButton
                icon={<ArrowDown size={14} />}
                label="Move down"
                onClick={() => updateElement(element.id, { y: element.y + NUDGE_STEP })}
                className="min-h-8 min-w-8"
              />
              <IconButton icon={<Copy size={14} />} label="Duplicate layer" onClick={() => duplicateElement(element.id)} className="min-h-8 min-w-8" />
              <IconButton icon={<Trash2 size={14} />} label="Delete layer" onClick={() => removeElement(element.id)} className="min-h-8 min-w-8" />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
