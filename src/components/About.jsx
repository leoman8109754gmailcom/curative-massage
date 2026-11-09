import { Button, Chevron, ImageSlot } from './ui'

export default function About() {
  return (
    <section id="about" className="bg-slate-blue py-20 text-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2 lg:px-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cream/70">My foundation</p>
          <h2 className="mt-3 font-display text-4xl uppercase tracking-wide text-cream-light">About me</h2>
          <p className="mt-5 max-w-md text-[11px] uppercase leading-relaxed tracking-[0.1em] text-cream/85">
            Curative Massage and Bodyworks exists because I believe healing is not
            luxury but necessity.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <Button href="/contact" variant="blue" className="bg-white/10 hover:bg-white/15">Contact</Button>
            <Button href="/contact" variant="ghost">
              Connect <Chevron />
            </Button>
          </div>
        </div>

        <ImageSlot src={null} alt="Therapist with clients" label="About image" className="aspect-[4/3] w-full rounded-lg" />
      </div>
    </section>
  )
}
