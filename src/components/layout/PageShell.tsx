import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const SITE_ORIGIN = 'https://createmystamp.com'

interface PageShellProps {
  title: string
  description: string
  // Optional JSON-LD structured data (schema.org) for search engines.
  structuredData?: object
  // Set for pages that should not be indexed (e.g. the 404 page).
  noindex?: boolean
  children: ReactNode
}

function upsertMeta(selector: string, create: () => HTMLMetaElement, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export default function PageShell({ title, description, structuredData, noindex, children }: PageShellProps) {
  const location = useLocation()

  useEffect(() => {
    document.title = title
    upsertMeta(
      'meta[name="description"]',
      () => Object.assign(document.createElement('meta'), { name: 'description' }),
      description,
    )
    upsertMeta(
      'meta[property="og:title"]',
      () => {
        const m = document.createElement('meta')
        m.setAttribute('property', 'og:title')
        return m
      },
      title,
    )
    upsertMeta(
      'meta[property="og:description"]',
      () => {
        const m = document.createElement('meta')
        m.setAttribute('property', 'og:description')
        return m
      },
      description,
    )

    const canonicalUrl = `${SITE_ORIGIN}${location.pathname}`
    let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonicalEl) {
      canonicalEl = document.createElement('link')
      canonicalEl.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalEl)
    }
    canonicalEl.setAttribute('href', canonicalUrl)

    upsertMeta(
      'meta[property="og:url"]',
      () => {
        const m = document.createElement('meta')
        m.setAttribute('property', 'og:url')
        return m
      },
      canonicalUrl,
    )

    upsertMeta(
      'meta[name="robots"]',
      () => Object.assign(document.createElement('meta'), { name: 'robots' }),
      noindex ? 'noindex, nofollow' : 'index, follow',
    )
  }, [title, description, location.pathname, noindex])

  useEffect(() => {
    const id = 'page-structured-data'
    document.getElementById(id)?.remove()
    if (!structuredData) return
    const script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)
    return () => script.remove()
  }, [structuredData])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
