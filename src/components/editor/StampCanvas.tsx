// src/components/editor/StampCanvas.tsx
import { useProject, useSelectedIds, useStampStore } from '../../store/useStampStore'
import CanvasElementView from './CanvasElementView'

function StampOutline({ shape, width, height }: { shape: string; width: number; height: number }) {
  const stroke = '#2B2A28'
  const strokeWidth = 1.2
  if (shape === 'circle' || shape === 'badge') {
    return <circle r={Math.min(width, height) / 2} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
  }
  if (shape === 'oval') {
    return <ellipse rx={width / 2} ry={height / 2} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
  }
  const rx = shape === 'roundedRectangle' ? 10 : 0
  return (
    <rect
      x={-width / 2}
      y={-height / 2}
      width={width}
      height={height}
      rx={rx}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  )
}

export default function StampCanvas() {
  const project = useProject()
  const selectedIds = useSelectedIds()
  const select = useStampStore((s) => s.select)

  const padding = 10
  const viewWidth = project.dimensions.width + padding * 2
  const viewHeight = project.dimensions.height + padding * 2
  const sorted = [...project.elements].sort((a, b) => a.zIndex - b.zIndex)

  return (
    <svg
      id="stamp-canvas-svg"
      viewBox={`${-viewWidth / 2} ${-viewHeight / 2} ${viewWidth} ${viewHeight}`}
      width="100%"
      height="100%"
      onPointerDown={() => select([])}
    >
      <g transform="translate(0,0)">
        <StampOutline shape={project.shape} width={project.dimensions.width} height={project.dimensions.height} />
        {sorted.map((element) => (
          <CanvasElementView
            key={element.id}
            element={element}
            isSelected={selectedIds.includes(element.id)}
            onPointerDownSelect={(id, e) => {
              e.stopPropagation()
              select([id])
            }}
          />
        ))}
      </g>
    </svg>
  )
}
