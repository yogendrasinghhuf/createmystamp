import { Link } from 'react-router-dom'
import { BRAND } from '../../config/brand'

const footerLinks = [
  { to: '/add-to-pdf', label: 'Add to My PDF' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/responsible-use', label: 'Responsible Use' },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-ink/60 md:flex-row md:items-center md:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved. Online stamp maker
          and PDF stamping tool.
        </p>
        <nav className="flex flex-wrap gap-4">
          {footerLinks.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
