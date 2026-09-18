// src/pages/AddToPdfPage.tsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'
import { usePdfStampStore } from '../store/usePdfStampStore'
import PdfPageCanvas from '../components/addToPdf/PdfPageCanvas'
import StampThumbnail from '../components/addToPdf/StampThumbnail'
import TemplatePickerPanel from '../components/addToPdf/TemplatePickerPanel'
import DragGhostOverlay from '../components/addToPdf/DragGhostOverlay'
import { buildStampedPdf } from '../lib/pdfExport'
import { downloadBlob } from '../lib/exportPng'
import { payForProduct } from '../lib/razorpay'

export default function AddToPdfPage() {
  const navigate = useNavigate()
  const pdfDoc = usePdfStampStore((s) => s.pdfDoc)
  const pdfFile = usePdfStampStore((s) => s.pdfFile)
  const pdfBytes = usePdfStampStore((s) => s.pdfBytes)
  const loadPdf = usePdfStampStore((s) => s.loadPdf)
  const isLoadingPdf = usePdfStampStore((s) => s.isLoadingPdf)
  const loadError = usePdfStampStore((s) => s.loadError)
  const placedInstances = usePdfStampStore((s) => s.placedInstances)
  const clearAllPlacedInstances = usePdfStampStore((s) => s.clearAllPlacedInstances)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [fileTypeError, setFileTypeError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  function handleChooseFile(file: File | undefined) {
    if (!file) return
    if (file.type !== 'application/pdf') {
      setFileTypeError('Word documents (.doc/.docx) aren’t supported yet - please upload a PDF.')
      return
    }
    setFileTypeError(null)
    void loadPdf(file)
  }

  async function handleDownload() {
    if (!pdfBytes || !pdfFile) return
    setIsExporting(true)
    setExportError(null)
    try {
      const result = await payForProduct('stamped_pdf_download', 'Stamped PDF download')
      if (result === 'cancelled') return
      if (result === 'verification_failed') {
        setExportError('We could not confirm your payment. If money was deducted, contact support before trying again.')
        return
      }
      const stampedBytes = await buildStampedPdf(pdfBytes, placedInstances)
      const blob = new Blob([stampedBytes], { type: 'application/pdf' })
      const name = pdfFile.name.replace(/\.pdf$/i, '')
      downloadBlob(blob, `${name}-stamped.pdf`)
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Could not create the stamped PDF.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <PageShell
      title={`Add a Stamp to a PDF Online - ${BRAND.name}`}
      description={`Stamp a PDF online for free: upload your PDF, drag your custom ${BRAND.name} stamp or a template onto any page, place as many stamps as you need, resize them, and download the stamped PDF. Your file never leaves your browser.`}
    >
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Stamp a PDF</h1>
            <p className="mt-1 text-sm text-ink/60">Upload a PDF, then drag your stamp onto any page.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded border border-line px-3 py-1.5 text-sm hover:bg-line/30"
          >
            Back to Stamp Studio
          </button>
        </div>

        <div className="mt-8">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div className="flex items-center justify-between text-sm text-ink/60">
                <span>{pdfFile?.name ?? 'No PDF selected yet'}</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded border border-line px-3 py-1 hover:bg-line/30"
                >
                  {pdfDoc ? 'Upload another PDF' : 'Upload PDF'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleChooseFile(e.target.files?.[0])}
                />
              </div>
              {fileTypeError && <p className="text-xs text-red-600">{fileTypeError}</p>}

              {pdfDoc ? (
                <PdfPageCanvas />
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex min-h-[420px] cursor-pointer flex-col items-center justify-center gap-2 rounded border border-dashed border-line bg-line/10 text-center hover:border-accent/50"
                >
                  <p className="text-sm font-medium text-ink">
                    {isLoadingPdf ? 'Loading PDF…' : 'Your PDF preview will appear here'}
                  </p>
                  <p className="text-xs text-ink/50">Click here or use "Upload PDF" above to get started.</p>
                  {loadError && <p className="mt-2 text-xs text-red-600">{loadError}</p>}
                </div>
              )}
            </div>
            <div className="w-full md:w-64 md:shrink-0">
              <div className="flex flex-col gap-4 md:sticky md:top-4">
                <StampThumbnail />
                <TemplatePickerPanel />
                <button
                  type="button"
                  onClick={clearAllPlacedInstances}
                  disabled={placedInstances.length === 0}
                  className="w-full rounded border border-line px-3 py-1.5 text-sm hover:bg-line/30 disabled:opacity-40"
                >
                  Clear PDF stamps
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isExporting || placedInstances.length === 0}
                  className="w-full rounded bg-[#1F5C3D] px-3 py-2 text-sm font-medium text-paper transition-colors hover:bg-[#1A4E34] disabled:opacity-40"
                >
                  {isExporting ? 'Preparing…' : `Download stamped PDF - ${BRAND.stampedPdfDownloadPrice}`}
                </button>
                {exportError && <p className="text-xs text-red-600">{exportError}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DragGhostOverlay />
    </PageShell>
  )
}
