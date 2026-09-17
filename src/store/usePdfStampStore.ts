// src/store/usePdfStampStore.ts
import { create } from 'zustand'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { uid } from '../lib/id'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).href

export type StampSource = { kind: 'studio' } | { kind: 'template'; templateId: string }

export interface PlacedStampInstance {
  id: string
  pageIndex: number
  // PDF point space (bottom-left origin, +y up) -- the single source of
  // truth for this instance's position/size. See src/lib/pdfCoords.ts.
  xPt: number
  yPt: number
  widthPt: number
  heightPt: number
  // A frozen snapshot of the stamp at the moment it was dropped -- editing
  // the Studio design or switching templates afterward never changes
  // instances already placed.
  pngBytes: ArrayBuffer
  pngObjectUrl: string
}

export interface DragGhost {
  clientX: number
  clientY: number
  aspectRatio: number
}

interface PdfStampState {
  pdfFile: File | null
  pdfBytes: ArrayBuffer | null
  pdfDoc: PDFDocumentProxy | null
  pageCount: number
  currentPageIndex: number
  isLoadingPdf: boolean
  loadError: string | null
  stampSource: StampSource
  placedInstances: PlacedStampInstance[]
  // Non-null only while the user is mid-drag from the thumbnail; lets the
  // thumbnail (drag source) and the PDF page canvas (drop target) coordinate
  // without prop drilling across the sidebar/main-panel boundary.
  dragGhost: DragGhost | null
  selectedInstanceId: string | null
}

export interface PdfStampStore extends PdfStampState {
  loadPdf: (file: File) => Promise<void>
  clearPdf: () => void
  setCurrentPage: (index: number) => void
  setStampSourceToStudio: () => void
  setStampSourceToTemplate: (templateId: string) => void
  addPlacedInstance: (instance: Omit<PlacedStampInstance, 'id'>) => void
  updatePlacedInstance: (
    id: string,
    patch: Partial<Pick<PlacedStampInstance, 'xPt' | 'yPt' | 'widthPt' | 'heightPt'>>,
  ) => void
  removePlacedInstance: (id: string) => void
  clearAllPlacedInstances: () => void
  setDragGhost: (ghost: DragGhost | null) => void
  setSelectedInstance: (id: string | null) => void
}

const initialState: PdfStampState = {
  pdfFile: null,
  pdfBytes: null,
  pdfDoc: null,
  pageCount: 0,
  currentPageIndex: 0,
  isLoadingPdf: false,
  loadError: null,
  stampSource: { kind: 'studio' },
  placedInstances: [],
  dragGhost: null,
  selectedInstanceId: null,
}

function revokeAll(instances: PlacedStampInstance[]) {
  instances.forEach((i) => URL.revokeObjectURL(i.pngObjectUrl))
}

export const usePdfStampStore = create<PdfStampStore>((set, get) => ({
  ...initialState,

  loadPdf: async (file) => {
    set({ isLoadingPdf: true, loadError: null })
    try {
      const bytes = await file.arrayBuffer()
      // pdfjs detaches/transfers the buffer it's given, so hand it a copy and
      // keep the original bytes untouched for pdf-lib to open later at export time.
      const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise
      void get().pdfDoc?.cleanup()
      set({
        pdfFile: file,
        pdfBytes: bytes,
        pdfDoc: doc,
        pageCount: doc.numPages,
        currentPageIndex: 0,
        isLoadingPdf: false,
      })
    } catch (err) {
      set({
        isLoadingPdf: false,
        loadError: err instanceof Error ? err.message : 'Could not open this PDF.',
      })
    }
  },

  clearPdf: () => {
    void get().pdfDoc?.cleanup()
    revokeAll(get().placedInstances)
    // Keep stampSource -- the chosen thumbnail persists across a PDF change,
    // only the PDF-related fields (and any placed stamps, which belong to
    // the PDF being replaced) reset.
    set({ ...initialState, stampSource: get().stampSource })
  },

  setCurrentPage: (index) => {
    const { pageCount } = get()
    if (index < 0 || index >= pageCount) return
    set({ currentPageIndex: index, selectedInstanceId: null })
  },

  setStampSourceToStudio: () => set({ stampSource: { kind: 'studio' } }),

  setStampSourceToTemplate: (templateId) =>
    set({ stampSource: { kind: 'template', templateId } }),

  addPlacedInstance: (instance) => {
    const id = uid()
    set((state) => ({
      placedInstances: [...state.placedInstances, { ...instance, id }],
      // Select the stamp immediately after placing it, so its move/resize
      // handles are right there without an extra click.
      selectedInstanceId: id,
    }))
  },

  updatePlacedInstance: (id, patch) =>
    set((state) => ({
      placedInstances: state.placedInstances.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    })),

  removePlacedInstance: (id) =>
    set((state) => {
      const target = state.placedInstances.find((i) => i.id === id)
      if (target) URL.revokeObjectURL(target.pngObjectUrl)
      return {
        placedInstances: state.placedInstances.filter((i) => i.id !== id),
        selectedInstanceId: state.selectedInstanceId === id ? null : state.selectedInstanceId,
      }
    }),

  clearAllPlacedInstances: () =>
    set((state) => {
      revokeAll(state.placedInstances)
      return { placedInstances: [], selectedInstanceId: null }
    }),

  setDragGhost: (ghost) => set({ dragGhost: ghost }),

  setSelectedInstance: (id) => set({ selectedInstanceId: id }),
}))
