import type { ImageElement } from '../../types/stamp'
import { useStampStore } from '../../store/useStampStore'
import { STAMP_ICONS, iconToSvgDataUrl } from '../../lib/icons'
import Slider from '../ui/Slider'
import ColorSwatch from '../ui/ColorSwatch'

export default function ImageProperties({ element }: { element: ImageElement }) {
  const updateElement = useStampStore((s) => s.updateElement)
  const patch = (p: Partial<ImageElement>) => updateElement(element.id, p)
  const iconOption = element.iconName ? STAMP_ICONS.find((i) => i.name === element.iconName) : undefined

  function handleColorChange(color: string) {
    if (!iconOption) return
    const dataUrl = iconToSvgDataUrl(iconOption.innerMarkup, color)
    if (!dataUrl) return
    patch({ color, src: dataUrl })
  }

  return (
    <div className="flex flex-col gap-4">
      <Slider label="Width" value={element.width} min={4} max={100} onChange={(width) => patch({ width })} />
      <Slider label="Height" value={element.height} min={4} max={100} onChange={(height) => patch({ height })} />
      {iconOption && (
        <ColorSwatch label="Element color" value={element.color ?? '#2B2A28'} onChange={handleColorChange} />
      )}
      <Slider label="Rotation" value={element.rotation} min={-180} max={180} onChange={(rotation) => patch({ rotation })} />
    </div>
  )
}
