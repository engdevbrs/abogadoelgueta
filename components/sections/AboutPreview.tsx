import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AboutPreview() {
  return (
      <section id="quienes-somos" className="section-padding bg-white">
        <div className="section-container">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="flex justify-start lg:justify-start items-center">
              <div className="relative w-[280px] h-[280px] lg:w-[490px] lg:h-[490px] rounded-lg overflow-hidden shadow-2xl group">
                <Image
                  src="/assets/images/adrian_profile.jpeg"
                  alt="Adrián Elgueta - Abogado"
                  fill
                  className="object-cover object-top lg:object-center transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary tracking-tight mb-6">
                  Quiénes Somos
                </h2>
                <div className="w-24 h-1 bg-primary mb-8"></div>
              </div>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
                Abogado altamente motivado por la satisfacción de sus clientes. Comprometido laboralmente 
                y dispuesto siempre a obtener soluciones efectivas en el desarrollo de las gestiones encomendadas.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
                Nuestra misión es brindar asesoría legal de excelencia, con un enfoque profesional, 
                ético y orientado a resultados que garanticen la satisfacción y confianza de nuestros clientes.
              </p>
              <Link href="/quienes-somos">
                <Button size="lg" className="mt-4 px-8 py-6 text-lg font-medium">Conoce Más</Button>
              </Link>
            </div>
          <Card className="border-2 border-gray-200 card-hover hover:border-primary/50 cursor-pointer group animate-fadeInUp bg-white shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl font-serif group-hover:text-primary transition-colors duration-300">
                Compromiso con la Excelencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Nuestros Valores</h3>
                <ul className="space-y-2 text-gray-700">
                  {[
                    'Profesionalismo y ética en cada gestión',
                    'Compromiso con la satisfacción del cliente',
                    'Búsqueda constante de soluciones efectivas',
                    'Transparencia y comunicación clara',
                  ].map((item, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-2 transition-all duration-200 hover:translate-x-2"
                    >
                      <span className="text-primary mt-1">•</span>
                      <span className="group-hover:text-gray-900 transition-colors duration-200">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

