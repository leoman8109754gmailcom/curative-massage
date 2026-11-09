import TreatmentsPanel from '../components/TreatmentsPanel'

export default function ServicesPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-cream px-6 pt-28 pb-20 text-center md:pt-32">
        <h1 className="font-display text-4xl uppercase tracking-wide md:text-6xl">Massage Services</h1>
        <p className="mx-auto mt-8 max-w-xl text-sm uppercase leading-relaxed tracking-[0.08em] text-slate-blue/85">
          Discover therapeutic treatments designed to restore balance and ease tension from your body
        </p>
      </section>

      {/* Treatments */}
      <section id="treatments" className="bg-cream px-6 pt-16 pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-blue/75">Treatments</p>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl uppercase leading-tight tracking-wide md:text-5xl">
              Five paths to healing and renewal
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm uppercase leading-relaxed tracking-[0.08em] text-slate-blue/85">
              Each service is crafted with intention and skill. I listen to what your body needs and
              deliver care that matters. Choose the treatment that calls to you.
            </p>
          </div>

          <div className="mt-16">
            <TreatmentsPanel />
          </div>
        </div>
      </section>
    </>
  )
}
