import { Button, ImageSlot } from './ui'

export default function Hero() {
  return (
    <section className="relative min-h-[560px] overflow-hidden lg:min-h-[640px]">
      {/* Background image — replace src when the hero photo is ready */}
      <ImageSlot src={null} alt="Candle, oil bottle and towel" label="Hero image" className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/30" />

      <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-between px-6 py-14 lg:min-h-[640px] lg:px-12">
        <p className="ml-auto max-w-sm text-right text-[11px] uppercase leading-relaxed tracking-[0.12em] text-cream-light/90 md:text-left">
          Step into stillness. Let tension dissolve under skilled hands trained to
          restore what stress has taken. Curative Massage and Bodyworks brings the
          quiet you need to Texas.
        </p>

        <div>
          <h1 className="font-display text-5xl leading-[1.1] tracking-wide text-cream-light uppercase md:text-6xl">
            Healing
            <br />
            Hands,
            <br />
            Peaceful
            <br />
            Moments
          </h1>
          <div className="mt-8 flex gap-3">
            <Button href="/#book" variant="cream">Book</Button>
            <Button href="/services" variant="blue">Learn</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
