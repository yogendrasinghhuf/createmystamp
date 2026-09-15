import { Undo2, Redo2, RotateCcw, Eraser } from 'lucide-react'
import { useStampStore, useCanUndo, useCanRedo } from '../../store/useStampStore'
import IconButton from '../ui/IconButton'

export default function EditorTopBar() {
  const undo = useStampStore((s) => s.undo)
  const redo = useStampStore((s) => s.redo)
  const resetProject = useStampStore((s) => s.resetProject)
  const clearProject = useStampStore((s) => s.clearProject)
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  function handleReset() {
    if (window.confirm('Reset to the sample design? Your current design will be lost.')) {
      resetProject()
    }
  }

  function handleClear() {
    if (window.confirm('Clear the workspace completely? This removes everything and cannot be undone.')) {
      clearProject()
    }
  }

  return (
    <div className="flex shrink-0 items-center justify-between border-t border-line px-4 py-2">
      <div className="flex gap-2">
        <IconButton icon={<RotateCcw size={18} />} label="Reset to sample" onClick={handleReset} />
        <IconButton icon={<Eraser size={18} />} label="Clear workspace" onClick={handleClear} />
      </div>
      <div className="flex gap-2">
        <IconButton icon={<Undo2 size={18} />} label="Undo" onClick={undo} disabled={!canUndo} />
        <IconButton icon={<Redo2 size={18} />} label="Redo" onClick={redo} disabled={!canRedo} />
      </div>
    </div>
  )
}
