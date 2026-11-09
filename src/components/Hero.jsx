import { Button, ImageSlot } from './ui'
import heroImage from '../assets/hero.webp'

export default function Hero() {
  return (
    <section className="relative min-h-[560px] overflow-hidden lg:min-h-[640px]">
      {/* scale-[1.02] trims the thin dark edge baked into the photo */}
      <ImageSlot
        src={heroImage}
        alt="Lit candles, an essential oil bottle and a folded towel"
        className="absolute inset-0 h-full w-full scale-[1.02] object-[60%_center]"
      />
      {/* Photo is already dark: keep the overlay light, just enough for the text */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/5 to-black/20" />

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
