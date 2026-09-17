// src/components/addToPdf/PdfPageCanvas.tsx
import { useEffect, useRef, useState } from 'react'
import { usePdfStampStore } from '../../store/usePdfStampStore'
import PlacedStampOverlay from './PlacedStampOverlay'

export default function PdfPageCanvas() {
  const pdfDoc = usePdfStampStore((s) => s.pdfDoc)
  const pageCount = usePdfStampStore((s) => s.pageCount)
  const currentPageIndex = usePdfStampStore((s) => s.currentPageIndex)
  const setCurrentPage = usePdfStampStore((s) => s.setCurrentPage)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isRendering, setIsRendering] = useState(false)
  const [renderScale, setRenderScale] = useState(0)
  const [pageHeightPt, setPageHeightPt] = useState(0)

  useEffect(() => {
    if (!pdfDoc) return
    let cancelled = false

    async function render() {
      setIsRendering(true)
      const page = await pdfDoc!.getPage(currentPageIndex + 1)
      if (cancelled) return

      const containerWidth = containerRef.current?.clientWidth ?? 600
      const unscaledViewport = page.getViewport({ scale: 1 })
      // The unscaled viewport is already in PDF point space, so this ratio
      // (CSS px per point) is exactly the renderScale used for placement math.
      const fitScale = containerWidth / unscaledViewport.width
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
  }, [pdfDoc, currentPageIndex])

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={containerRef}
        data-pdf-page-canvas="true"
        data-render-scale={renderScale || undefined}
        data-page-height-pt={pageHeightPt || undefined}
        data-page-index={currentPageIndex}
        className="relative w-full max-w-2xl"
      >
        <canvas ref={canvasRef} className="w-full rounded border border-line shadow-card" />
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
