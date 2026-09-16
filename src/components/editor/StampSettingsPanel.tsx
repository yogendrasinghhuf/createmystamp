import { useProject, useStampStore } from '../../store/useStampStore'
import Slider from '../ui/Slider'

export default function StampSettingsPanel() {
  const project = useProject()
  const setDimensions = useStampStore((s) => s.setDimensions)
  const isRoundShape = project.shape === 'circle' || project.shape === 'badge'

  return (
    <div className="flex flex-col gap-4">
      {isRoundShape ? (
        <Slider
          label="Diameter (mm)"
          value={project.dimensions.width}
          min={15}
          max={80}
          onChange={(size) => setDimensions({ width: size, height: size })}
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
