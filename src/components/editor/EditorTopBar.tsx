import { Undo2, Redo2, RotateCcw } from 'lucide-react'
import { useStampStore, useCanUndo, useCanRedo } from '../../store/useStampStore'
import IconButton from '../ui/IconButton'

export default function EditorTopBar() {
  const undo = useStampStore((s) => s.undo)
  const redo = useStampStore((s) => s.redo)
  const resetProject = useStampStore((s) => s.resetProject)
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  function handleReset() {
    if (window.confirm('Reset the current design? This cannot be undone.')) {
      resetProject()
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-line px-4 py-2">
      <div className="flex gap-2">
        <IconButton icon={<RotateCcw size={18} />} label="Reset" onClick={handleReset} />
      </div>
      <div className="flex gap-2">
        <IconButton icon={<Undo2 size={18} />} label="Undo" onClick={undo} disabled={!canUndo} />
        <IconButton icon={<Redo2 size={18} />} label="Redo" onClick={redo} disabled={!canRedo} />
      </div>
    </div>
  )
}
