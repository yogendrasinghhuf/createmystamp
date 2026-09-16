import { useRef, useState } from 'react'
import { useProject, useSelectedIds, useStampStore } from '../../store/useStampStore'
import CanvasElementView from './CanvasElementView'
import SelectionOverlay from './SelectionOverlay'
import { clamp } from '../../lib/geometry'

// Reference viewWidth used to define the gutter/font size "at 1x" -- other
// sizes scale proportionally to this so the gutter always resolves to the
// same physical pixel thickness on screen, no matter how far the workspace
// is zoomed in/out (a fixed mm value would otherwise render thicker as the
// stamp shrinks, since the same SVG panel then covers fewer total mm).
const REFERENCE_VIEW_WIDTH = 64
const RULER_GUTTER_AT_REFERENCE = 5
const RULER_FONT_SIZE_AT_REFERENCE = 2

function rulerGutterFor(viewWidth: number): number {
  return RULER_GUTTER_AT_REFERENCE * (viewWidth / REFERENCE_VIEW_WIDTH)
}

function MeasurementGrid({
  viewWidth,
  viewHeight,
  stampWidth,
  stampHeight,
}: {
  viewWidth: number
  viewHeight: number
  stampWidth: number
  stampHeight: number
}) {
  const scale = viewWidth / REFERENCE_VIEW_WIDTH
  const gutter = rulerGutterFor(viewWidth)
  const fontSize = RULER_FONT_SIZE_AT_REFERENCE * scale

  const left = -viewWidth / 2
  const top = -viewHeight / 2

  // Ruler labels read as distance from the stamp's own top-left corner
  // (0-based, like a physical ruler), so "0" lines up with where the design
  // actually starts rather than the extra breathing-room padding around it.
  // The underlying SVG coordinates stay centered at (0,0) -- element
  // positions, drag math, and curved-text angles all depend on that
  // centered coordinate system elsewhere in the canvas.
  const originX = -stampWidth / 2
  const originY = -stampHeight / 2

  // Gridlines/ticks span the entire padded workspace (not just the stamp's
  // own box), so the ruler fully covers the zoomable/draggable area with no
  // unmarked gap -- labels go negative into the padding before the stamp
  // and past stampWidth/stampHeight after it.
  const startLabelX = Math.ceil((left - originX) / 5) * 5
  const endLabelX = Math.floor((left + viewWidth - originX) / 5) * 5
  const minorLinesX: { svg: number; label: number }[] = []
  for (let label = startLabelX; label <= endLabelX; label += 5) {
    minorLinesX.push({ svg: originX + label, label })
  }
  const startLabelY = Math.ceil((top - originY) / 5) * 5
  const endLabelY = Math.floor((top + viewHeight - originY) / 5) * 5
  const minorLinesY: { svg: number; label: number }[] = []
  for (let label = startLabelY; label <= endLabelY; label += 5) {
    minorLinesY.push({ svg: originY + label, label })
  }

  return (
    <g data-selection-ui="true" pointerEvents="none">
      {/* Ruler gutter background along the outer canvas edges */}
      <rect x={left - gutter} y={top - gutter} width={viewWidth + gutter} height={gutter} fill="#EFEAE0" />
      <rect x={left - gutter} y={top - gutter} width={gutter} height={viewHeight + gutter} fill="#EFEAE0" />
      {minorLinesX.map(({ svg: x, label }) => {
        const isMajor = label % 10 === 0
        return (
          <line
            key={`v-${x}`}
            x1={x}
            y1={top}
            x2={x}
            y2={top + viewHeight}
            stroke={isMajor ? '#D8D0C0' : '#E9E3D6'}
            strokeWidth={(isMajor ? 0.15 : 0.08) * scale}
          />
        )
      })}
      {minorLinesY.map(({ svg: y, label }) => {
        const isMajor = label % 10 === 0
        return (
          <line
            key={`h-${y}`}
            x1={left}
            y1={y}
            x2={left + viewWidth}
            y2={y}
            stroke={isMajor ? '#D8D0C0' : '#E9E3D6'}
            strokeWidth={(isMajor ? 0.15 : 0.08) * scale}
          />
        )
      })}
      {/* Small tick marks in the gutter at every 5mm, between the labeled
          10mm lines */}
      {minorLinesX
        .filter(({ label }) => label % 10 !== 0)
        .map(({ svg: x, label }) => (
          <line
            key={`vt-${x}-${label}`}
            x1={x}
            y1={top - gutter * 0.35}
            x2={x}
            y2={top}
            stroke="#B7AD98"
            strokeWidth={0.1 * scale}
          />
        ))}
      {minorLinesY
        .filter(({ label }) => label % 10 !== 0)
        .map(({ svg: y, label }) => (
          <line
            key={`ht-${y}-${label}`}
            x1={left - gutter * 0.35}
            y1={y}
            x2={left}
            y2={y}
            stroke="#B7AD98"
            strokeWidth={0.1 * scale}
          />
        ))}
      {/* Tick marks + labels live in the outer gutter, aligned to each
          gridline's actual position (which starts at the stamp edge) */}
      {minorLinesX
        .filter(({ label }) => label % 10 === 0)
        .map(({ svg: x, label }) => (
          <text
            key={`vl-${x}`}
            x={x}
            y={top - gutter * 0.35}
            fontSize={fontSize}
            textAnchor="middle"
            fill="#9A8F78"
          >
            {label}
          </text>
        ))}
      {minorLinesY
        .filter(({ label }) => label % 10 === 0)
        .map(({ svg: y, label }) => (
          <text
            key={`hl-${y}`}
            x={left - gutter * 0.2}
            y={y + fontSize * 0.35}
            fontSize={fontSize}
            textAnchor="end"
            fill="#9A8F78"
          >
            {label}
          </text>
        ))}
    </g>
  )
}

