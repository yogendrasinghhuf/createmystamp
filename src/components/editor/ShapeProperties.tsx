import type { ShapeElement } from '../../types/stamp'
import { useStampStore } from '../../store/useStampStore'
import Slider from '../ui/Slider'
import ColorSwatch from '../ui/ColorSwatch'

export default function ShapeProperties({ element }: { element: ShapeElement }) {
  const updateElement = useStampStore((s) => s.updateElement)
  const patch = (p: Partial<ShapeElement>) => updateElement(element.id, p)

  return (
    <div className="flex flex-col gap-4">
      <Slider label="Width" value={element.width} min={2} max={80} onChange={(width) => patch({ width })} />
      {element.shape !== 'line' && (
        <Slider label="Height" value={element.height} min={2} max={80} onChange={(height) => patch({ height })} />
      )}
      <Slider
        label="Stroke width"
        value={element.strokeWidth}
        min={0.2}
        max={6}
        step={0.2}
        onChange={(strokeWidth) => patch({ strokeWidth })}
      />
      <ColorSwatch label="Stroke color" value={element.strokeColor} onChange={(strokeColor) => patch({ strokeColor })} />
      {element.shape !== 'line' && (
        <>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={element.filled} onChange={(e) => patch({ filled: e.target.checked })} />
            Filled
          </label>
          {element.filled && (
            <ColorSwatch label="Fill color" value={element.fillColor} onChange={(fillColor) => patch({ fillColor })} />
          )}
        </>
      )}
      {element.shape === 'roundedRectangle' && (
        <Slider
          label="Corner radius"
          value={element.cornerRadius ?? 3}
          min={0}
          max={20}
          onChange={(cornerRadius) => patch({ cornerRadius })}
        />
      )}
      <Slider label="Rotation" value={element.rotation} min={-180} max={180} onChange={(rotation) => patch({ rotation })} />
    </div>
  )
}
