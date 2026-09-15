import { useProject, useSelectedIds } from '../../store/useStampStore'
import TextProperties from './TextProperties'
import CurvedTextProperties from './CurvedTextProperties'
import ShapeProperties from './ShapeProperties'
import ImageProperties from './ImageProperties'
import QrCodeProperties from './QrCodeProperties'
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
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink/50">
            Element properties
          </h3>
          {selected.type === 'text' && <TextProperties element={selected} />}
          {selected.type === 'curvedText' && <CurvedTextProperties element={selected} />}
          {selected.type === 'shape' && <ShapeProperties element={selected} />}
          {selected.type === 'image' && <ImageProperties element={selected} />}
          {selected.type === 'qrCode' && <QrCodeProperties element={selected} />}
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
      <details className="group">
        <summary className="mb-2 flex cursor-pointer list-none items-center gap-1 text-sm font-semibold uppercase tracking-wide text-ink/50">
          <span className="inline-block transition-transform group-open:rotate-90">▶</span>
          Layers
        </summary>
        <LayerList />
      </details>
    </div>
  )
}
