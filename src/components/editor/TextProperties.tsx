import type { TextElement } from '../../types/stamp'
import { useStampStore } from '../../store/useStampStore'
import { FONT_STACKS } from '../../data/fonts'
import Slider from '../ui/Slider'
import ColorSwatch from '../ui/ColorSwatch'
import Select from '../ui/Select'

export default function TextProperties({ element }: { element: TextElement }) {
  const updateElement = useStampStore((s) => s.updateElement)
  const patch = (p: Partial<TextElement>) => updateElement(element.id, p)

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink/70">Text</span>
        {element.multiline ? (
          <textarea
            value={element.text}
            onChange={(e) => patch({ text: e.target.value })}
            className="rounded-lg border border-line bg-paper px-2 py-2"
            rows={3}
          />
        ) : (
          <input
            value={element.text}
            onChange={(e) => patch({ text: e.target.value })}
            className="rounded-lg border border-line bg-paper px-2 py-2"
          />
        )}
      </label>
      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          checked={element.multiline}
          onChange={(e) => patch({ multiline: e.target.checked })}
        />
        Multi-line
      </label>
      <Select
        label="Font"
        value={element.fontFamily}
        options={FONT_STACKS.map((f) => ({ label: f.label, value: f.value }))}
        onChange={(fontFamily) => patch({ fontFamily })}
      />
      <Slider label="Size" value={element.fontSize} min={2} max={20} step={0.5} onChange={(fontSize) => patch({ fontSize })} />
      <Slider label="Weight" value={element.fontWeight} min={300} max={900} step={100} onChange={(fontWeight) => patch({ fontWeight })} />
      <Slider
        label="Letter spacing"
        value={element.letterSpacing}
        min={-2}
        max={10}
        step={0.1}
        onChange={(letterSpacing) => patch({ letterSpacing })}
      />
      <Select
        label="Align"
        value={element.align}
        options={[
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ]}
        onChange={(align) => patch({ align: align as TextElement['align'] })}
      />
      <ColorSwatch label="Color" value={element.color} onChange={(color) => patch({ color })} />
      <Slider label="Rotation" value={element.rotation} min={-180} max={180} onChange={(rotation) => patch({ rotation })} />
    </div>
  )
}
