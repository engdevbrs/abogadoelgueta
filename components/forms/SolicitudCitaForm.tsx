'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { MotivoConsulta } from '@/types'
import { DateTimePicker } from './DateTimePicker'

const motivoConsultaOptions: { value: MotivoConsulta; label: string }[] = [
  { value: 'Responsabilidad Civil', label: 'Responsabilidad Civil' },
  { value: 'Accidentes Del Trabajo Y Enfermedades Laborales', label: 'Accidentes Del Trabajo Y Enfermedades Laborales' },
  { value: 'Defensa En Procesos Por Deudas Civiles', label: 'Defensa En Procesos Por Deudas Civiles' },
  { value: 'Asesoria Empresas', label: 'Asesoría Empresas' },
  { value: 'Otra Consulta Legal', label: 'Otra Consulta Legal' },
]

const solicitudCitaSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  motivoConsulta: z.string().min(1, 'Debes seleccionar un motivo de consulta'),
  fechaHora: z.string().min(1, 'Debes seleccionar una fecha y hora para la consulta'),
  mensaje: z.string().optional(),
})

type SolicitudCitaFormData = z.infer<typeof solicitudCitaSchema>

export function SolicitudCitaForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<SolicitudCitaFormData>({
    resolver: zodResolver(solicitudCitaSchema),
  })

  const motivoConsulta = watch('motivoConsulta')
  const fechaHora = watch('fechaHora')

  const onSubmit = async (data: SolicitudCitaFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          fechaSolicitada: data.fechaHora,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al enviar la solicitud')
      }

      toast({
        title: 'Solicitud enviada',
        description: 'Tu solicitud ha sido recibida. Te enviaremos un correo de confirmación.',
      })

      reset()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al enviar tu solicitud. Por favor, intenta nuevamente.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg text-left">
      <div className="space-y-2">
        <Label htmlFor="nombre" className="text-gray-700 font-semibold block text-left">
          Nombre completo <span className="text-primary">*</span>
        </Label>
        <Input
          id="nombre"
          {...register('nombre')}
          placeholder="Ingresa tu nombre completo"
          className="text-gray-900 bg-white"
        />
        {errors.nombre && (
          <p className="text-sm text-destructive">{errors.nombre.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 font-semibold block text-left">
          Email <span className="text-primary">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="tu@email.com"
          className="text-gray-900 bg-white"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono" className="text-gray-700 font-semibold block text-left">
          Teléfono <span className="text-gray-500 text-sm font-normal">(Opcional)</span>
        </Label>
        <Input
          id="telefono"
          type="tel"
          {...register('telefono')}
          placeholder="+56 9 1234 5678"
          className="text-gray-900 bg-white"
        />
        {errors.telefono && (
          <p className="text-sm text-destructive">{errors.telefono.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivoConsulta" className="text-gray-700 font-semibold block text-left">
          Motivo de tu consulta <span className="text-primary">*</span>
        </Label>
        <Select
          value={motivoConsulta || undefined}
          onValueChange={(value) => {
            setValue('motivoConsulta', value, { shouldValidate: true })
          }}
        >
          <SelectTrigger id="motivoConsulta" className="w-full text-gray-900 bg-white [&>span]:!text-gray-900">
            <SelectValue placeholder="Selecciona el motivo de tu consulta" />
          </SelectTrigger>
          <SelectContent className="z-[100] bg-white border-gray-200 shadow-lg">
            {motivoConsultaOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="cursor-pointer hover:bg-gray-100">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.motivoConsulta && (
          <p className="text-sm text-destructive">{errors.motivoConsulta.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <DateTimePicker
          value={fechaHora}
          onChange={(value) => {
            setValue('fechaHora', value || '', { shouldValidate: true })
          }}
          error={errors.fechaHora?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mensaje" className="text-gray-700 font-semibold block text-left">
          Mensaje adicional <span className="text-gray-500 text-sm font-normal">(Opcional)</span>
        </Label>
        <Textarea
          id="mensaje"
          {...register('mensaje')}
          placeholder="Cuéntanos más sobre tu consulta..."
          rows={4}
          className="text-gray-900 bg-white"
        />
        {errors.mensaje && (
          <p className="text-sm text-destructive">{errors.mensaje.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
      </Button>
    </form>
  )
}