function StampOutline({ shape, width, height, color }: { shape: string; width: number; height: number; color: string }) {
  const stroke = color
  const strokeWidth = 1.2
  if (shape === 'circle' || shape === 'badge') {
    return <circle r={Math.min(width, height) / 2} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
  }
  if (shape === 'oval') {
    return <ellipse rx={width / 2} ry={height / 2} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
  }
  if (shape === 'triangle') {
    return (
      <polygon
        points={trianglePoints(width, height)}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    )
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

function trianglePoints(width: number, height: number): string {
  const halfW = width / 2
  const halfH = height / 2
  return `0,${-halfH} ${halfW},${halfH} ${-halfW},${halfH}`
}

type DragMode =
  | { kind: 'move'; id: string; startX: number; startY: number; originX: number; originY: number }
  | { kind: 'resize'; id: string; originScale: number; centerX: number; centerY: number; startDist: number }
  | { kind: 'rotate'; id: string; centerX: number; centerY: number }
  | { kind: 'pan'; startClientX: number; startClientY: number; originPanX: number; originPanY: number }
  | null

export default function StampCanvas() {
  const project = useProject()
  const selectedIds = useSelectedIds()
  const select = useStampStore((s) => s.select)
  const updateElementTransient = useStampStore((s) => s.updateElementTransient)
  const commitTransientUpdate = useStampStore((s) => s.commitTransientUpdate)
  const outlineSuppressed = project.outlineSuppressed ?? false

  const svgRef = useRef<SVGSVGElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const drag = useRef<DragMode>(null)

  const padding = 10
  const viewWidth = (project.dimensions.width + padding * 2) / zoom
  const viewHeight = (project.dimensions.height + padding * 2) / zoom
  const gutter = rulerGutterFor(viewWidth)
  const sorted = [...project.elements].sort((a, b) => a.zIndex - b.zIndex)
  const selectedElement = project.elements.find((el) => el.id === selectedIds[0])

  function toSvgPoint(clientX: number, clientY: number): { x: number; y: number } {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const pt = svg.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return { x: 0, y: 0 }
    const transformed = pt.matrixTransform(ctm.inverse())
    return { x: transformed.x, y: transformed.y }
  }

  function handleElementPointerDown(id: string, e: React.PointerEvent) {
    e.stopPropagation()
    select([id])
    const el = project.elements.find((it) => it.id === id)
    if (!el) return
    const p = toSvgPoint(e.clientX, e.clientY)
    drag.current = { kind: 'move', id, startX: p.x, startY: p.y, originX: el.x, originY: el.y }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }

  function handleResizeStart(id: string, e: React.PointerEvent) {
    const el = project.elements.find((it) => it.id === id)
    if (!el) return
    const p = toSvgPoint(e.clientX, e.clientY)
    const dist = Math.hypot(p.x - el.x, p.y - el.y)
    drag.current = { kind: 'resize', id, originScale: el.scale, centerX: el.x, centerY: el.y, startDist: dist || 1 }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }

  function handleRotateStart(id: string, e: React.PointerEvent) {
    const el = project.elements.find((it) => it.id === id)
    if (!el) return
    drag.current = { kind: 'rotate', id, centerX: el.x, centerY: el.y }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: React.PointerEvent) {
    const d = drag.current
    if (!d) return
    const p = toSvgPoint(e.clientX, e.clientY)

    if (d.kind === 'move') {
      updateElementTransient(d.id, { x: d.originX + (p.x - d.startX), y: d.originY + (p.y - d.startY) } as never)
    } else if (d.kind === 'resize') {
      const dist = Math.hypot(p.x - d.centerX, p.y - d.centerY)
      const nextScale = clamp((dist / d.startDist) * d.originScale, 0.2, 6)
      updateElementTransient(d.id, { scale: nextScale } as never)
    } else if (d.kind === 'rotate') {
      const angleRad = Math.atan2(p.y - d.centerY, p.x - d.centerX)
      const angleDeg = Math.round((angleRad * 180) / Math.PI + 90)
      updateElementTransient(d.id, { rotation: angleDeg } as never)
    } else if (d.kind === 'pan') {
      setPan({
        x: d.originPanX + (e.clientX - d.startClientX),
        y: d.originPanY + (e.clientY - d.startClientY),
      })
    }
  }

  function handlePointerUp() {
    if (drag.current && drag.current.kind !== 'pan') {
      // Commit the whole gesture (move/resize/rotate) as exactly one history entry.
      commitTransientUpdate()
    }
    drag.current = null
  }

  function handleCanvasPointerDown(e: React.PointerEvent) {
    if (e.button === 1 || e.shiftKey) {
      drag.current = { kind: 'pan', startClientX: e.clientX, startClientY: e.clientY, originPanX: pan.x, originPanY: pan.y }
      return
    }
    select([])
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault()
    setZoom((z) => clamp(z - e.deltaY * 0.001, 0.4, 4))
  }

  return (
    <svg
      id="stamp-canvas-svg"
      ref={svgRef}
      viewBox={`${-viewWidth / 2 - pan.x - gutter} ${-viewHeight / 2 - pan.y - gutter} ${viewWidth + gutter} ${viewHeight + gutter}`}
      width="100%"
      height="100%"
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      style={{ touchAction: 'none' }}
    >
      <defs>
        <filter id="ink-distress-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={4}
            numOctaves={2}
            seed={3}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={project.ink.distress * 1.5}
          />
        </filter>
        <clipPath id="workspace-clip">
          <rect
            x={-viewWidth / 2}
            y={-viewHeight / 2}
            width={viewWidth}
            height={viewHeight}
          />
        </clipPath>
      </defs>
      <MeasurementGrid
        viewWidth={viewWidth}
        viewHeight={viewHeight}
        stampWidth={project.dimensions.width}
        stampHeight={project.dimensions.height}
      />
      <g clipPath="url(#workspace-clip)">
        <g
          filter={project.ink.mode === 'ink' ? 'url(#ink-distress-filter)' : undefined}
          opacity={project.ink.mode === 'ink' ? project.ink.opacity : 1}
          style={project.ink.mode === 'ink' ? { color: project.ink.color } : undefined}
        >
          {project.elements.length > 0 && !outlineSuppressed && (
            <StampOutline
              shape={project.shape}
              width={project.dimensions.width}
              height={project.dimensions.height}
              color={project.ink.color}
            />
          )}
          {sorted.map((element) => (
            <CanvasElementView
              key={element.id}
              element={element}
              isSelected={selectedIds.includes(element.id)}
              onPointerDownSelect={handleElementPointerDown}
            />
          ))}
        </g>
      </g>
      {selectedElement && (
        <SelectionOverlay
          element={selectedElement}
          onResizeStart={(e) => handleResizeStart(selectedElement.id, e)}
          onRotateStart={(e) => handleRotateStart(selectedElement.id, e)}
        />
      )}
    </svg>
  )
}
