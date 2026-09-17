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

  function goToSection(sectionId: string) {
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView()
      return
    }
    navigate('/')
    // Wait for HomePage to mount before scrolling, since this is a
    // client-side route change rather than a real hash navigation.
    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView()
    })
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
