// src/lib/pdfStampRaster.ts
import { serializeStampSvg } from './svgSerialize'
import { exportSvgToPngBlob } from './exportPng'

// 72 points per inch, 25.4mm per inch.
export const POINTS_PER_MM = 72 / 25.4

// Renders quality high enough to look crisp when placed at true physical
// size on a PDF page and then zoomed in.
const RASTER_PX_PER_MM = 12

export async function rasterizeStampSvg(
  svgElement: SVGSVGElement,
  dimensions: { width: number; height: number },
): Promise<{ bytes: ArrayBuffer; objectUrl: string }> {
  const svgString = serializeStampSvg(svgElement, dimensions)
  const padding = 10
  const widthPx = Math.round((dimensions.width + padding * 2) * RASTER_PX_PER_MM)
  const heightPx = Math.round((dimensions.height + padding * 2) * RASTER_PX_PER_MM)
  const blob = await exportSvgToPngBlob(svgString, widthPx, heightPx, true)
  const bytes = await blob.arrayBuffer()
  const objectUrl = URL.createObjectURL(blob)
  return { bytes, objectUrl }
}
