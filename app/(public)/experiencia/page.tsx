import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, Briefcase, Users, CheckCircle, Target, BookOpen } from 'lucide-react'

const aspectos = [
  {
    title: 'Trayectoria Comprobada',
    description: 'Amplia experiencia en diversas áreas del derecho, tanto en el ámbito judicial como extrajudicial.',
    icon: Award,
  },
  {
    title: 'Enfoque en Resultados',
    description: 'Comprometidos con obtener soluciones efectivas para cada caso que manejamos.',
    icon: Target,
  },
  {
    title: 'Satisfacción del Cliente',
    description: 'Nuestro objetivo principal es la satisfacción y confianza de nuestros clientes.',
    icon: Users,
  },
  {
    title: 'Profesionalismo',
    description: 'Ética y profesionalismo en cada gestión legal que realizamos.',
    icon: Briefcase,
  },
  {
    title: 'Compromiso Laboral',
    description: 'Total dedicación y compromiso con cada caso que encomiendan nuestros clientes.',
    icon: CheckCircle,
  },
  {
    title: 'Actualización Continua',
    description: 'Mantenemos nuestros conocimientos actualizados para brindar el mejor servicio.',
    icon: BookOpen,
  },
]

export default function ExperienciaPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="section-padding bg-gradient-to-b from-primary to-primary-dark text-secondary">
        <div className="section-container text-center space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight">
            Nuestra Experiencia
          </h1>
          <div className="w-24 h-1 bg-secondary mx-auto opacity-60 my-6"></div>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 font-light leading-relaxed">
            Conoce más sobre nuestra trayectoria y compromiso con la excelencia
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-2xl group order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Experiencia legal"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
                Como abogado, me caracterizo por estar altamente motivado por la satisfacción de mis clientes. 
                Estoy comprometido laboralmente y dispuesto siempre a obtener soluciones efectivas en el desarrollo 
                de las gestiones encomendadas.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
                Nuestra experiencia abarca tanto el ámbito judicial como el extrajudicial, lo que nos permite 
                ofrecer una asesoría integral y completa a nuestros clientes.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-children">
            {aspectos.map((aspecto) => (
              <Card 
                key={aspecto.title} 
                className="border-2 card-hover hover:border-primary/50 cursor-pointer group"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 icon-hover group-hover:scale-110">
                      <aspecto.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-serif text-center group-hover:text-primary transition-colors duration-300">
                    {aspecto.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-center group-hover:text-gray-900 transition-colors duration-300">
                    {aspecto.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

