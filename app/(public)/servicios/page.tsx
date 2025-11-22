import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Scale, FileText, Briefcase, Users, Shield, Home } from 'lucide-react'

const serviciosJudiciales = [
  {
    title: 'Causas Proteccionales y Violencia Intrafamiliar',
    description: 'Representación legal en casos de protección de menores y violencia intrafamiliar.',
    icon: Shield,
  },
  {
    title: 'Divorcios, Alimentos y Cuidado Personal',
    description: 'Asesoría y representación en procesos de divorcio, pensión alimenticia y cuidado personal de menores.',
    icon: Users,
  },
  {
    title: 'Causas Laborales',
    description: 'Representación en casos de despidos injustificados, tutela laboral, auto-despido y otros temas laborales.',
    icon: Briefcase,
  },
  {
    title: 'Representación en Causas Penales',
    description: 'Defensa penal profesional en diversas materias del derecho penal.',
    icon: Scale,
  },
  {
    title: 'Juicios de Responsabilidad Civil',
    description: 'Representación en procesos civiles y juicios de responsabilidad civil.',
    icon: FileText,
  },
]

const serviciosExtrajudiciales = [
  {
    title: 'Constitución de Empresas',
    description: 'Asesoría para la constitución de sociedades comerciales y otros tipos de empresas.',
    icon: Briefcase,
  },
  {
    title: 'Saneamiento de Propiedades',
    description: 'Asesoría y gestión para el saneamiento de títulos de propiedad.',
    icon: Home,
  },
  {
    title: 'Compraventa de Inmuebles',
    description: 'Asesoría legal completa para transacciones inmobiliarias.',
    icon: Home,
  },
  {
    title: 'Contratos de Promesa',
    description: 'Redacción y revisión de contratos de promesa de compraventa.',
    icon: FileText,
  },
  {
    title: 'Estudios de Título',
    description: 'Análisis y estudios de títulos de propiedad.',
    icon: FileText,
  },
  {
    title: 'Otros',
    description: 'Asesoría legal en otras materias según sus necesidades.',
    icon: Scale,
  },
]

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="section-padding bg-gradient-to-b from-primary to-primary-dark text-secondary">
        <div className="section-container text-center space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight">
            Nuestros Servicios
          </h1>
          <div className="w-24 h-1 bg-secondary mx-auto opacity-60 my-6"></div>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 font-light leading-relaxed">
            Ofrecemos servicios legales especializados en áreas judiciales y extrajudiciales
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container space-y-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4 tracking-tight">Servicios Judiciales</h2>
            <div className="w-24 h-1 bg-primary mb-12"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-children">
              {serviciosJudiciales.map((servicio, index) => (
                <Card 
                  key={servicio.title} 
                  className="border-2 card-hover hover:border-primary/50 cursor-pointer group overflow-hidden"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={[
                        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                        "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80",
                        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                        "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
                      ][index % 5]}
                      alt={servicio.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent"></div>
                  </div>
                  <CardHeader>
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 icon-hover w-fit mb-4">
                      <servicio.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-serif group-hover:text-primary transition-colors duration-300">
                      {servicio.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base group-hover:text-gray-900 transition-colors duration-300">
                      {servicio.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4 tracking-tight">Servicios Extrajudiciales</h2>
            <div className="w-24 h-1 bg-primary mb-12"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-children">
              {serviciosExtrajudiciales.map((servicio, index) => (
                <Card 
                  key={servicio.title} 
                  className="border-2 card-hover hover:border-primary/50 cursor-pointer group overflow-hidden"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={[
                        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                        "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
                      ][index % 6]}
                      alt={servicio.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent"></div>
                  </div>
                  <CardHeader>
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 icon-hover w-fit mb-4">
                      <servicio.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-serif group-hover:text-primary transition-colors duration-300">
                      {servicio.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base group-hover:text-gray-900 transition-colors duration-300">
                      {servicio.description}
                    </CardDescription>
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

