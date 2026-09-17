// src/lib/pdfCoords.ts
//
// Converts between on-screen CSS pixels (top-left origin, +y down -- the
// space pointer events and getBoundingClientRect() naturally live in) and
// PDF point space (bottom-left origin, +y up -- the space pdf-lib expects
// at export time). PDF point space is the single source of truth for every
// placed stamp instance; screen pixels are always a derived projection
// recomputed from the current render scale, so zoom/resize never drifts.

export interface PixelRect {
  x: number
  y: number
  width: number
  height: number
}

export interface PointRect {
  xPt: number
  yPt: number
  widthPt: number
  heightPt: number
}

export function pixelsToPoints(rect: PixelRect, renderScale: number, pageHeightPt: number): PointRect {
  const widthPt = rect.width / renderScale
  const heightPt = rect.height / renderScale
  const xPt = rect.x / renderScale
  const yPt = pageHeightPt - rect.y / renderScale - heightPt
  return { xPt, yPt, widthPt, heightPt }
}

export function pointsToPixels(rect: PointRect, renderScale: number, pageHeightPt: number): PixelRect {
  const width = rect.widthPt * renderScale
  const height = rect.heightPt * renderScale
  const x = rect.xPt * renderScale
  const y = (pageHeightPt - rect.yPt - rect.heightPt) * renderScale
  return { x, y, width, height }
}
