// src/components/addToPdf/DragGhostOverlay.tsx
import { usePdfStampStore } from '../../store/usePdfStampStore'

const GHOST_SIZE_PX = 64

export default function DragGhostOverlay() {
  const dragGhost = usePdfStampStore((s) => s.dragGhost)
  if (!dragGhost) return null

  const width = GHOST_SIZE_PX
  const height = GHOST_SIZE_PX / dragGhost.aspectRatio

  return (
    <div
      className="pointer-events-none fixed z-50 rounded border-2 border-dashed border-accent bg-accent/10"
      style={{
        left: dragGhost.clientX - width / 2,
        top: dragGhost.clientY - height / 2,
        width,
        height,
      }}
    />
  )
}
