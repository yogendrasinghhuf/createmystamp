// src/components/editor/SelectionOverlay.tsx
import type { StampElement } from '../../types/stamp'
import { buildCurvedTextArcPath } from '../../lib/curvedText'

interface SelectionOverlayProps {
  element: StampElement
  onResizeStart: (e: React.PointerEvent) => void
  onRotateStart: (e: React.PointerEvent) => void
}

function boundingSize(element: StampElement): { width: number; height: number } {
  if (element.type === 'text') {
    const approxWidth = element.text.length * element.fontSize * 0.6
    return { width: approxWidth, height: element.fontSize * 1.5 }
  }
  if (element.type === 'shape') return { width: element.width, height: element.height }
  if (element.type === 'qrCode') return { width: element.size, height: element.size }
  return { width: element.width, height: element.height }
}

export default function SelectionOverlay({ element, onResizeStart, onRotateStart }: SelectionOverlayProps) {
  // Curved text is bent along an arc some distance from (element.x, element.y),
  // so a rectangle centered on the origin would float near the stamp's center
  // instead of hugging the visible glyphs. Trace the same arc the text follows
  // instead, and anchor the resize/rotate handles to a point on that arc.
  if (element.type === 'curvedText') {
    const pathD = buildCurvedTextArcPath(element.radius, element.startAngle, element.direction)
    const scaledRadius = element.radius * element.scale
    // Handle anchor: a point partway along the arc's sweep, roughly where text starts.
    const handleAngleRad = ((element.startAngle - 90) * Math.PI) / 180
    const handleX = scaledRadius * Math.cos(handleAngleRad)
    const handleY = scaledRadius * Math.sin(handleAngleRad)

    return (
      <g data-selection-ui="true" transform={`translate(${element.x} ${element.y}) rotate(${element.rotation})`}>
        <path
          d={pathD}
          transform={`scale(${element.scale})`}
          fill="none"
          stroke="#C4571F"
          strokeDasharray="3 2"
          strokeWidth={0.8}
        />
        <circle
          cx={handleX}
          cy={handleY}
          r={2.2}
          fill="#C4571F"
          style={{ cursor: 'nwse-resize' }}
          onPointerDown={(e) => {
            e.stopPropagation()
            onResizeStart(e)
          }}
        />
        <circle
          cx={0}
          cy={0}
          r={2.2}
          fill="#2B2A28"
          style={{ cursor: 'grab' }}
          onPointerDown={(e) => {
            e.stopPropagation()
            onRotateStart(e)
          }}
        />
      </g>
    )
  }

  const { width, height } = boundingSize(element)
  const halfW = (width * element.scale) / 2
  const halfH = (height * element.scale) / 2

  return (
    <g data-selection-ui="true" transform={`translate(${element.x} ${element.y}) rotate(${element.rotation})`}>
      <rect
        x={-halfW}
        y={-halfH}
        width={halfW * 2}
        height={halfH * 2}
        fill="none"
        stroke="#C4571F"
        strokeDasharray="3 2"
        strokeWidth={0.6}
      />
      <circle
        cx={halfW}
        cy={halfH}
        r={2.2}
        fill="#C4571F"
        style={{ cursor: 'nwse-resize' }}
        onPointerDown={(e) => {
          e.stopPropagation()
          onResizeStart(e)
        }}
      />
      <line x1={0} y1={-halfH} x2={0} y2={-halfH - 6} stroke="#2B2A28" strokeWidth={0.5} />
      <circle
        cx={0}
        cy={-halfH - 6}
        r={2.2}
        fill="#2B2A28"
        style={{ cursor: 'grab' }}
        onPointerDown={(e) => {
          e.stopPropagation()
          onRotateStart(e)
        }}
      />
    </g>
  )
}
