import { Hero } from '@/components/layout/Hero'
import { ServiciosPreview } from '@/components/sections/ServiciosPreview'
import { AboutPreview } from '@/components/sections/AboutPreview'
import { ExperienciaPreview } from '@/components/sections/ExperienciaPreview'
import { SolicitudCitaForm } from '@/components/forms/SolicitudCitaForm'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiciosPreview />
      <AboutPreview />
      <ExperienciaPreview />
      <section id="solicitar-consulta" className="section-padding bg-gradient-to-b from-primary to-primary-dark text-secondary animate-scaleIn">
        <div className="section-container text-center space-y-8">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 tracking-tight">
              Solicita una Consulta
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto opacity-60 mb-8"></div>
          </div>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 font-light leading-relaxed">
            ¿Necesitas asesoría legal? Completa el formulario y te contactaremos para coordinar una cita.
          </p>
          <div className="max-w-2xl mx-auto mt-12">
            <SolicitudCitaForm />
          </div>
        </div>
      </section>
    </>
  )
}

