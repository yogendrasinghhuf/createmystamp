import type { ShapeElement } from '../../types/stamp'
import { useStampStore } from '../../store/useStampStore'
import Slider from '../ui/Slider'
import ColorSwatch from '../ui/ColorSwatch'

export default function ShapeProperties({ element }: { element: ShapeElement }) {
  const updateElement = useStampStore((s) => s.updateElement)
  const patch = (p: Partial<ShapeElement>) => updateElement(element.id, p)
  const hasIndependentHeight =
    element.shape === 'rectangle' ||
    element.shape === 'roundedRectangle' ||
    element.shape === 'triangle' ||
    element.shape === 'star' ||
    element.shape === 'octagon' ||
    element.shape === 'x'
  const canFill = element.shape !== 'line' && element.shape !== 'x'

  return (
    <div className="flex flex-col gap-4">
      {element.shape === 'circle' ? (
        <Slider
          label="Diameter"
          value={element.width}
          min={2}
          max={80}
          onChange={(size) => patch({ width: size, height: size })}
        />
      ) : (
        <Slider
          label={element.shape === 'line' ? 'Length' : 'Width'}
          value={element.width}
          min={2}
          max={80}
          onChange={(width) => patch({ width })}
        />
      )}
      {hasIndependentHeight && (
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
      <ColorSwatch
        label="Element color"
        value={element.strokeColor}
        onChange={(strokeColor) => patch({ strokeColor, fillColor: strokeColor })}
      />
      {canFill && (
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" checked={element.filled} onChange={(e) => patch({ filled: e.target.checked })} />
          Filled
        </label>
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
