import { Button, ImageSlot } from './ui'

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

      <ImageSlot src={null} alt="Massage table in a calm treatment room" label="Studio image" className="h-[320px] w-full md:h-[480px]" />
    </section>
  )
}
