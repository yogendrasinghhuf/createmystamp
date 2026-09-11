import Button from '../ui/Button'

export default function FinalCtaSection() {
  return (
    <section className="border-t border-line bg-ink py-20 text-paper">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-semibold">Ready to make your mark?</h2>
        <p className="mt-3 text-paper/70">
          Open Stamp Studio and have a finished design in minutes.
        </p>
        <a href="#editor" className="mt-8 inline-block">
          <Button variant="secondary">Open Stamp Studio</Button>
        </a>
      </div>
    </section>
  )
}
