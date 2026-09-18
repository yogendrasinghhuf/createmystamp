import { useEffect, useRef, useState } from 'react'
import { useProject, useSelectedIds, useStampStore } from '../../store/useStampStore'
import CanvasElementView from './CanvasElementView'
import SelectionOverlay from './SelectionOverlay'
import { clamp } from '../../lib/geometry'

// Fixed on-screen pixel thickness of the ruler gutter and its label font
// size. These are rendered in a separate, non-scaling HTML overlay (not as
// SVG geometry inside the zoomable canvas), because any mm value assigned
// inside the SVG's viewBox would render at a different pixel size whenever
// the viewBox's total span changes with stamp diameter or zoom -- that's
// inherent to how SVG viewBox scaling works, not something fixable by
// picking a different mm constant.
const RULER_GUTTER_PX = 10
const RULER_FONT_SIZE_PX = 8

interface RulerTick {
  label: number
  percent: number
  major: boolean
}

function buildRulerTicks(viewSpan: number, viewOffset: number, origin: number): RulerTick[] {
  // Ticks are generated in label space (distance from the stamp's own edge,
  // so "0" lines up with where the design starts) then converted to a
  // percentage position along the visible viewBox span for CSS placement.
  // Labels never go negative -- the ruler starts at 0 and the padding
  // before the stamp's edge stays plain, unruled background.
  const startLabel = Math.max(0, Math.ceil((viewOffset - origin) / 5) * 5)
  const endLabel = Math.floor((viewOffset + viewSpan - origin) / 5) * 5
  const ticks: RulerTick[] = []
  for (let label = startLabel; label <= endLabel; label += 5) {
    const svgPos = origin + label
    const percent = ((svgPos - viewOffset) / viewSpan) * 100
    ticks.push({ label, percent, major: label % 10 === 0 })
  }
  return ticks
}

function MeasurementGrid({
  viewWidth,
  viewHeight,
  viewLeft,
  viewTop,
}: {
  viewWidth: number
  viewHeight: number
  viewLeft: number
  viewTop: number
}) {
  const left = viewLeft
  const top = viewTop
  // The ruler's 0 is the workspace's own top-left corner (a fixed
  // reference point), not the design's edge -- the design sits inset from
  // it by designPadding, so it reads e.g. 2..40 instead of 0..38.
  const originX = viewLeft
  const originY = viewTop

  const minorLinesX = buildRulerTicks(viewWidth, left, originX)
  const minorLinesY = buildRulerTicks(viewHeight, top, originY)

  return (
    <g data-selection-ui="true" pointerEvents="none">
      {minorLinesX.map(({ percent, major, label }) => {
        const x = left + (percent / 100) * viewWidth
        return (
          <line
            key={`v-${label}-${percent}`}
            x1={x}
            y1={top}
            x2={x}
            y2={top + viewHeight}
            stroke={major ? '#D8D0C0' : '#E9E3D6'}
            strokeWidth={(major ? 0.15 : 0.08) * (viewWidth / 64)}
          />
        )
      })}
      {minorLinesY.map(({ percent, major, label }) => {
        const y = top + (percent / 100) * viewHeight
        return (
          <line
            key={`h-${label}-${percent}`}
            x1={left}
            y1={y}
            x2={left + viewWidth}
            y2={y}
            stroke={major ? '#D8D0C0' : '#E9E3D6'}
            strokeWidth={(major ? 0.15 : 0.08) * (viewWidth / 64)}
          />
        )
      })}
    </g>
  )
}

