import type { StampTemplate } from '../../data/templates'
import Button from '../ui/Button'

function MiniOutline({ shape, width, height }: { shape: string; width: number; height: number }) {
  const stroke = '#2B2A28'
  if (shape === 'circle' || shape === 'badge') {
    return <circle r={Math.min(width, height) / 2} fill="none" stroke={stroke} strokeWidth={1} />
  }
  if (shape === 'oval') {
    return <ellipse rx={width / 2} ry={height / 2} fill="none" stroke={stroke} strokeWidth={1} />
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

export default function TemplateCard({
  template,
  onUse,
}: {
  template: StampTemplate
  onUse: (template: StampTemplate) => void
}) {
  const { shape, dimensions } = template.project
  const padding = 10
  const viewWidth = dimensions.width + padding * 2
  const viewHeight = dimensions.height + padding * 2
  const firstTextEl = template.project.elements.find((el) => el.type === 'text' || el.type === 'curvedText')

  return (
    <div className="flex flex-col gap-3 rounded-xl2 border border-line bg-paper p-4 shadow-sm">
      <div className="flex aspect-square items-center justify-center rounded-lg bg-line/20">
        <svg viewBox={`${-viewWidth / 2} ${-viewHeight / 2} ${viewWidth} ${viewHeight}`} width="70%" height="70%">
          <MiniOutline shape={shape} width={dimensions.width} height={dimensions.height} />
          {firstTextEl && (
            <text textAnchor="middle" fontSize={5} fontWeight={600} fill="#2B2A28">
              {'text' in firstTextEl ? firstTextEl.text : ''}
            </text>
          )}
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-ink">{template.name}</p>
        <p className="text-xs text-ink/50">{template.category}</p>
      </div>
      <Button variant="secondary" onClick={() => onUse(template)}>
        Use Template
      </Button>
    </div>
  )
}
