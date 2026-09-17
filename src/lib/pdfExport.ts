// src/lib/pdfExport.ts
import { PDFDocument } from 'pdf-lib'
import type { PlacedStampInstance } from '../store/usePdfStampStore'

export async function buildStampedPdf(
  pdfBytes: ArrayBuffer,
  placedInstances: PlacedStampInstance[],
): Promise<Uint8Array<ArrayBuffer>> {
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const pages = pdfDoc.getPages()

  // Cache one embedded image per unique PNG so the same stamp dropped
  // multiple times isn't re-embedded into the PDF each time.
  const embeddedByObjectUrl = new Map<string, Awaited<ReturnType<typeof pdfDoc.embedPng>>>()

  for (const instance of placedInstances) {
    const page = pages[instance.pageIndex]
    if (!page) continue

    let embedded = embeddedByObjectUrl.get(instance.pngObjectUrl)
    if (!embedded) {
      embedded = await pdfDoc.embedPng(instance.pngBytes)
      embeddedByObjectUrl.set(instance.pngObjectUrl, embedded)
    }

    page.drawImage(embedded, {
      x: instance.xPt,
      y: instance.yPt,
      width: instance.widthPt,
      height: instance.heightPt,
    })
  }

  const saved = await pdfDoc.save()
  // pdf-lib's Uint8Array is backed by a plain ArrayBuffer here (Node/browser,
  // not a SharedArrayBuffer source), but its declared type is the wider
  // ArrayBufferLike -- copy into a fresh, unambiguously-typed buffer so
  // callers (e.g. `new Blob([...])`) don't need to know that.
  return new Uint8Array(saved)
}
