import { useProject, useStampStore } from '../../store/useStampStore'
import Select from '../ui/Select'
import Slider from '../ui/Slider'
import ColorSwatch from '../ui/ColorSwatch'

export default function InkPreviewControls() {
  const project = useProject()
  const setInk = useStampStore((s) => s.setInk)

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Preview mode"
        value={project.ink.mode}
        options={[
          { label: 'Clean', value: 'clean' },
          { label: 'Ink', value: 'ink' },
        ]}
        onChange={(mode) => setInk({ mode: mode as 'clean' | 'ink' })}
      />
      {project.ink.mode === 'ink' && (
        <>
          <ColorSwatch label="Ink color" value={project.ink.color} onChange={(color) => setInk({ color })} />
          <Slider
            label="Opacity"
            value={project.ink.opacity}
            min={0.3}
            max={1}
            step={0.05}
            onChange={(opacity) => setInk({ opacity })}
          />
          <Slider
            label="Distress"
            value={project.ink.distress}
            min={0}
            max={1}
            step={0.05}
            onChange={(distress) => setInk({ distress })}
          />
        </>
      )}
    </div>
  )
}
