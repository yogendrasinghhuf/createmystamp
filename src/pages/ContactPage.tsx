// src/pages/ContactPage.tsx
import { useState, type FormEvent } from 'react'
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'
import Button from '../components/ui/Button'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const subject = `${BRAND.name} enquiry from ${name || 'a visitor'}`
    const body = [`Name: ${name}`, `Email: ${email}`, '', message].join('\n')
    window.location.href = `mailto:${BRAND.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <PageShell
      title={`Contact Us - ${BRAND.name}`}
      description={`Get in touch with the ${BRAND.name} team for support with the online stamp maker or adding a stamp to your PDF. Support hours ${BRAND.supportHours}.`}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Contact us</h1>
        <p className="mt-4 text-ink/70">
          Questions about designing a stamp, using a template, adding a stamp to a PDF, or a
          download? Send us a message and we&rsquo;ll get back to you.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_260px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-ink/70">Your name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-lg border border-line bg-paper px-3 py-2 text-ink focus:border-accent focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-ink/70">Your email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg border border-line bg-paper px-3 py-2 text-ink focus:border-accent focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-ink/70">Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="rounded-lg border border-line bg-paper px-3 py-2 text-ink focus:border-accent focus:outline-none"
              />
            </label>
            <div>
              <Button type="submit">Send message</Button>
            </div>
            <p className="text-xs text-ink/50">
              Sending opens your email app with the message pre-filled, addressed to{' '}
              {BRAND.contactEmail}.
            </p>
          </form>

          <aside className="rounded-xl2 border border-line bg-paper p-5 text-sm shadow-card">
            <h2 className="font-semibold text-ink">Support hours</h2>
            <p className="mt-1 text-ink/70">{BRAND.supportHours}</p>
            <h2 className="mt-5 font-semibold text-ink">Email</h2>
            <a href={`mailto:${BRAND.contactEmail}`} className="mt-1 block break-all text-accent hover:underline">
              {BRAND.contactEmail}
            </a>
          </aside>
        </div>
      </div>
    </PageShell>
  )
}
