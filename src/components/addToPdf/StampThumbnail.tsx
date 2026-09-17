// src/components/addToPdf/StampThumbnail.tsx
import { useProject } from '../../store/useStampStore'
import { usePdfStampStore } from '../../store/usePdfStampStore'
import { TEMPLATES, resolveTemplateElementColors } from '../../data/templates'
import CanvasElementView from '../editor/CanvasElementView'

function noop() {}

export default function StampThumbnail() {
  const studioProject = useProject()
  const stampSource = usePdfStampStore((s) => s.stampSource)
  const setStampSourceToStudio = usePdfStampStore((s) => s.setStampSourceToStudio)

  const resolved =
    stampSource.kind === 'template'
      ? (() => {
          const template = TEMPLATES.find((t) => t.id === stampSource.templateId)
          return template ? resolveTemplateElementColors(template.project) : resolveTemplateElementColors(studioProject)
        })()
      : resolveTemplateElementColors(studioProject)

  const { dimensions, elements } = resolved
  const padding = 6
  const viewWidth = dimensions.width + padding * 2
  const viewHeight = dimensions.height + padding * 2

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl2 border border-line bg-paper p-3 shadow-sm">
      <p className="self-start text-xs font-semibold uppercase tracking-wide text-ink/50">Your stamp</p>
      <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-line/20 p-2">
        <svg viewBox={`${-viewWidth / 2} ${-viewHeight / 2} ${viewWidth} ${viewHeight}`} width="100%" height="100%">
          {elements.map((element) => (
            <CanvasElementView key={element.id} element={element} isSelected={false} onPointerDownSelect={noop} />
          ))}
        </svg>
      </div>
      <p className="text-center text-xs text-ink/50">Drag onto the PDF to place a copy</p>
      <a
        href="/#editor"
        onClick={setStampSourceToStudio}
        className="block w-full rounded border border-line px-3 py-1.5 text-center text-sm hover:bg-line/30"
      >
        Edit in Stamp Studio
      </a>
    </div>
  )
}
