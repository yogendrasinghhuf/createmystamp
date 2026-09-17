// src/components/addToPdf/StampThumbnail.tsx
import { useRef } from 'react'
import { useProject } from '../../store/useStampStore'
import { usePdfStampStore } from '../../store/usePdfStampStore'
import { TEMPLATES, resolveTemplateElementColors } from '../../data/templates'
import CanvasElementView from '../editor/CanvasElementView'
import { rasterizeStampSvg } from '../../lib/pdfStampRaster'
import { pixelsToPoints } from '../../lib/pdfCoords'

function noop() {}

export default function StampThumbnail() {
  const studioProject = useProject()
  const stampSource = usePdfStampStore((s) => s.stampSource)
  const setStampSourceToStudio = usePdfStampStore((s) => s.setStampSourceToStudio)
  const setDragGhost = usePdfStampStore((s) => s.setDragGhost)
  const addPlacedInstance = usePdfStampStore((s) => s.addPlacedInstance)
  const svgRef = useRef<SVGSVGElement>(null)

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
  const aspectRatio = viewWidth / viewHeight

  function handlePointerDown(e: React.PointerEvent) {
    e.preventDefault()
    setDragGhost({ clientX: e.clientX, clientY: e.clientY, aspectRatio })

    function handleMove(moveEvent: PointerEvent) {
      setDragGhost({ clientX: moveEvent.clientX, clientY: moveEvent.clientY, aspectRatio })
    }

    async function handleUp(upEvent: PointerEvent) {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      setDragGhost(null)

      const dropTarget = document.elementFromPoint(upEvent.clientX, upEvent.clientY)
      const pageContainer = dropTarget?.closest('[data-pdf-page-canvas="true"]') as HTMLElement | null
      if (!pageContainer || !svgRef.current) return

      const containerRect = pageContainer.getBoundingClientRect()
      // elementFromPoint/closest can resolve to the page container even when
      // the pointer is right at its edge; only accept drops whose pointer
      // position is actually within its rendered bounds, so a stamp never
      // lands outside the visible PDF page.
      const isWithinBounds =
        upEvent.clientX >= containerRect.left &&
        upEvent.clientX <= containerRect.right &&
        upEvent.clientY >= containerRect.top &&
        upEvent.clientY <= containerRect.bottom
      if (!isWithinBounds) return

      const renderScale = Number(pageContainer.dataset.renderScale)
      const pageHeightPt = Number(pageContainer.dataset.pageHeightPt)
      const pageWidthPt = Number(pageContainer.dataset.pageWidthPt)
      if (!renderScale || !pageHeightPt || !pageWidthPt) return

      const { bytes, objectUrl } = await rasterizeStampSvg(svgRef.current, dimensions)

      // Default placed size: true physical size (mm -> pt), centered on the
      // drop point.
      const widthPt = dimensions.width * (72 / 25.4)
      const heightPt = dimensions.height * (72 / 25.4)
      const dropXPx = upEvent.clientX - containerRect.left
      const dropYPx = upEvent.clientY - containerRect.top

      const { xPt, yPt } = pixelsToPoints(
        {
          x: dropXPx - (widthPt * renderScale) / 2,
          y: dropYPx - (heightPt * renderScale) / 2,
          width: widthPt * renderScale,
          height: heightPt * renderScale,
        },
        renderScale,
        pageHeightPt,
      )

      // Keep the whole stamp within the page bounds even when dropped near
      // an edge/corner.
      const clampedXPt = Math.min(Math.max(xPt, 0), Math.max(0, pageWidthPt - widthPt))
      const clampedYPt = Math.min(Math.max(yPt, 0), Math.max(0, pageHeightPt - heightPt))

      addPlacedInstance({
        pageIndex: Number(pageContainer.dataset.pageIndex),
        xPt: clampedXPt,
        yPt: clampedYPt,
        widthPt,
        heightPt,
        pngBytes: bytes,
        pngObjectUrl: objectUrl,
      })
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl2 border border-line bg-paper p-3 shadow-sm">
      <p className="self-start text-xs font-semibold uppercase tracking-wide text-ink/50">Your stamp</p>
      <div
        onPointerDown={handlePointerDown}
        className="flex aspect-square w-full cursor-grab items-center justify-center rounded-lg bg-line/20 p-2 active:cursor-grabbing"
      >
        <svg
          ref={svgRef}
          viewBox={`${-viewWidth / 2} ${-viewHeight / 2} ${viewWidth} ${viewHeight}`}
          width="100%"
          height="100%"
        >
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
        Customize in Stamp Studio
      </a>
    </div>
  )
}
