import type { ImageElement } from '../../types/stamp'
import { useStampStore } from '../../store/useStampStore'
import Slider from '../ui/Slider'

export default function ImageProperties({ element }: { element: ImageElement }) {
  const updateElement = useStampStore((s) => s.updateElement)
  const patch = (p: Partial<ImageElement>) => updateElement(element.id, p)

  return (
    <div className="flex flex-col gap-4">
      <Slider label="Width" value={element.width} min={4} max={100} onChange={(width) => patch({ width })} />
      <Slider label="Height" value={element.height} min={4} max={100} onChange={(height) => patch({ height })} />
      <Slider label="Rotation" value={element.rotation} min={-180} max={180} onChange={(rotation) => patch({ rotation })} />
    </div>
  )
}
