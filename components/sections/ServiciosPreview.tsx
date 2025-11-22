import Link from 'next/link'
import { SafeImage } from '@/components/ui/safe-image'
import { Scale, Briefcase, FileText, Building2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const servicios = [
  {
    title: 'Servicios Judiciales',
    description: 'Representación legal en diversas áreas del derecho',
    icon: Scale,
    items: [
      'Causas proteccionales y violencia intrafamiliar',
      'Divorcios, alimentos y cuidado personal',
      'Causas laborales y despidos injustificados',
      'Representación en causas penales',
      'Juicios de responsabilidad civil',
    ],
  },
  {
    title: 'Servicios Extrajudiciales',
    description: 'Asesoría y gestión documental legal',
    icon: FileText,
    items: [
      'Constitución de empresas',
      'Saneamiento de propiedades',
      'Compraventa de inmuebles',
      'Contratos de promesa',
      'Estudios de título',
    ],
  },
]

export function ServiciosPreview() {
  return (
      <section id="servicios" className="section-padding bg-gradient-to-b from-white to-gray-50/50">
        <div className="section-container">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary tracking-tight">
              Nuestros Servicios
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Ofrecemos servicios legales especializados en áreas judiciales y extrajudiciales
            </p>
          </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12 stagger-children">
          {servicios.map((servicio, index) => (
            <Card 
              key={servicio.title} 
              className="border-2 card-hover hover:border-primary/50 cursor-pointer group overflow-hidden"
            >
              <div className="relative h-48 w-full bg-gray-200">
                <SafeImage
                  src={index === 0 
                    ? "/assets/images/servicios/preview/servicios-preview-judiciales.jpg"
                    : "/assets/images/servicios/preview/servicios-preview-extrajudiciales.jpg"
                  }
                  fallbackSrc={index === 0 
                    ? "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                    : "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  }
                  alt={servicio.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent"></div>
              </div>
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 icon-hover">
                    <servicio.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-serif group-hover:text-primary transition-colors duration-300">
                    {servicio.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-base">{servicio.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {servicio.items.map((item, index) => (
                    <li 
                      key={index} 
                      className="flex items-start gap-2 transition-all duration-200 hover:translate-x-2"
                    >
                      <span className="text-primary mt-1">•</span>
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/servicios">
            <Button size="lg">Ver Todos los Servicios</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

