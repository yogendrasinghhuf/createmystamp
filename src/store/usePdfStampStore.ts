// src/store/usePdfStampStore.ts
import { create } from 'zustand'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).href

export type StampSource = { kind: 'studio' } | { kind: 'template'; templateId: string }

interface PdfStampState {
  pdfFile: File | null
  pdfBytes: ArrayBuffer | null
  pdfDoc: PDFDocumentProxy | null
  pageCount: number
  currentPageIndex: number
  isLoadingPdf: boolean
  loadError: string | null
  stampSource: StampSource
}

export interface PdfStampStore extends PdfStampState {
  loadPdf: (file: File) => Promise<void>
  clearPdf: () => void
  setCurrentPage: (index: number) => void
  setStampSourceToStudio: () => void
  setStampSourceToTemplate: (templateId: string) => void
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
    // Keep stampSource -- the chosen thumbnail persists across a PDF change,
    // only the PDF-related fields reset.
    set({ ...initialState, stampSource: get().stampSource })
  },

  setCurrentPage: (index) => {
    const { pageCount } = get()
    if (index < 0 || index >= pageCount) return
    set({ currentPageIndex: index })
  },

  setStampSourceToStudio: () => set({ stampSource: { kind: 'studio' } }),

  setStampSourceToTemplate: (templateId) =>
    set({ stampSource: { kind: 'template', templateId } }),
}))
