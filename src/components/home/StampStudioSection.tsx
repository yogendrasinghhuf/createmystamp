import { useEffect, useState } from 'react'
import EditorTopBar from '../editor/EditorTopBar'
import Toolbar from '../editor/Toolbar'
import StampCanvas from '../editor/StampCanvas'
import PropertiesPanel from '../editor/PropertiesPanel'
import ExportPanel from '../editor/ExportPanel'
import MobileToolbar from '../editor/MobileToolbar'
import MobileBottomSheet from '../editor/MobileBottomSheet'
import { useEditorKeyboardShortcuts } from '../../lib/useEditorKeyboardShortcuts'
import { useProject, useSelectedIds, useStampStore } from '../../store/useStampStore'
import { saveProject, loadProject as loadFromStorage } from '../../lib/persistence'

export default function StampStudioSection() {
  const project = useProject()
  const selectedIds = useSelectedIds()
  const removeElement = useStampStore((s) => s.removeElement)
  const updateElement = useStampStore((s) => s.updateElement)
  const loadProject = useStampStore((s) => s.loadProject)
  const [mobileSheet, setMobileSheet] = useState<'none' | 'add' | 'properties' | 'export'>('none')

  useEditorKeyboardShortcuts()

  useEffect(() => {
    const saved = loadFromStorage()
    if (saved) loadProject(saved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => saveProject(project), 400)
    return () => clearTimeout(timeout)
  }, [project])

  useEffect(() => {
    function handleDeleteKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const isEditingText = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
      if (isEditingText) return

      const selectedId = selectedIds[0]
      if (!selectedId) return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        removeElement(selectedId)
        return
      }

      const nudgeByKey: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
      }
      const nudge = nudgeByKey[e.key]
      if (nudge) {
        e.preventDefault()
        const step = e.shiftKey ? 5 : 0.5
        const element = project.elements.find((el) => el.id === selectedId)
        if (!element) return
        updateElement(selectedId, {
          x: element.x + nudge[0] * step,
          y: element.y + nudge[1] * step,
        })
      }
    }
    window.addEventListener('keydown', handleDeleteKey)
    return () => window.removeEventListener('keydown', handleDeleteKey)
  }, [selectedIds, removeElement, updateElement, project.elements])

  return (
    <section id="editor" className="scroll-mt-0 bg-paper">
      <div className="mx-auto max-w-[1000px] px-3 pt-3 md:px-6 md:pt-4">
        <div
          className="flex min-h-0 flex-col overflow-hidden rounded-xl3 border border-line shadow-card"
          style={{ height: 'min(680px, calc(100vh - 198px))' }}
        >
          <div className="flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[180px_1fr_320px]">
            <aside className="hidden min-h-0 overflow-y-auto border-r border-line md:block">
              <Toolbar />
            </aside>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-line/20">
                <div className="aspect-square h-full max-h-full max-w-full md:max-w-2xl">
                  <StampCanvas />
                </div>
              </div>
              <EditorTopBar />
            </div>
            <aside className="hidden min-h-0 overflow-y-auto border-l border-line md:block">
              {project.elements.length > 0 && <PropertiesPanel />}
            </aside>
          </div>
          <div className="hidden shrink-0 border-t border-line bg-paper px-4 py-2.5 md:block">
            <ExportPanel layout="row" />
          </div>
          <MobileToolbar
            onOpenAdd={() => setMobileSheet('add')}
            onOpenProperties={() => setMobileSheet('properties')}
            onOpenExport={() => setMobileSheet('export')}
          />
          <MobileBottomSheet title="Add element" open={mobileSheet === 'add'} onClose={() => setMobileSheet('none')}>
            <Toolbar />
          </MobileBottomSheet>
          <MobileBottomSheet title="Properties" open={mobileSheet === 'properties'} onClose={() => setMobileSheet('none')}>
            <PropertiesPanel />
          </MobileBottomSheet>
          <MobileBottomSheet title="Export" open={mobileSheet === 'export'} onClose={() => setMobileSheet('none')}>
            <ExportPanel />
          </MobileBottomSheet>
        </div>
      </div>
    </section>
  )
}
