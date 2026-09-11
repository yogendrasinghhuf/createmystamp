import { useProject, useSelectedIds } from '../../store/useStampStore'
import TextProperties from './TextProperties'
import CurvedTextProperties from './CurvedTextProperties'
import ShapeProperties from './ShapeProperties'
import ImageProperties from './ImageProperties'
import StampSettingsPanel from './StampSettingsPanel'
import InkPreviewControls from './InkPreviewControls'
import LayerList from './LayerList'

export default function PropertiesPanel() {
  const project = useProject()
  const selectedIds = useSelectedIds()
  const selected = project.elements.find((el) => el.id === selectedIds[0])

  return (
    <div className="flex flex-col gap-4 p-3">
      {selected ? (
        <div className="rounded-xl2 border-2 border-accent/40 bg-accent/5 p-3">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">
            Element properties
          </h3>
          {selected.type === 'text' && <TextProperties element={selected} />}
          {selected.type === 'curvedText' && <CurvedTextProperties element={selected} />}
          {selected.type === 'shape' && <ShapeProperties element={selected} />}
          {selected.type === 'image' && <ImageProperties element={selected} />}
        </div>
      ) : (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink/50">Stamp settings</h3>
          <StampSettingsPanel />
        </div>
      )}
      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink/50">Ink preview</h3>
        <InkPreviewControls />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink/50">Layers</h3>
        <LayerList />
      </div>
    </div>
  )
}
