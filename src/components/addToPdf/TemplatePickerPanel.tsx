// src/components/addToPdf/TemplatePickerPanel.tsx
import { useState } from 'react'
import { TEMPLATES, resolveTemplateElementColors, type StampTemplate } from '../../data/templates'
import { usePdfStampStore } from '../../store/usePdfStampStore'
import CanvasElementView from '../editor/CanvasElementView'

function noop() {}

function TemplateListItem({ template, onUse }: { template: StampTemplate; onUse: (t: StampTemplate) => void }) {
  const { dimensions, elements } = resolveTemplateElementColors(template.project)
  const padding = 6
  const viewWidth = dimensions.width + padding * 2
  const viewHeight = dimensions.height + padding * 2

  return (
    <button
      type="button"
      onClick={() => onUse(template)}
      className="flex items-center gap-2 rounded border border-line p-2 text-left hover:bg-line/20"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-line/20">
        <svg viewBox={`${-viewWidth / 2} ${-viewHeight / 2} ${viewWidth} ${viewHeight}`} width="90%" height="90%">
          {elements.map((element) => (
            <CanvasElementView key={element.id} element={element} isSelected={false} onPointerDownSelect={noop} />
          ))}
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-ink">{template.name}</span>
        <span className="block truncate text-xs text-ink/50">{template.category}</span>
      </span>
    </button>
  )
}

export default function TemplatePickerPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const setStampSourceToTemplate = usePdfStampStore((s) => s.setStampSourceToTemplate)

  function handleUse(template: StampTemplate) {
    setStampSourceToTemplate(template.id)
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full rounded border border-line px-3 py-1.5 text-sm hover:bg-line/30"
      >
        {isOpen ? 'Hide templates' : 'Use a template instead'}
      </button>
      {isOpen && (
        <div className="flex max-h-96 flex-col gap-2 overflow-y-auto rounded-lg border border-line p-2">
          {TEMPLATES.map((template) => (
            <TemplateListItem key={template.id} template={template} onUse={handleUse} />
          ))}
        </div>
      )}
    </div>
  )
}
