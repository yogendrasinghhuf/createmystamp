// src/lib/svgSerialize.ts

// Clones the given SVG node, strips selection-UI markup, and sets a centered
// viewBox/size from `dimensions` -- shared by both Stamp Studio's own export
// (which looks up its live canvas node by id, see getCleanSvgString below)
// and any other caller that renders its own off-screen SVG node.
export function serializeStampSvg(
  source: SVGSVGElement,
  dimensions: { width: number; height: number },
): string {
  const clone = source.cloneNode(true) as SVGSVGElement
  clone.querySelectorAll('[data-selection-ui="true"]').forEach((node) => node.remove())

  const padding = 10
  const viewWidth = dimensions.width + padding * 2
  const viewHeight = dimensions.height + padding * 2

  clone.setAttribute('viewBox', `${-viewWidth / 2} ${-viewHeight / 2} ${viewWidth} ${viewHeight}`)
  clone.setAttribute('width', `${viewWidth}mm`)
  clone.setAttribute('height', `${viewHeight}mm`)
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  return new XMLSerializer().serializeToString(clone)
}

export function getCleanSvgString(dimensions: { width: number; height: number }): string {
  const source = document.getElementById('stamp-canvas-svg') as SVGSVGElement | null
  if (!source) throw new Error('Canvas SVG not found')
  return serializeStampSvg(source, dimensions)
}
