// src/components/editor/CanvasElementView.tsx
import type { StampElement } from '../../types/stamp'
import { buildCurvedTextArcPath } from '../../lib/curvedText'

interface CanvasElementViewProps {
  element: StampElement
  isSelected: boolean
  onPointerDownSelect: (id: string, e: React.PointerEvent) => void
}

export default function CanvasElementView({
  element,
  isSelected,
  onPointerDownSelect,
}: CanvasElementViewProps) {
  const transform = `translate(${element.x} ${element.y}) rotate(${element.rotation}) scale(${element.scale})`

  if (element.type === 'text') {
    return (
      <g
        transform={transform}
        onPointerDown={(e) => onPointerDownSelect(element.id, e)}
        style={{ cursor: 'move' }}
      >
        <text
          fontFamily={element.fontFamily}
          fontSize={element.fontSize}
          fontWeight={element.fontWeight}
          letterSpacing={element.letterSpacing}
          textAnchor={element.align === 'left' ? 'start' : element.align === 'right' ? 'end' : 'middle'}
          fill={element.color}
        >
          {element.multiline
            ? element.text.split('\n').map((line, i) => (
                <tspan key={i} x={0} dy={i === 0 ? 0 : element.fontSize * 1.2}>
                  {line}
                </tspan>
              ))
            : element.text}
        </text>
        {isSelected && <SelectionMarker />}
      </g>
    )
  }

  if (element.type === 'curvedText') {
    const pathId = `curve-${element.id}`
    const pathD = buildCurvedTextArcPath(element.radius, element.startAngle, element.direction)
    return (
      <g
        transform={transform}
        onPointerDown={(e) => onPointerDownSelect(element.id, e)}
        style={{ cursor: 'move' }}
      >
        <defs>
          <path id={pathId} d={pathD} />
        </defs>
        <text
          fontFamily={element.fontFamily}
          fontSize={element.fontSize}
          fontWeight={element.fontWeight}
          letterSpacing={element.letterSpacing}
          fill={element.color}
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            {element.text}
          </textPath>
        </text>
        {isSelected && <SelectionMarker />}
      </g>
    )
  }

  if (element.type === 'shape') {
    return (
      <g
        transform={transform}
        onPointerDown={(e) => onPointerDownSelect(element.id, e)}
        style={{ cursor: 'move' }}
      >
        <ShapePrimitive element={element} />
        {isSelected && <SelectionMarker />}
      </g>
    )
  }

  // image
  return (
    <g
      transform={transform}
      onPointerDown={(e) => onPointerDownSelect(element.id, e)}
      style={{ cursor: 'move' }}
    >
      <image
        href={element.src}
        width={element.width}
        height={element.height}
        x={-element.width / 2}
        y={-element.height / 2}
      />
      {isSelected && <SelectionMarker />}
    </g>
  )
}

function ShapePrimitive({ element }: { element: Extract<StampElement, { type: 'shape' }> }) {
  const fill = element.filled ? element.fillColor : 'none'
  if (element.shape === 'circle') {
    return (
      <circle
        r={element.width / 2}
        fill={fill}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
      />
    )
  }
  if (element.shape === 'line') {
    return (
      <line
        x1={-element.width / 2}
        y1={0}
        x2={element.width / 2}
        y2={0}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
      />
    )
  }
  return (
    <rect
      x={-element.width / 2}
      y={-element.height / 2}
      width={element.width}
      height={element.height}
      rx={element.shape === 'roundedRectangle' ? element.cornerRadius ?? 8 : 0}
      fill={fill}
      stroke={element.strokeColor}
      strokeWidth={element.strokeWidth}
    />
  )
}

function SelectionMarker() {
  return <circle r={2} fill="#C4571F" />
}
