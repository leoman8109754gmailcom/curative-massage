import { Button, Chevron } from './ui'

const services = [
  {
    title: 'Deep Tissue',
    text: 'Deep tissue work that finds the knots and unknots them, releasing what your muscles have been holding onto.',
  },
  {
    title: 'Sports',
    text: 'Sports massage for athletes who demand more from their bodies and need recovery that matches their intensity.',
  },
  {
    title: 'Swedish',
    text: 'Therapeutic touch designed for chronic pain, injury, and the slow work of bringing damaged tissue back to life.',
  },
]

function HandIcon() {
  // Placeholder icon — swap for the real icon set later.
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M5 20c3-1 6-1 9 0l7 2c2 .5 3 2 2 3l-1 1H11" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15c0-4 3-8 8-8s7 3 7 6-3 5-6 5" strokeLinecap="round" />
      <path d="M14 13c1-2 3-2 4-1" strokeLinecap="round" />
    </svg>
  )
}

export default function Services() {
  return (
    <section id="services" className="bg-cream py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-display text-3xl uppercase leading-snug tracking-wide md:text-4xl">
          Different massages for
          <br />
          your different needs
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[11px] uppercase leading-relaxed tracking-[0.1em] text-slate-blue/80">
          Long flowing movements wake sleeping muscles and bring blood back where it's
          needed. The body remembers what ease feels like. Here are some of the most
          popular massages.
        </p>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {services.map((s) => (
            <article key={s.title} className="flex flex-col items-center">
              <HandIcon />
              <h3 className="mt-4 font-display text-2xl uppercase tracking-wide">{s.title}</h3>
              <p className="mt-4 max-w-[260px] text-[10px] uppercase leading-relaxed tracking-[0.1em] text-slate-blue/75">
                {s.text}
              </p>
            </article>
          ))}
        </div>

        <Button href="/services" variant="clay" className="mt-16 rounded-full">
          Explore more <Chevron />
        </Button>
      </div>
    </section>
  )
}
