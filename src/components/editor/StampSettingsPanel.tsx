import { useProject, useStampStore } from '../../store/useStampStore'
import Select from '../ui/Select'
import Slider from '../ui/Slider'
import type { StampShapeKind } from '../../types/stamp'

const SHAPE_OPTIONS: { label: string; value: StampShapeKind }[] = [
  { label: 'Circle', value: 'circle' },
  { label: 'Oval', value: 'oval' },
  { label: 'Rectangle', value: 'rectangle' },
  { label: 'Rounded rectangle', value: 'roundedRectangle' },
  { label: 'Badge', value: 'badge' },
]

export default function StampSettingsPanel() {
  const project = useProject()
  const setShape = useStampStore((s) => s.setShape)
  const setDimensions = useStampStore((s) => s.setDimensions)

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Stamp shape"
        value={project.shape}
        options={SHAPE_OPTIONS}
        onChange={(shape) => setShape(shape as StampShapeKind)}
      />
      <Slider
        label="Width (mm)"
        value={project.dimensions.width}
        min={15}
        max={80}
        onChange={(width) => setDimensions({ ...project.dimensions, width })}
      />
      <Slider
        label="Height (mm)"
        value={project.dimensions.height}
        min={15}
        max={80}
        onChange={(height) => setDimensions({ ...project.dimensions, height })}
      />
    </div>
  )
}
