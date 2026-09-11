import { Link } from 'react-router-dom'
import { BRAND } from '../../config/brand'

const navLinks = [
  { to: '#editor', label: 'Stamp Studio' },
  { to: '#templates', label: 'Templates' },
  { to: '#how-it-works', label: 'How It Works' },
  { to: '#faq', label: 'FAQ' },
]

export default function Header() {
  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight text-ink">
          {BRAND.name}
        </Link>
        <nav className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
