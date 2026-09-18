import { useEffect, type ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface PageShellProps {
  title: string
  description: string
  // Optional JSON-LD structured data (schema.org) for search engines.
  structuredData?: object
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

export default function PageShell({ title, description, structuredData, children }: PageShellProps) {
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
  }, [title, description])

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
