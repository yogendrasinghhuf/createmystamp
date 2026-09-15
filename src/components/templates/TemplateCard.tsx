import { useState } from 'react'
import { resolveTemplateElementColors, type StampTemplate } from '../../data/templates'
import Button from '../ui/Button'
import CanvasElementView from '../editor/CanvasElementView'

function MiniOutline({ shape, width, height }: { shape: string; width: number; height: number }) {
  const stroke = '#2B2A28'
  if (shape === 'circle' || shape === 'badge') {
    return <circle r={Math.min(width, height) / 2} fill="none" stroke={stroke} strokeWidth={1} />
  }
  if (shape === 'oval') {
    return <ellipse rx={width / 2} ry={height / 2} fill="none" stroke={stroke} strokeWidth={1} />
  }
  if (shape === 'triangle') {
    const halfW = width / 2
    const halfH = height / 2
    return (
      <polygon
        points={`0,${-halfH} ${halfW},${halfH} ${-halfW},${halfH}`}
        fill="none"
        stroke={stroke}
        strokeWidth={1}
        strokeLinejoin="round"
      />
    )
  }
  return (
    <rect
      x={-width / 2}
      y={-height / 2}
      width={width}
      height={height}
      rx={shape === 'roundedRectangle' ? 6 : 0}
      fill="none"
      stroke={stroke}
      strokeWidth={1}
    />
  )
}

function noop() {}

export default function TemplateCard({
  template,
  onUse,
}: {
  template: StampTemplate
  onUse: (template: StampTemplate) => void
}) {
  const [justUsed, setJustUsed] = useState(false)
  const { shape, dimensions, elements, outlineSuppressed } = resolveTemplateElementColors(template.project)
  const padding = 6
  const viewWidth = dimensions.width + padding * 2
  const viewHeight = dimensions.height + padding * 2

  function handleUse() {
    onUse(template)
    setJustUsed(true)
    window.setTimeout(() => setJustUsed(false), 1500)
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl2 border border-line bg-paper p-3 shadow-sm">
      <div className="flex aspect-square items-center justify-center rounded-lg bg-line/20">
        <svg viewBox={`${-viewWidth / 2} ${-viewHeight / 2} ${viewWidth} ${viewHeight}`} width="85%" height="85%">
          {!outlineSuppressed && (
            <MiniOutline shape={shape} width={dimensions.width} height={dimensions.height} />
          )}
          {elements.map((element) => (
            <CanvasElementView key={element.id} element={element} isSelected={false} onPointerDownSelect={noop} />
          ))}
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-ink">{template.name}</p>
        <p className="text-xs text-ink/50">{template.category}</p>
      </div>
      <Button variant="secondary" onClick={handleUse}>
        {justUsed ? 'Loaded ✓' : 'Use Template'}
      </Button>
    </div>
  )
}
