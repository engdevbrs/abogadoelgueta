'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Mail, Phone, MapPin } from 'lucide-react'

const contactoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  asunto: z.string().min(3, 'El asunto debe tener al menos 3 caracteres'),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

type ContactoFormData = z.infer<typeof contactoSchema>

export default function ContactoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactoFormData>({
    resolver: zodResolver(contactoSchema),
  })

  const onSubmit = async (data: ContactoFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje')
      }

      toast({
        title: 'Mensaje enviado',
        description: 'Tu mensaje ha sido recibido. Te contactaremos pronto.',
      })

      reset()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="section-padding bg-primary text-secondary">
        <div className="section-container text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Contacto</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Estamos aquí para ayudarte. Contáctanos y te responderemos a la brevedad.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="relative h-[400px] lg:h-full min-h-[500px] rounded-lg overflow-hidden shadow-2xl group hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1560264357-8d9202250f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Contacto legal"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="space-y-8">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Email</h3>
                      <p className="text-gray-600">contacto@abogadoelgueta.cl</p>
                      <p className="text-sm text-gray-500 mt-1">(Pendiente de configurar)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Teléfono</h3>
                      <p className="text-gray-600">+56 9 XXXX XXXX</p>
                      <p className="text-sm text-gray-500 mt-1">(Pendiente de configurar)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Ubicación</h3>
                      <p className="text-gray-600">Dirección de oficina</p>
                      <p className="text-sm text-gray-500 mt-1">(Pendiente de definir)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Envíanos un Mensaje</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo *</Label>
                    <Input
                      id="nombre"
                      {...register('nombre')}
                      placeholder="Ingresa tu nombre completo"
                    />
                    {errors.nombre && (
                      <p className="text-sm text-destructive">{errors.nombre.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono (Opcional)</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      {...register('telefono')}
                      placeholder="+56 9 1234 5678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asunto">Asunto *</Label>
                    <Input
                      id="asunto"
                      {...register('asunto')}
                      placeholder="Asunto de tu consulta"
                    />
                    {errors.asunto && (
                      <p className="text-sm text-destructive">{errors.asunto.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Mensaje *</Label>
                    <Textarea
                      id="mensaje"
                      {...register('mensaje')}
                      placeholder="Tu mensaje..."
                      rows={6}
                    />
                    {errors.mensaje && (
                      <p className="text-sm text-destructive">{errors.mensaje.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

