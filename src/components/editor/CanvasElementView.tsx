// src/components/editor/CanvasElementView.tsx
import type { StampElement } from '../../types/stamp'
import { buildCurvedTextArcPath } from '../../lib/curvedText'
import { buildQrMatrix } from '../../lib/qrcode'

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
          textAnchor="middle"
        >
          <textPath href={`#${pathId}`} startOffset="50%">
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

  if (element.type === 'image') {
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

  // qrCode
  const matrix = buildQrMatrix(element.content, element.contentType)
  const moduleCount = matrix.length
  const cellSize = moduleCount > 0 ? element.size / moduleCount : 0
  return (
    <g
      transform={transform}
      onPointerDown={(e) => onPointerDownSelect(element.id, e)}
      style={{ cursor: 'move' }}
    >
      {moduleCount > 0 ? (
        <g transform={`translate(${-element.size / 2} ${-element.size / 2})`}>
          {matrix.map((row, rowIndex) =>
            row.map((isDark, colIndex) =>
              isDark ? (
                <rect
                  key={`${rowIndex}-${colIndex}`}
                  x={colIndex * cellSize}
                  y={rowIndex * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={element.color}
                />
              ) : null,
            ),
          )}
        </g>
      ) : (
        <rect
          x={-element.size / 2}
          y={-element.size / 2}
          width={element.size}
          height={element.size}
          fill="none"
          stroke={element.color}
          strokeWidth={0.5}
          strokeDasharray="2 1"
        />
      )}
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
  // SVG strokes are centered on the path by default, so they grow both
  // inward and outward -- making the shape's visible outer edge exceed its
  // own nominal width/height/radius as strokeWidth increases. Inset the
  // underlying geometry by half the stroke width so the stroke instead
  // grows inward only, keeping the outer edge fixed at the shape's stated
  // size.
  const inset = element.strokeWidth / 2
  // Dash length is fixed relative to strokeWidth; the gap is user-
  // adjustable (also as a multiple of strokeWidth) and scales the dash
  // pattern from tight to loose. 0/unset means a solid stroke.
  const strokeDasharray = element.dashGap
    ? `${element.strokeWidth * 2.5} ${element.strokeWidth * element.dashGap}`
    : undefined
  if (element.shape === 'circle') {
    return (
      <circle
        r={Math.max(element.width / 2 - inset, 0)}
        fill={fill}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        strokeDasharray={strokeDasharray}
      />
    )
  }
  if (element.shape === 'oval') {
    return (
      <ellipse
        rx={Math.max(element.width / 2 - inset, 0)}
        ry={Math.max(element.height / 2 - inset, 0)}
        fill={fill}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        strokeDasharray={strokeDasharray}
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
        strokeDasharray={strokeDasharray}
      />
    )
  }
  if (element.shape === 'x') {
    const halfW = element.width / 2
    const halfH = element.height / 2
    return (
      <g
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
      >
        <line x1={-halfW} y1={-halfH} x2={halfW} y2={halfH} />
        <line x1={halfW} y1={-halfH} x2={-halfW} y2={halfH} />
      </g>
    )
  }
  if (element.shape === 'triangle') {
    return (
      <polygon
        points={trianglePoints(Math.max(element.width - inset * 2, 0), Math.max(element.height - inset * 2, 0))}
        fill={fill}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        strokeLinejoin="round"
        strokeDasharray={strokeDasharray}
      />
    )
  }
  if (element.shape === 'star') {
    return (
      <polygon
        points={starPoints(Math.max(element.width - inset * 2, 0), Math.max(element.height - inset * 2, 0))}
        fill={fill}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        strokeLinejoin="round"
        strokeDasharray={strokeDasharray}
      />
    )
  }
  if (element.shape === 'octagon') {
    return (
      <polygon
        points={octagonPoints(Math.max(element.width - inset * 2, 0), Math.max(element.height - inset * 2, 0))}
        fill={fill}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        strokeLinejoin="round"
        strokeDasharray={strokeDasharray}
      />
    )
  }
  const rectWidth = Math.max(element.width - inset * 2, 0)
  const rectHeight = Math.max(element.height - inset * 2, 0)
  return (
    <rect
      x={-rectWidth / 2}
      y={-rectHeight / 2}
      width={rectWidth}
      height={rectHeight}
      rx={element.shape === 'roundedRectangle' ? element.cornerRadius ?? 8 : 0}
      fill={fill}
      stroke={element.strokeColor}
      strokeWidth={element.strokeWidth}
      strokeDasharray={strokeDasharray}
    />
  )
}

function SelectionMarker() {
  return <circle data-selection-ui="true" r={2} fill="#C4571F" />
}
