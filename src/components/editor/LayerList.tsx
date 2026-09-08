import { ArrowUp, ArrowDown, Trash2, Copy } from 'lucide-react'
import { useProject, useSelectedIds, useStampStore } from '../../store/useStampStore'
import IconButton from '../ui/IconButton'

function labelFor(element: { type: string }): string {
  switch (element.type) {
    case 'text':
      return 'Text'
    case 'curvedText':
      return 'Curved text'
    case 'shape':
      return 'Shape'
    case 'image':
      return 'Image'
    default:
      return 'Element'
  }
}

export default function LayerList() {
  const project = useProject()
  const selectedIds = useSelectedIds()
  const select = useStampStore((s) => s.select)
  const removeElement = useStampStore((s) => s.removeElement)
  const duplicateElement = useStampStore((s) => s.duplicateElement)
  const reorderElement = useStampStore((s) => s.reorderElement)

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
            <button className="text-left" onClick={() => select([element.id])}>
              {labelFor(element)}
            </button>
            <div className="flex gap-1">
              <IconButton icon={<ArrowUp size={14} />} label="Move layer up" onClick={() => reorderElement(element.id, 'up')} className="min-h-8 min-w-8" />
              <IconButton icon={<ArrowDown size={14} />} label="Move layer down" onClick={() => reorderElement(element.id, 'down')} className="min-h-8 min-w-8" />
              <IconButton icon={<Copy size={14} />} label="Duplicate layer" onClick={() => duplicateElement(element.id)} className="min-h-8 min-w-8" />
              <IconButton icon={<Trash2 size={14} />} label="Delete layer" onClick={() => removeElement(element.id)} className="min-h-8 min-w-8" />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
