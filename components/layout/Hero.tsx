import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-primary to-primary-dark text-secondary min-h-[85vh] flex items-center overflow-hidden">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
          alt="Oficina legal profesional"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/90 to-primary-dark/95"></div>
      </div>
      <div className="section-padding relative z-10 w-full">
        <div className="section-container">
          <div className="mx-auto max-w-4xl text-center space-y-10 animate-fadeIn">
            <h1 className="text-5xl font-serif font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl animate-fadeInDown leading-tight">
              Asesoría Legal
              <span className="block mt-2">Profesional</span>
            </h1>
            <p className="text-xl sm:text-2xl leading-relaxed text-secondary/90 max-w-3xl mx-auto animate-fadeInUp font-light tracking-wide">
              Abogado altamente motivado por la satisfacción de sus clientes. 
              Comprometido laboralmente y dispuesto siempre a obtener soluciones efectivas 
              en el desarrollo de las gestiones encomendadas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 animate-scaleIn">
              <Link href="/#solicitar-consulta">
                <Button size="lg" variant="secondary" className="min-w-[220px] text-lg px-10 py-7 bg-white text-primary font-semibold hover:bg-white/95 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border-0">
                  Solicitar Consulta
                </Button>
              </Link>
              <Link href="/servicios">
                <Button size="lg" variant="outline" className="min-w-[220px] text-lg px-10 py-7 border-2 border-white/80 bg-transparent text-white backdrop-blur-sm hover:bg-white/10 hover:border-white hover:text-white hover:scale-105 transition-all duration-300">
                  Ver Servicios
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

