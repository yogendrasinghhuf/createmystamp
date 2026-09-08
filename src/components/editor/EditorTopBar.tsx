import { Undo2, Redo2, FilePlus, Save, FolderOpen, RotateCcw } from 'lucide-react'
import { useStampStore, useCanUndo, useCanRedo, useProject } from '../../store/useStampStore'
import { saveProject, loadProject as loadFromStorage } from '../../lib/persistence'
import IconButton from '../ui/IconButton'

export default function EditorTopBar() {
  const project = useProject()
  const undo = useStampStore((s) => s.undo)
  const redo = useStampStore((s) => s.redo)
  const loadProject = useStampStore((s) => s.loadProject)
  const resetProject = useStampStore((s) => s.resetProject)
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  function handleSave() {
    saveProject(project)
  }

  function handleLoad() {
    const saved = loadFromStorage()
    if (saved) loadProject(saved)
  }

  function handleReset() {
    if (window.confirm('Reset the current design? This cannot be undone.')) {
      resetProject()
    }
  }

  function handleNew() {
    if (window.confirm('Start a new design? Unsaved changes will be lost.')) {
      resetProject()
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-line px-4 py-2">
      <div className="flex gap-2">
        <IconButton icon={<FilePlus size={18} />} label="New design" onClick={handleNew} />
        <IconButton icon={<Save size={18} />} label="Save" onClick={handleSave} />
        <IconButton icon={<FolderOpen size={18} />} label="Load" onClick={handleLoad} />
        <IconButton icon={<RotateCcw size={18} />} label="Reset" onClick={handleReset} />
      </div>
      <div className="flex gap-2">
        <IconButton icon={<Undo2 size={18} />} label="Undo" onClick={undo} disabled={!canUndo} />
        <IconButton icon={<Redo2 size={18} />} label="Redo" onClick={redo} disabled={!canRedo} />
      </div>
    </div>
  )
}
