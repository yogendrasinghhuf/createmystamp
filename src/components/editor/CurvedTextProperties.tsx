import type { CurvedTextElement } from '../../types/stamp'
import { useStampStore } from '../../store/useStampStore'
import { FONT_STACKS } from '../../data/fonts'
import { maxCurvedTextLetterSpacing } from '../../lib/curvedText'
import Slider from '../ui/Slider'
import ColorSwatch from '../ui/ColorSwatch'
import Select from '../ui/Select'

export default function CurvedTextProperties({ element }: { element: CurvedTextElement }) {
  const updateElement = useStampStore((s) => s.updateElement)
  const patch = (p: Partial<CurvedTextElement>) => updateElement(element.id, p)
  const maxLetterSpacing = maxCurvedTextLetterSpacing(
    element.text,
    element.fontFamily,
    element.fontSize,
    element.fontWeight,
    element.radius,
  )

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink/70">Text</span>
        <input
          value={element.text}
          onChange={(e) => patch({ text: e.target.value })}
          className="rounded-lg border-2 border-accent bg-paper px-2 py-2"
        />
      </label>
      <Select
        label="Font"
        value={element.fontFamily}
        options={FONT_STACKS.map((f) => ({ label: f.label, value: f.value }))}
        onChange={(fontFamily) => patch({ fontFamily })}
      />
      <Slider label="Size" value={element.fontSize} min={2} max={16} step={0.5} onChange={(fontSize) => patch({ fontSize })} />
      <Slider
        label="Letter spacing"
        value={Math.min(element.letterSpacing, maxLetterSpacing)}
        min={-2}
        max={maxLetterSpacing}
        step={0.1}
        onChange={(letterSpacing) => patch({ letterSpacing })}
      />
      <Slider label="Radius" value={element.radius} min={5} max={80} onChange={(radius) => patch({ radius })} />
      <Slider
        label="Start position"
        value={element.startAngle}
        min={0}
        max={360}
        onChange={(startAngle) => patch({ startAngle })}
      />
      <Select
        label="Direction"
        value={element.direction}
        options={[
          { label: 'Clockwise', value: 'clockwise' },
          { label: 'Counter-clockwise', value: 'counterclockwise' },
        ]}
        onChange={(direction) => patch({ direction: direction as CurvedTextElement['direction'] })}
      />
      <Slider label="Rotation" value={element.rotation} min={-180} max={180} onChange={(rotation) => patch({ rotation })} />
      <ColorSwatch label="Color" value={element.color} onChange={(color) => patch({ color })} />
    </div>
  )
}
