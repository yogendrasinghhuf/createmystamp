import { useProject, useStampStore } from '../../store/useStampStore'
import Slider from '../ui/Slider'

export default function StampSettingsPanel() {
  const project = useProject()
  const setDimensions = useStampStore((s) => s.setDimensions)
  const isRoundShape = project.shape === 'circle' || project.shape === 'badge'
  const aspectRatio = project.dimensions.height / project.dimensions.width

  return (
    <div className="flex flex-col gap-4">
      <Slider
        label="Diameter (mm)"
        value={project.dimensions.width}
        min={15}
        max={80}
        onChange={(width) =>
          setDimensions(isRoundShape ? { width, height: width } : { width, height: width * aspectRatio })
        }
      />
    </div>
  )
}
