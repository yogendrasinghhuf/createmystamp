// src/components/addToPdf/PdfUploadZone.tsx
import { useRef, useState, type DragEvent } from 'react'
import { usePdfStampStore } from '../../store/usePdfStampStore'

export default function PdfUploadZone() {
  const loadPdf = usePdfStampStore((s) => s.loadPdf)
  const isLoadingPdf = usePdfStampStore((s) => s.isLoadingPdf)
  const loadError = usePdfStampStore((s) => s.loadError)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  function handleFile(file: File | undefined) {
    if (!file) return
    if (file.type !== 'application/pdf') return
    void loadPdf(file)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-8 py-16 transition-colors ${
          isDragOver ? 'border-accent bg-accent/5' : 'border-line hover:border-accent/50'
        }`}
      >
        <p className="text-lg font-semibold text-ink">Drop a PDF here, or click to browse</p>
        <p className="text-sm text-ink/50">Upload a PDF to preview it and add your stamp.</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {isLoadingPdf && <p className="text-sm text-ink/50">Loading PDF…</p>}
      {loadError && <p className="text-sm text-red-600">{loadError}</p>}
    </div>
  )
}
