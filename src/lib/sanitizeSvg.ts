const DISALLOWED_TAGS = ['script', 'foreignObject', 'iframe', 'embed', 'object']

export function sanitizeSvgString(raw: string): string | null {
  const parser = new DOMParser()
  const doc = parser.parseFromString(raw, 'image/svg+xml')
  const parserError = doc.querySelector('parsererror')
  if (parserError) return null

  const svgEl = doc.documentElement
  if (svgEl.tagName.toLowerCase() !== 'svg') return null

  for (const tagName of DISALLOWED_TAGS) {
    doc.querySelectorAll(tagName).forEach((node) => node.remove())
  }

  const allElements = doc.querySelectorAll('*')
  allElements.forEach((el) => {
    ;[...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase()
      const value = attr.value.trim().toLowerCase()
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name)
      }
      if ((name === 'href' || name === 'xlink:href') && !value.startsWith('#')) {
        el.removeAttribute(attr.name)
      }
      if (value.startsWith('javascript:')) {
        el.removeAttribute(attr.name)
      }
    })
  })

  return new XMLSerializer().serializeToString(svgEl)
}
