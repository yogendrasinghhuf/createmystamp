import { useEffect } from 'react'
import { useStampStore } from '../store/useStampStore'

export function useEditorKeyboardShortcuts() {
  const undo = useStampStore((s) => s.undo)
  const redo = useStampStore((s) => s.redo)
  const removeElement = useStampStore((s) => s.removeElement)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMod = e.ctrlKey || e.metaKey
      if (!isMod) return

      const target = e.target as HTMLElement
      const isEditingText = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
      if (isEditingText) return

      if (e.key.toLowerCase() === 'z' && e.shiftKey) {
        e.preventDefault()
        redo()
      } else if (e.key.toLowerCase() === 'z') {
        e.preventDefault()
        undo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, removeElement])
}
