// src/pages/AddToPdfPage.tsx
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'
import { usePdfStampStore } from '../store/usePdfStampStore'
import PdfUploadZone from '../components/addToPdf/PdfUploadZone'
import PdfPageCanvas from '../components/addToPdf/PdfPageCanvas'
import StampThumbnail from '../components/addToPdf/StampThumbnail'
import TemplatePickerPanel from '../components/addToPdf/TemplatePickerPanel'

export default function AddToPdfPage() {
  const pdfDoc = usePdfStampStore((s) => s.pdfDoc)
  const pdfFile = usePdfStampStore((s) => s.pdfFile)
  const clearPdf = usePdfStampStore((s) => s.clearPdf)

  return (
    <PageShell
      title={`Add to PDF — ${BRAND.name}`}
      description={`Upload a PDF and place your ${BRAND.name} stamp directly onto its pages.`}
    >
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-ink">Add your stamp to a PDF</h1>
        <p className="mt-1 text-sm text-ink/60">
          Upload a PDF, preview it, then drag your stamp onto any page.
        </p>

        <div className="mt-8">
          {!pdfDoc ? (
            <PdfUploadZone />
          ) : (
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="flex items-center justify-between text-sm text-ink/60">
                  <span>{pdfFile?.name}</span>
                  <button
                    type="button"
                    onClick={clearPdf}
                    className="rounded border border-line px-3 py-1 hover:bg-line/30"
                  >
                    Choose a different PDF
                  </button>
                </div>
                <PdfPageCanvas />
              </div>
              <div className="flex w-full flex-col gap-4 md:w-64 md:shrink-0">
                <StampThumbnail />
                <TemplatePickerPanel />
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}
