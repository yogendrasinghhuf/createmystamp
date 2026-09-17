import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BRAND } from '../../config/brand'

const navLinks = [{ sectionId: 'editor', label: 'Stamp Studio' }]

const navLinksAfterAddToPdf = [
  { sectionId: 'templates', label: 'Templates' },
  { sectionId: 'how-it-works', label: 'How It Works' },
  { sectionId: 'faq', label: 'FAQ' },
]

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  function scrollToSectionWhenReady(sectionId: string, attempt = 0, lastTop: number | null = null) {
    const el = document.getElementById(sectionId)
    // HomePage (and everything above this section) can still be mounting
    // and growing in height for a few frames after a client-side route
    // change -- a single requestAnimationFrame often fires before the
    // element exists, or before layout has settled, so scrollIntoView
    // silently lands at the wrong position (or gets pushed away by later
    // content loading in above it). Keep re-scrolling until the target's
    // position stops moving for two consecutive frames, up to ~1.5s.
    if (attempt > 45) return
    if (!el) {
      requestAnimationFrame(() => scrollToSectionWhenReady(sectionId, attempt + 1, lastTop))
      return
    }
    const top = el.getBoundingClientRect().top
    if (lastTop !== null && Math.abs(top - lastTop) < 1) return
    el.scrollIntoView()
    requestAnimationFrame(() => scrollToSectionWhenReady(sectionId, attempt + 1, top))
  }

  function goToSection(sectionId: string) {
    if (location.pathname === '/') {
      scrollToSectionWhenReady(sectionId)
      return
    }
    navigate('/')
    scrollToSectionWhenReady(sectionId)
  }

  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight text-ink">
          {BRAND.name}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.sectionId}
              type="button"
              onClick={() => goToSection(link.sectionId)}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/add-to-pdf"
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add to My PDF
          </Link>
          {navLinksAfterAddToPdf.map((link) => (
            <button
              key={link.sectionId}
              type="button"
              onClick={() => goToSection(link.sectionId)}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
