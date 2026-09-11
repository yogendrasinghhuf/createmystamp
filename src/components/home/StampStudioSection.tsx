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
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds[0]) {
        e.preventDefault()
        removeElement(selectedIds[0])
      }
    }
    window.addEventListener('keydown', handleDeleteKey)
    return () => window.removeEventListener('keydown', handleDeleteKey)
  }, [selectedIds, removeElement])

  return (
    <section id="editor" className="scroll-mt-0 bg-paper">
      <div className="mx-auto max-w-[1000px] px-3 pt-3 md:px-6 md:pt-4">
        <div
          className="flex min-h-0 flex-col overflow-hidden rounded-xl3 border border-line shadow-card"
          style={{ height: 'min(680px, calc(100vh - 198px))' }}
        >
          <EditorTopBar />
          <div className="flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[150px_1fr_320px]">
            <aside className="hidden min-h-0 overflow-y-auto border-r border-line md:block">
              <Toolbar />
            </aside>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-line/20 p-4 md:p-8">
              <div className="aspect-square h-full max-h-full w-full max-w-sm md:max-w-2xl">
                <StampCanvas />
              </div>
            </div>
            <aside className="hidden min-h-0 overflow-y-auto border-l border-line md:block">
              <PropertiesPanel />
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
