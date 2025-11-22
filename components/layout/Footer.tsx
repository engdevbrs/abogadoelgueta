import Link from 'next/link'

const navigation = {
  main: [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Quiénes Somos', href: '/quienes-somos' },
    { name: 'Experiencia', href: '/experiencia' },
    { name: 'Contacto', href: '/contacto' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-primary text-secondary border-t border-primary-dark/20">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-16 sm:py-20 lg:px-12">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12 lg:space-x-16" aria-label="Footer">
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6">
              <Link href={item.href} className="text-sm font-medium leading-6 hover:text-secondary/90 transition-colors duration-200 uppercase tracking-wide">
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className="mt-12 pt-8 border-t border-secondary/10">
          <p className="text-center text-sm leading-6 opacity-90 font-light">
            &copy; {new Date().getFullYear()} Abogado Elgueta. Todos los derechos reservados.
          </p>
          <p className="mt-4 text-center text-xs leading-6 opacity-70 font-light max-w-2xl mx-auto">
            Abogado, altamente motivado por la satisfacción de sus clientes. Comprometido laboralmente y dispuesto siempre a obtener soluciones efectivas.
          </p>
        </div>
      </div>
    </footer>
  )
}

