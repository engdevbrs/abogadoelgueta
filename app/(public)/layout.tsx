'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toaster'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 400)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      <Header />
      <main className={`min-h-screen ${isAnimating ? 'animate-pageTransition' : ''}`}>
        {children}
      </main>
      <Footer />
      <Toaster />
    </>
  )
}

