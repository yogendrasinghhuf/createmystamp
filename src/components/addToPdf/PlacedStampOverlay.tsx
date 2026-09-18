// src/components/addToPdf/PlacedStampOverlay.tsx
import { useEffect } from 'react'
import { usePdfStampStore, type PlacedStampInstance } from '../../store/usePdfStampStore'
import { pixelsToPoints, pointsToPixels } from '../../lib/pdfCoords'

function PlacedStamp({
  instance,
  renderScale,
  pageHeightPt,
  pageWidthPt,
  isSelected,
  onSelect,
}: {
  instance: PlacedStampInstance
  renderScale: number
  pageHeightPt: number
  pageWidthPt: number
  isSelected: boolean
  onSelect: () => void
}) {
  const updatePlacedInstance = usePdfStampStore((s) => s.updatePlacedInstance)
  const removePlacedInstance = usePdfStampStore((s) => s.removePlacedInstance)

  const px = pointsToPixels(
    { xPt: instance.xPt, yPt: instance.yPt, widthPt: instance.widthPt, heightPt: instance.heightPt },
    renderScale,
    pageHeightPt,
  )

  function handleMovePointerDown(e: React.PointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    onSelect()
    const startClientX = e.clientX
    const startClientY = e.clientY
    const startXPx = px.x
    const startYPx = px.y

    function handleMove(moveEvent: PointerEvent) {
      const dx = moveEvent.clientX - startClientX
      const dy = moveEvent.clientY - startClientY
      const { xPt, yPt } = pixelsToPoints(
        { x: startXPx + dx, y: startYPx + dy, width: px.width, height: px.height },
        renderScale,
        pageHeightPt,
      )
      const clampedXPt = Math.min(Math.max(xPt, 0), Math.max(0, pageWidthPt - instance.widthPt))
      const clampedYPt = Math.min(Math.max(yPt, 0), Math.max(0, pageHeightPt - instance.heightPt))
      updatePlacedInstance(instance.id, { xPt: clampedXPt, yPt: clampedYPt })
    }

    function handleUp() {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  type Corner = 'nw' | 'ne' | 'sw' | 'se'

  function handleResizePointerDown(corner: Corner) {
    return (e: React.PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const startClientX = e.clientX
      const startClientY = e.clientY
      const aspectRatio = px.width / px.height
      const isLeft = corner === 'nw' || corner === 'sw'
      const isTop = corner === 'nw' || corner === 'ne'
      // The corner diagonally opposite the one being dragged stays fixed in
      // screen space -- compute it once (in both pixel and point space) and
      // resize around it.
      const anchorXPx = isLeft ? px.x + px.width : px.x
      const anchorYPx = isTop ? px.y + px.height : px.y
      const anchorPt = pixelsToPoints({ x: anchorXPx, y: anchorYPx, width: 0, height: 0 }, renderScale, pageHeightPt)
      const startWidthPx = px.width

      // How far the dragged corner can move away from the anchor before
      // hitting the page edge, converted to a max width in pixels.
      const maxWidthByPageX = (isLeft ? anchorPt.xPt : pageWidthPt - anchorPt.xPt) * renderScale
      const maxHeightByPageY = (isTop ? anchorPt.yPt : pageHeightPt - anchorPt.yPt) * renderScale
      const maxWidthPx = Math.max(16, Math.min(maxWidthByPageX, maxHeightByPageY * aspectRatio))

      function handleMove(moveEvent: PointerEvent) {
        const dx = moveEvent.clientX - startClientX
        const dy = moveEvent.clientY - startClientY
        // Signed so dragging away from the anchor always grows the stamp,
        // regardless of which corner is being dragged.
        const signedDx = isLeft ? -dx : dx
        const signedDy = isTop ? -dy : dy
        // Use whichever axis moved more to drive the resize, deriving the
        // other from the fixed aspect ratio.
        const widthFromDx = startWidthPx + signedDx
        const widthFromDy = (startWidthPx / aspectRatio + signedDy) * aspectRatio
        const desiredWidthPx = Math.abs(signedDx) >= Math.abs(signedDy) ? widthFromDx : widthFromDy

        const newWidthPx = Math.min(maxWidthPx, Math.max(16, desiredWidthPx))
        const newHeightPx = newWidthPx / aspectRatio
        const finalXPx = isLeft ? anchorXPx - newWidthPx : anchorXPx
        const finalYPx = isTop ? anchorYPx - newHeightPx : anchorYPx

        const { xPt, yPt, widthPt, heightPt } = pixelsToPoints(
          { x: finalXPx, y: finalYPx, width: newWidthPx, height: newHeightPx },
          renderScale,
          pageHeightPt,
        )
        updatePlacedInstance(instance.id, { xPt, yPt, widthPt, heightPt })
      }

      function handleUp() {
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    }
  }

  return (
    <div
      className={`group absolute ${isSelected ? 'outline outline-2 outline-dashed outline-accent' : ''}`}
      style={{ left: px.x, top: px.y, width: px.width, height: px.height }}
    >
      <img
        src={instance.pngObjectUrl}
        alt="Placed stamp"
        draggable={false}
        onPointerDown={handleMovePointerDown}
        className="h-full w-full cursor-move select-none"
      />
      {isSelected && (
        <>
          <button
            type="button"
            onClick={() => removePlacedInstance(instance.id)}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs text-paper"
            aria-label="Remove this stamp"
          >
            ×
          </button>
          <div
            onPointerDown={handleResizePointerDown('nw')}
            className="absolute -left-1.5 -top-1.5 h-3 w-3 cursor-nwse-resize rounded-full border border-paper bg-accent"
          />
          <div
            onPointerDown={handleResizePointerDown('ne')}
            className="absolute -right-1.5 -top-1.5 h-3 w-3 cursor-nesw-resize rounded-full border border-paper bg-accent"
          />
          <div
            onPointerDown={handleResizePointerDown('sw')}
            className="absolute -bottom-1.5 -left-1.5 h-3 w-3 cursor-nesw-resize rounded-full border border-paper bg-accent"
          />
          <div
            onPointerDown={handleResizePointerDown('se')}
            className="absolute -bottom-1.5 -right-1.5 h-3 w-3 cursor-nwse-resize rounded-full border border-paper bg-accent"
          />
        </>
      )}
    </div>
  )
}

export default function PlacedStampOverlay({
  pageIndex,
  renderScale,
  pageHeightPt,
  pageWidthPt,
}: {
  pageIndex: number
  renderScale: number
  pageHeightPt: number
  pageWidthPt: number
}) {
  const placedInstances = usePdfStampStore((s) => s.placedInstances)
  const instancesOnPage = placedInstances.filter((i) => i.pageIndex === pageIndex)
  const selectedInstanceId = usePdfStampStore((s) => s.selectedInstanceId)
  const setSelectedInstance = usePdfStampStore((s) => s.setSelectedInstance)
  const removePlacedInstance = usePdfStampStore((s) => s.removePlacedInstance)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!selectedInstanceId) return
      if (e.key !== 'Delete' && e.key !== 'Backspace') return
      // Don't hijack Delete/Backspace while typing in an input (e.g. the
      // zoom percentage field).
      const target = e.target as HTMLElement | null
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return
      e.preventDefault()
      removePlacedInstance(selectedInstanceId)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedInstanceId, removePlacedInstance])

  return (
    <>
      {/* Clicking anywhere else on the page background deselects the current instance. */}
      <div className="absolute inset-0" onPointerDown={() => setSelectedInstance(null)} />
      {instancesOnPage.map((instance) => (
        <PlacedStamp
          key={instance.id}
          instance={instance}
          renderScale={renderScale}
          pageHeightPt={pageHeightPt}
          pageWidthPt={pageWidthPt}
          isSelected={instance.id === selectedInstanceId}
          onSelect={() => setSelectedInstance(instance.id)}
        />
      ))}
    </>
  )
}
