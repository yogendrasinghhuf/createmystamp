import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function FinalCtaSection() {
  return (
    <section className="border-t border-line bg-ink py-20 text-paper">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-semibold">Ready to make your mark?</h2>
        <p className="mt-3 text-paper/70">
          Open Stamp Studio and have a finished design in minutes.
        </p>
        <Link to="/studio" className="mt-8 inline-block">
          <Button className="bg-paper text-ink hover:bg-accent hover:text-paper">
            Open Stamp Studio
          </Button>
        </Link>
      </div>
    </section>
  )
}
