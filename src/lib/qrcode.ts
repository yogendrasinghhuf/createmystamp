import qrcodeFactory from 'qrcode-generator'
import type { QrContentType } from '../types/stamp'

function formatPayload(content: string, contentType: QrContentType): string {
  if (contentType === 'email') return `mailto:${content}`
  if (contentType === 'telephone') return `tel:${content}`
  return content
}

/**
 * Builds a boolean matrix (true = dark module) for the given content.
 * Returns an empty matrix ([]) if content is blank or encoding fails
 * (e.g. content too long for the QR spec) -- callers should skip
 * rendering rather than throw, since this runs on every keystroke.
 */
export function buildQrMatrix(content: string, contentType: QrContentType): boolean[][] {
  const trimmed = content.trim()
  if (!trimmed) return []

  try {
    const qr = qrcodeFactory(0, 'M')
    qr.addData(formatPayload(trimmed, contentType))
    qr.make()
    const count = qr.getModuleCount()
    const matrix: boolean[][] = []
    for (let row = 0; row < count; row++) {
      const rowData: boolean[] = []
      for (let col = 0; col < count; col++) {
        rowData.push(qr.isDark(row, col))
      }
      matrix.push(rowData)
    }
    return matrix
  } catch {
    return []
  }
}
