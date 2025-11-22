'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/dashboard/login' })
  }

  return (
    <nav className="bg-primary text-secondary border-b border-primary-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/dashboard" className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-lg sm:text-xl font-semibold whitespace-nowrap tracking-tight">
                Abogado Elgueta
              </span>
              <span className="text-xs sm:text-sm opacity-75 hidden sm:inline font-normal">Admin</span>
            </Link>
          </div>

          {/* Menú desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-2 lg:space-x-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-secondary/20 text-secondary'
                        : 'text-secondary/80 hover:bg-secondary/10 hover:text-secondary'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-secondary hover:bg-secondary/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Cerrar Sesión</span>
              <span className="lg:hidden">Salir</span>
            </Button>
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-secondary hover:bg-secondary/10 p-2"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-secondary hover:bg-secondary/10 p-2"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary-dark animate-slideIn">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors',
                    isActive
                      ? 'bg-secondary/20 text-secondary'
                      : 'text-secondary/80 hover:bg-secondary/10 hover:text-secondary'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            <button
              onClick={() => {
                handleSignOut()
                setMobileMenuOpen(false)
              }}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-secondary/80 hover:bg-secondary/10 hover:text-secondary w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

