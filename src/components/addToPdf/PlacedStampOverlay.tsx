// src/components/addToPdf/PlacedStampOverlay.tsx
import { usePdfStampStore, type PlacedStampInstance } from '../../store/usePdfStampStore'
import { pixelsToPoints, pointsToPixels } from '../../lib/pdfCoords'

function PlacedStamp({
  instance,
  renderScale,
  pageHeightPt,
  isSelected,
  onSelect,
}: {
  instance: PlacedStampInstance
  renderScale: number
  pageHeightPt: number
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
      updatePlacedInstance(instance.id, { xPt, yPt })
    }

    function handleUp() {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  function handleResizePointerDown(e: React.PointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    const startClientX = e.clientX
    const startWidthPx = px.width
    const aspectRatio = px.width / px.height
    const startXPx = px.x
    const startYPx = px.y

    function handleMove(moveEvent: PointerEvent) {
      const dx = moveEvent.clientX - startClientX
      const newWidthPx = Math.max(16, startWidthPx + dx)
      const newHeightPx = newWidthPx / aspectRatio
      const { xPt, yPt, widthPt, heightPt } = pixelsToPoints(
        { x: startXPx, y: startYPx, width: newWidthPx, height: newHeightPx },
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
            onPointerDown={handleResizePointerDown}
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
}: {
  pageIndex: number
  renderScale: number
  pageHeightPt: number
}) {
  const placedInstances = usePdfStampStore((s) => s.placedInstances)
  const instancesOnPage = placedInstances.filter((i) => i.pageIndex === pageIndex)
  const selectedInstanceId = usePdfStampStore((s) => s.selectedInstanceId)
  const setSelectedInstance = usePdfStampStore((s) => s.setSelectedInstance)

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
          isSelected={instance.id === selectedInstanceId}
          onSelect={() => setSelectedInstance(instance.id)}
        />
      ))}
    </>
  )
}
