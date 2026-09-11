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

function trianglePoints(width: number, height: number): string {
  const halfW = width / 2
  const halfH = height / 2
  return `0,${-halfH} ${halfW},${halfH} ${-halfW},${halfH}`
}

function starPoints(width: number, height: number): string {
  const outerRx = width / 2
  const outerRy = height / 2
  const innerRx = outerRx * 0.4
  const innerRy = outerRy * 0.4
  const points: string[] = []
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2
    const rx = i % 2 === 0 ? outerRx : innerRx
    const ry = i % 2 === 0 ? outerRy : innerRy
    points.push(`${rx * Math.cos(angle)},${ry * Math.sin(angle)}`)
  }
  return points.join(' ')
}

function octagonPoints(width: number, height: number): string {
  const halfW = width / 2
  const halfH = height / 2
  const cutW = halfW * 0.4142 // tan(22.5deg), gives a regular-looking octagon
  const cutH = halfH * 0.4142
  return [
    `${-halfW + cutW},${-halfH}`,
    `${halfW - cutW},${-halfH}`,
    `${halfW},${-halfH + cutH}`,
    `${halfW},${halfH - cutH}`,
    `${halfW - cutW},${halfH}`,
    `${-halfW + cutW},${halfH}`,
    `${-halfW},${halfH - cutH}`,
    `${-halfW},${-halfH + cutH}`,
  ].join(' ')
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
  if (element.shape === 'x') {
    const halfW = element.width / 2
    const halfH = element.height / 2
    return (
      <g stroke={element.strokeColor} strokeWidth={element.strokeWidth} strokeLinecap="round">
        <line x1={-halfW} y1={-halfH} x2={halfW} y2={halfH} />
        <line x1={halfW} y1={-halfH} x2={-halfW} y2={halfH} />
      </g>
    )
  }
  if (element.shape === 'triangle') {
    return (
      <polygon
        points={trianglePoints(element.width, element.height)}
        fill={fill}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        strokeLinejoin="round"
      />
    )
  }
  if (element.shape === 'star') {
    return (
      <polygon
        points={starPoints(element.width, element.height)}
        fill={fill}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        strokeLinejoin="round"
      />
    )
  }
  if (element.shape === 'octagon') {
    return (
      <polygon
        points={octagonPoints(element.width, element.height)}
        fill={fill}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        strokeLinejoin="round"
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
