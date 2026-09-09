import { BRAND } from '../../config/brand'
import Button from '../ui/Button'

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
      <div>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          {BRAND.tagline}
        </h1>
        <p className="mt-4 max-w-md text-lg text-ink/70">{BRAND.supportingCopy}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#editor">
            <Button>Open Stamp Studio</Button>
          </a>
          <a href="#templates">
            <Button variant="secondary">Browse Templates</Button>
          </a>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex h-64 w-64 items-center justify-center rounded-full border-2 border-ink/80 bg-paper shadow-md">
          <svg viewBox="-50 -50 100 100" width="80%" height="80%">
            <circle r={44} fill="none" stroke="#2B2A28" strokeWidth={1.2} />
            <path id="hero-arc" d="M -30 -20 A 34 34 0 1 1 30 -20" fill="none" />
            <text fontSize={5.5} fontWeight={700} letterSpacing={1.5} fill="#2B2A28">
              <textPath href="#hero-arc" startOffset="8%">
                NORTH &amp; PINE
              </textPath>
            </text>
            <text textAnchor="middle" y={4} fontSize={7} fontWeight={600} fill="#2B2A28">
              N&amp;P
            </text>
            <text textAnchor="middle" y={16} fontSize={3.6} letterSpacing={2} fill="#2B2A28">
              EST. 2026
            </text>
          </svg>
        </div>
      </div>
    </section>
  )
}
