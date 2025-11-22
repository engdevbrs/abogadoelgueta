import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, Target, Users, CheckCircle } from 'lucide-react'

const valores = [
  {
    title: 'Profesionalismo',
    description: 'Ética y profesionalismo en cada gestión legal que realizamos.',
    icon: Award,
  },
  {
    title: 'Compromiso',
    description: 'Comprometidos con la satisfacción y éxito de nuestros clientes.',
    icon: Target,
  },
  {
    title: 'Experiencia',
    description: 'Amplia experiencia en diversas áreas del derecho.',
    icon: Users,
  },
  {
    title: 'Resultados',
    description: 'Búsqueda constante de soluciones efectivas para cada caso.',
    icon: CheckCircle,
  },
]

export default function QuienesSomosPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="section-padding bg-gradient-to-b from-primary to-primary-dark text-secondary">
        <div className="section-container text-center space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight">
            Quiénes Somos
          </h1>
          <div className="w-24 h-1 bg-secondary mx-auto opacity-60 my-6"></div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container space-y-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-2xl group order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Estudio legal profesional"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
                Abogado altamente motivado por la satisfacción de sus clientes. Comprometido laboralmente 
                y dispuesto siempre a obtener soluciones efectivas en el desarrollo de las gestiones encomendadas.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
                Nuestra misión es brindar asesoría legal de excelencia, con un enfoque profesional, 
                ético y orientado a resultados que garanticen la satisfacción y confianza de nuestros clientes.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4 text-center tracking-tight">Nuestros Valores</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 stagger-children">
              {valores.map((valor) => (
                <Card 
                  key={valor.title} 
                  className="border-2 card-hover hover:border-primary/50 cursor-pointer text-center group"
                >
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 icon-hover group-hover:scale-110">
                        <valor.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-serif group-hover:text-primary transition-colors duration-300">
                      {valor.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                      {valor.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

