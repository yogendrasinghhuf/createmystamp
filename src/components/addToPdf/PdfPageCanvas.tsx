// src/components/addToPdf/PdfPageCanvas.tsx
import { useEffect, useRef, useState } from 'react'
import { usePdfStampStore } from '../../store/usePdfStampStore'
import PlacedStampOverlay from './PlacedStampOverlay'

// 1 PDF point = 1/72 inch; a normal-DPI screen is ~96 CSS px/inch, so this is
// the CSS-px-per-point ratio for "true" 100% (matches real paper size).
const CSS_PX_PER_PT = 96 / 72

const MIN_ZOOM_PERCENT = 25
const MAX_ZOOM_PERCENT = 400
const ZOOM_STEP_PERCENT = 10

export default function PdfPageCanvas() {
  const pdfDoc = usePdfStampStore((s) => s.pdfDoc)
  const pageCount = usePdfStampStore((s) => s.pageCount)
  const currentPageIndex = usePdfStampStore((s) => s.currentPageIndex)
  const setCurrentPage = usePdfStampStore((s) => s.setCurrentPage)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRendering, setIsRendering] = useState(false)
  const [renderScale, setRenderScale] = useState(0)
  const [pageHeightPt, setPageHeightPt] = useState(0)
  const [zoomPercent, setZoomPercent] = useState(100)
  const [zoomInputValue, setZoomInputValue] = useState('100')

  useEffect(() => {
    setZoomInputValue(String(zoomPercent))
  }, [zoomPercent])

  function clampZoom(value: number): number {
    if (Number.isNaN(value)) return zoomPercent
    return Math.min(MAX_ZOOM_PERCENT, Math.max(MIN_ZOOM_PERCENT, value))
  }

  function commitZoomInput() {
    setZoomPercent(clampZoom(Number(zoomInputValue)))
  }

  useEffect(() => {
    if (!pdfDoc) return
    let cancelled = false

    async function render() {
      setIsRendering(true)
      const page = await pdfDoc!.getPage(currentPageIndex + 1)
      if (cancelled) return

      const unscaledViewport = page.getViewport({ scale: 1 })
      // CSS-px-per-point at the current zoom -- this is exactly the
      // renderScale used for placement math (see src/lib/pdfCoords.ts).
      const scale = CSS_PX_PER_PT * (zoomPercent / 100)
      const dpr = window.devicePixelRatio || 1
      const viewport = page.getViewport({ scale })

      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = Math.floor(viewport.width * dpr)
      canvas.height = Math.floor(viewport.height * dpr)
      canvas.style.width = `${viewport.width}px`
      canvas.style.height = `${viewport.height}px`

      const context = canvas.getContext('2d')
      if (!context) return
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      await page.render({ canvas, canvasContext: context, viewport }).promise
      if (!cancelled) {
        setIsRendering(false)
        setRenderScale(scale)
        setPageHeightPt(unscaledViewport.height)
      }
    }

    void render()
    return () => {
      cancelled = true
    }
  }, [pdfDoc, currentPageIndex, zoomPercent])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3 text-sm text-ink/70">
        <button
          type="button"
          onClick={() => setZoomPercent((z) => clampZoom(z - ZOOM_STEP_PERCENT))}
          disabled={zoomPercent <= MIN_ZOOM_PERCENT}
          className="rounded border border-line px-2 py-1 disabled:opacity-30"
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="flex items-center gap-1">
          <input
            type="number"
            value={zoomInputValue}
            onChange={(e) => setZoomInputValue(e.target.value)}
            onBlur={commitZoomInput}
            onKeyDown={(e) => e.key === 'Enter' && commitZoomInput()}
            min={MIN_ZOOM_PERCENT}
            max={MAX_ZOOM_PERCENT}
            className="w-14 rounded border border-line px-1 py-0.5 text-center"
          />
          %
        </span>
        <button
          type="button"
          onClick={() => setZoomPercent((z) => clampZoom(z + ZOOM_STEP_PERCENT))}
          disabled={zoomPercent >= MAX_ZOOM_PERCENT}
          className="rounded border border-line px-2 py-1 disabled:opacity-30"
          aria-label="Zoom in"
        >
          +
        </button>
        {zoomPercent !== 100 && (
          <button type="button" onClick={() => setZoomPercent(100)} className="rounded border border-line px-2 py-1">
            Reset
          </button>
        )}
      </div>
      <div className="w-full overflow-auto rounded border border-line bg-line/10">
        <div
          data-pdf-page-canvas="true"
          data-render-scale={renderScale || undefined}
          data-page-height-pt={pageHeightPt || undefined}
          data-page-index={currentPageIndex}
          className="relative mx-auto my-4 w-fit"
        >
          <canvas ref={canvasRef} className="block shadow-card" />
          {isRendering && (
            <div className="absolute inset-0 flex items-center justify-center bg-paper/60 text-sm text-ink/50">
              Rendering…
            </div>
          )}
          {renderScale > 0 && pageHeightPt > 0 && (
            <PlacedStampOverlay
              pageIndex={currentPageIndex}
              renderScale={renderScale}
              pageHeightPt={pageHeightPt}
            />
          )}
        </div>
      </div>
      {pageCount > 1 && (
        <div className="flex items-center gap-3 text-sm text-ink/70">
          <button
            type="button"
            onClick={() => setCurrentPage(currentPageIndex - 1)}
            disabled={currentPageIndex === 0}
            className="rounded border border-line px-2 py-1 disabled:opacity-30"
          >
            Prev
          </button>
          <span>
            Page {currentPageIndex + 1} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage(currentPageIndex + 1)}
            disabled={currentPageIndex === pageCount - 1}
            className="rounded border border-line px-2 py-1 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