// Fixed-pixel ruler overlay: renders the gutter band, tick marks, and
// labels in plain HTML/CSS positioned by percentage over the SVG canvas, so
// its thickness and font size never change with zoom or stamp diameter --
// only the tick positions/values (in percent) do.
function RulerOverlay({
  viewWidth,
  viewHeight,
  viewLeft,
  viewTop,
  renderedWidth,
  renderedHeight,
}: {
  viewWidth: number
  viewHeight: number
  viewLeft: number
  viewTop: number
  renderedWidth: number
  renderedHeight: number
}) {
  const left = viewLeft
  const top = viewTop
  // The ruler's 0 is the workspace's own top-left corner, not the design's
  // edge -- see MeasurementGrid for the matching rationale.
  const originX = viewLeft
  const originY = viewTop

  const ticksX = buildRulerTicks(viewWidth, left, originX)
  const ticksY = buildRulerTicks(viewHeight, top, originY)

  return (
    <div
      data-selection-ui="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: RULER_GUTTER_PX,
          width: renderedWidth,
          height: RULER_GUTTER_PX,
          background: '#FFFFFF',
        }}
      >
        {ticksX.map(({ percent, label }) => (
          <div
            key={`vgrid-${label}-${percent}`}
            style={{
              position: 'absolute',
              left: `${percent}%`,
              top: 0,
              bottom: 0,
              width: 1,
              background: '#D8D0C0',
            }}
          />
        ))}
        {ticksX.map(({ percent, major, label }) => (
          <div
            key={`vl-${label}-${percent}`}
            style={{
              position: 'absolute',
              left: `${percent}%`,
              top: 0,
              height: '100%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            {major ? (
              <span style={{ fontSize: RULER_FONT_SIZE_PX, color: '#9A8F78', lineHeight: 1, paddingBottom: 3 }}>
                {label}
              </span>
            ) : (
              <div style={{ width: 1, height: RULER_GUTTER_PX * 0.35, background: '#B7AD98' }} />
            )}
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          top: RULER_GUTTER_PX,
          left: 0,
          height: renderedHeight,
          width: RULER_GUTTER_PX,
          background: '#FFFFFF',
        }}
      >
        {ticksY.map(({ percent, label }) => (
          <div
            key={`hgrid-${label}-${percent}`}
            style={{
              position: 'absolute',
              top: `${percent}%`,
              left: 0,
              right: 0,
              height: 1,
              background: '#D8D0C0',
            }}
          />
        ))}
        {ticksY.map(({ percent, major, label }) => (
          <div
            key={`hl-${label}-${percent}`}
            style={{
              position: 'absolute',
              top: `${percent}%`,
              left: 0,
              width: '100%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {major ? (
              <span style={{ fontSize: RULER_FONT_SIZE_PX, color: '#9A8F78', lineHeight: 1, paddingRight: 3 }}>
                {label}
              </span>
            ) : (
              <div style={{ height: 1, width: RULER_GUTTER_PX * 0.35, background: '#B7AD98' }} />
            )}
          </div>
        ))}
      </div>
    </div>
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const drag = useRef<DragMode>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setContainerSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // The workspace/ruler origin (0,0) is a fixed reference point -- it is
  // NOT the design's own edge. The workspace is always a square span sized
  // by the larger of the design's own width/height (its "diameter"), with
  // `designPadding` added on every side -- so e.g. a 38x25mm design still
  // gets a 42x42 workspace (both axes reaching the same ruler max). The
  // design is anchored to the workspace's top-left corner (2mm in on both
  // axes), not centered, so a shorter/narrower design still starts at the
  // same ruler position on every axis instead of floating in the middle.
  // edgeInset is a hairline buffer (not a visible gap) so a gridline/stroke
  // rendered exactly at the viewBox edge isn't clipped in half by the
  // canvas boundary.
  const designPadding = 2
  const edgeInset = 0.1
  const workspaceSpan = Math.max(project.dimensions.width, project.dimensions.height)
  const viewWidth = (workspaceSpan + designPadding * 2 + edgeInset) / zoom
  const viewHeight = (workspaceSpan + designPadding * 2 + edgeInset) / zoom
  const viewLeft = -project.dimensions.width / 2 - designPadding - edgeInset
  const viewTop = -project.dimensions.height / 2 - designPadding - edgeInset

  // Because the viewBox's aspect ratio is fixed to the design's own shape
  // (not the panel's), preserveAspectRatio="meet" may letterbox -- shrinking
  // the rendered content to fit one dimension and leaving empty space on
  // the other, anchored to the top-left. The ruler overlay needs the
  // content's actual rendered box (not the raw container box) so its ticks
  // land on the real gridlines instead of stretching into the letterbox gap.
  const { w: containerW, h: containerH } = containerSize
  const contentScale =
    containerW > 0 && containerH > 0 && viewWidth > 0 && viewHeight > 0
      ? Math.min(containerW / viewWidth, containerH / viewHeight)
      : 0
  const renderedWidth = contentScale > 0 ? viewWidth * contentScale : containerW
  const renderedHeight = contentScale > 0 ? viewHeight * contentScale : containerH
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
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: RULER_GUTTER_PX,
          left: RULER_GUTTER_PX,
          right: 0,
          bottom: 0,
        }}
      >
        <svg
          id="stamp-canvas-svg"
          ref={svgRef}
          viewBox={`${viewLeft - pan.x} ${viewTop - pan.y} ${viewWidth} ${viewHeight}`}
          preserveAspectRatio="xMinYMin meet"
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
              x={viewLeft}
              y={viewTop}
              width={viewWidth}
              height={viewHeight}
            />
          </clipPath>
        </defs>
        <MeasurementGrid
          viewWidth={viewWidth}
          viewHeight={viewHeight}
          viewLeft={viewLeft}
          viewTop={viewTop}
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
      </div>
      <RulerOverlay
        viewWidth={viewWidth}
        viewHeight={viewHeight}
        viewLeft={viewLeft}
        viewTop={viewTop}
        renderedWidth={renderedWidth}
        renderedHeight={renderedHeight}
      />
    </div>
  )
}
