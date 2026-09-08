import { useEffect, useState } from 'react'
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'
import EditorTopBar from '../components/editor/EditorTopBar'
import Toolbar from '../components/editor/Toolbar'
import StampCanvas from '../components/editor/StampCanvas'
import PropertiesPanel from '../components/editor/PropertiesPanel'
import ExportPanel from '../components/editor/ExportPanel'
import MobileToolbar from '../components/editor/MobileToolbar'
import MobileBottomSheet from '../components/editor/MobileBottomSheet'
import { useEditorKeyboardShortcuts } from '../lib/useEditorKeyboardShortcuts'
import { useProject, useSelectedIds, useStampStore } from '../store/useStampStore'
import { saveProject, loadProject as loadFromStorage } from '../lib/persistence'

export default function StampStudioPage() {
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
    <PageShell
      title={`Stamp Studio — ${BRAND.name}`}
      description="Design your custom stamp: choose a shape, add text and curved text, customize colors, preview the ink effect, and export as PNG or SVG."
    >
      <div className="flex h-[calc(100vh-65px)] min-h-0 flex-col overflow-hidden">
        <EditorTopBar />
        <div className="hidden min-h-0 flex-1 md:grid md:grid-cols-[72px_1fr_320px]">
          <aside className="min-h-0 overflow-y-auto border-r border-line">
            <Toolbar />
          </aside>
          <div className="flex min-h-0 items-center justify-center overflow-hidden bg-line/20 p-8">
            <div className="aspect-square w-full max-w-xl">
              <StampCanvas />
            </div>
          </div>
          <aside className="min-h-0 overflow-y-auto border-l border-line">
            <PropertiesPanel />
            <div className="border-t border-line p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">Export</h3>
              <ExportPanel />
            </div>
          </aside>
        </div>
        <div className="flex min-h-0 flex-1 flex-col md:hidden">
          <div className="flex flex-1 items-center justify-center overflow-hidden bg-line/20 p-4">
            <div className="aspect-square w-full max-w-sm">
              <StampCanvas />
            </div>
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
    </PageShell>
  )
}
