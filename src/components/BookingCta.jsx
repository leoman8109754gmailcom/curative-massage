import { Button, ImageSlot } from './ui'
import studioImage from '../assets/studio.webp'

export default function BookingCta() {
  return (
    <section id="book">
      <div className="bg-slate-blue px-6 py-20 text-center text-cream">
        <h2 className="font-display text-3xl uppercase tracking-wide text-cream-light md:text-4xl">
          Your next session waits
        </h2>
        <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-cream/80">
          Stop carrying what you were never meant to hold. Book your time with us.
        </p>
        <Button href="/#book" variant="cream" className="mt-6 bg-white px-3 py-1">Book</Button>
      </div>

      <ImageSlot
        src={studioImage}
        alt="Massage table in a warmly lit treatment room with salt lamps and plants"
        className="block h-[360px] w-full object-[45%_center] md:h-auto md:aspect-[16/9]"
      />
    </section>
  )
}
