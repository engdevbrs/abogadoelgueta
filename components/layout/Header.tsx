'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Servicios', href: '/servicios' },
  { name: 'Quiénes Somos', href: '/quienes-somos' },
  { name: 'Experiencia', href: '/experiencia' },
  { name: 'Contacto', href: '/contacto' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/98 backdrop-blur-md supports-[backdrop-filter]:bg-white/95 shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 group">
            <span className="text-2xl font-serif font-bold text-primary tracking-tight group-hover:text-primary-dark transition-colors duration-200">
              Abogado Elgueta
            </span>
            {/* TODO: Agregar logo aquí cuando esté disponible */}
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Abrir menú principal</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-10 xl:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium leading-6 text-gray-700 hover:text-primary transition-all duration-300 relative group uppercase tracking-wide"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="/#solicitar-consulta">
            <Button className="px-6 py-2.5 font-medium tracking-wide">Solicitar Consulta</Button>
          </Link>
        </div>
      </nav>
      {/* Mobile menu */}
      <div className={cn(
        "lg:hidden",
        mobileMenuOpen ? "block" : "hidden"
      )}>
        <div className="space-y-2 px-4 pb-3 pt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/#solicitar-consulta"
            className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-primary hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Solicitar Consulta
          </Link>
        </div>
      </div>
    </header>
  )
}

