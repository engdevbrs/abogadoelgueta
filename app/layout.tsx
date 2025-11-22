import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from './providers'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Abogado Elgueta - Asesoría Legal Profesional',
  description: 'Abogado, altamente motivado por la satisfacción de sus clientes. Comprometido laboralmente y dispuesto siempre a obtener soluciones efectivas en el desarrollo de las gestiones encomendadas.',
  keywords: ['abogado', 'asesoría legal', 'derecho', 'consultoría jurídica', 'Chile'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

