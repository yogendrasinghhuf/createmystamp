// src/components/addToPdf/PdfPageCanvas.tsx
import { useEffect, useRef, useState } from 'react'
import { usePdfStampStore } from '../../store/usePdfStampStore'
import PlacedStampOverlay from './PlacedStampOverlay'

const MIN_ZOOM = 0.5
const MAX_ZOOM = 2.5
const ZOOM_STEP = 0.25

export default function PdfPageCanvas() {
  const pdfDoc = usePdfStampStore((s) => s.pdfDoc)
  const pageCount = usePdfStampStore((s) => s.pageCount)
  const currentPageIndex = usePdfStampStore((s) => s.currentPageIndex)
  const setCurrentPage = usePdfStampStore((s) => s.setCurrentPage)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fitWidthRef = useRef(0)
  const [isRendering, setIsRendering] = useState(false)
  const [renderScale, setRenderScale] = useState(0)
  const [pageHeightPt, setPageHeightPt] = useState(0)
  const [zoom, setZoom] = useState(1)

  // Reset zoom back to "fit width" whenever a different page is shown.
  useEffect(() => {
    setZoom(1)
  }, [currentPageIndex])

  useEffect(() => {
    if (!pdfDoc) return
    let cancelled = false

    async function render() {
      setIsRendering(true)
      const page = await pdfDoc!.getPage(currentPageIndex + 1)
      if (cancelled) return

      if (!fitWidthRef.current) {
        fitWidthRef.current = containerRef.current?.clientWidth ?? 600
      }
      const unscaledViewport = page.getViewport({ scale: 1 })
      // The unscaled viewport is already in PDF point space, so this ratio
      // (CSS px per point) is exactly the renderScale used for placement math.
      const fitScale = (fitWidthRef.current / unscaledViewport.width) * zoom
      const dpr = window.devicePixelRatio || 1
      const viewport = page.getViewport({ scale: fitScale })

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
        setRenderScale(fitScale)
        setPageHeightPt(unscaledViewport.height)
      }
    }

    void render()
    return () => {
      cancelled = true
    }
  }, [pdfDoc, currentPageIndex, zoom])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3 text-sm text-ink/70">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)))}
          disabled={zoom <= MIN_ZOOM}
          className="rounded border border-line px-2 py-1 disabled:opacity-30"
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="w-12 text-center">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)))}
          disabled={zoom >= MAX_ZOOM}
          className="rounded border border-line px-2 py-1 disabled:opacity-30"
          aria-label="Zoom in"
        >
          +
        </button>
        {zoom !== 1 && (
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="rounded border border-line px-2 py-1"
          >
            Reset
          </button>
        )}
      </div>
      <div
        ref={containerRef}
        className="max-h-[75vh] w-full max-w-2xl overflow-auto rounded border border-line bg-line/10"
      >
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
