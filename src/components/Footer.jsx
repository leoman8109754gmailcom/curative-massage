import { Logo, SmartLink } from './ui'

const links = [
  { label: 'Our services', href: '/services' },
  { label: 'Book now', href: '/book' },
  { label: 'Contact us', href: '/contact' },
]
const legal = ['Terms of service', 'Cookies settings']

export default function Footer() {
  return (
    <footer className="bg-slate-blue font-sans text-cream">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-12">
        <Logo className="justify-center" imgClassName="h-11 md:h-12" />

        <nav className="mt-10 text-sm">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map((l) => (
              <li key={l.label}><SmartLink href={l.href} className="hover:text-white">{l.label}</SmartLink></li>
            ))}
          </ul>
        </nav>

        <div className="mt-14 flex flex-col gap-4 border-t border-cream/20 pt-6 text-sm md:flex-row md:justify-between">
          <a href="#" className="hover:text-white">Privacy policy</a>
          <ul className="flex flex-wrap gap-6">
            {legal.map((l) => (
              <li key={l}><a href="#" className="hover:text-white">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
