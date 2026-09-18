import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function FinalCtaSection() {
  return (
    <section className="border-t border-line bg-ink py-20 text-paper">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-semibold">Ready to make your mark?</h2>
        <p className="mt-3 text-paper/70">
          Design a custom stamp in minutes, then download it or stamp it straight onto your PDF.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#editor" className="inline-block">
            <Button variant="secondary">Open Stamp Studio</Button>
          </a>
          <Link to="/add-to-pdf" className="inline-block">
            <Button variant="secondary">Add a stamp to my PDF</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
