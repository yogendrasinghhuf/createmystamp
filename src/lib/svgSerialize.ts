// src/lib/svgSerialize.ts
export function getCleanSvgString(dimensions: { width: number; height: number }): string {
  const source = document.getElementById('stamp-canvas-svg') as SVGSVGElement | null
  if (!source) throw new Error('Canvas SVG not found')

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
