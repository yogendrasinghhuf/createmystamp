import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-ink py-20 text-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[14px] border-accent/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-accent/10"
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-semibold text-paper sm:text-4xl">Ready to make your mark?</h2>
        <p className="mt-3 text-paper/70">
          Design a custom stamp in minutes, then download it or stamp it straight onto your PDF.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#editor" className="inline-block">
            <Button variant="secondary">Open Stamp Studio</Button>
          </a>
          <Link to="/add-to-pdf" className="inline-block">
            <Button className="border-stamp-blue bg-stamp-blue text-white hover:border-stamp-blue-dark hover:bg-stamp-blue-dark hover:text-white">
              Add a stamp to my PDF
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
