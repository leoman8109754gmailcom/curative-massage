const testimonials = [
  {
    quote: 'The tension I carried for years simply left my shoulders.',
    name: 'Sarah Mitchell',
    role: 'Teacher, Austin',
  },
  {
    quote: 'I came back because nothing else touches the pain like this does.',
    name: 'James Rodriguez',
    role: 'Construction worker, Dallas',
  },
  {
    quote: 'Finally, a place that understands what my body actually needs.',
    name: 'Elena Vasquez',
    role: 'Runner, Houston',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-cream py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-display text-3xl uppercase tracking-wide md:text-4xl">What clients say</h2>
        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-slate-blue/50">Real words from real people</p>

        <div className="mt-16 grid gap-14 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col items-center">
              {/* Source/platform logo slot */}
              <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-slate-blue/40">Review</span>
              <blockquote className="mt-4 max-w-[250px] text-sm uppercase leading-relaxed tracking-[0.06em]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex flex-col items-center">
                {/* Avatar placeholder — replace with client photo */}
                <span className="img-placeholder h-10 w-10 rounded-full" />
                <span className="mt-3 text-[10px] uppercase tracking-[0.12em]">{t.name}</span>
                <span className="text-[10px] uppercase tracking-[0.12em] text-slate-blue/70">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
