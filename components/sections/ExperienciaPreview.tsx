import Link from 'next/link'
import { Award, Users, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const experiencias = [
  {
    title: 'Experiencia Comprobada',
    description: 'Años de trayectoria en el ámbito legal',
    icon: Award,
    details: 'Amplia experiencia en diversas áreas del derecho, tanto en el ámbito judicial como extrajudicial.',
  },
  {
    title: 'Clientes Satisfechos',
    description: 'Compromiso con la excelencia',
    icon: Users,
    details: 'Enfoque centrado en la satisfacción y confianza de nuestros clientes.',
  },
  {
    title: 'Resultados Efectivos',
    description: 'Soluciones que funcionan',
    icon: CheckCircle,
    details: 'Búsqueda constante de soluciones efectivas para cada caso.',
  },
]

export function ExperienciaPreview() {
  return (
      <section id="experiencia" className="section-padding bg-gradient-to-b from-gray-50/50 to-white">
        <div className="section-container">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary tracking-tight">
              Nuestra Experiencia
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Conoce más sobre nuestra trayectoria y compromiso con la excelencia
            </p>
          </div>

        <div className="grid gap-8 md:grid-cols-3 stagger-children">
          {experiencias.map((experiencia) => (
            <Card 
              key={experiencia.title} 
              className="text-center border-2 card-hover hover:border-primary/50 cursor-pointer group"
            >
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 icon-hover group-hover:scale-110">
                    <experiencia.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                  {experiencia.title}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-700 transition-colors duration-300">
                  {experiencia.description}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  {experiencia.details}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/experiencia">
            <Button size="lg">Conoce Nuestra Experiencia</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

