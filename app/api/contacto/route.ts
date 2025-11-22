import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNotificacionContactoEmail, sendConfirmacionContactoEmail } from '@/lib/email'
import { z } from 'zod'

const contactoSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().optional(),
  asunto: z.string().min(3),
  mensaje: z.string().min(10),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos
    const validatedData = contactoSchema.parse(body)

    // Crear el contacto en la base de datos
    const contacto = await prisma.contacto.create({
      data: {
        nombre: validatedData.nombre,
        email: validatedData.email,
        telefono: validatedData.telefono || null,
        asunto: validatedData.asunto,
        mensaje: validatedData.mensaje,
      },
    })

    // Enviar email de confirmación al usuario
    try {
      await sendConfirmacionContactoEmail(contacto.email, {
        nombre: contacto.nombre,
        asunto: contacto.asunto,
      })
    } catch (emailError) {
      console.error('Error enviando email de confirmación:', emailError)
      // No fallar la request si el email falla, pero loguear el error
    }

    // Enviar email de notificación al administrador
    try {
      await sendNotificacionContactoEmail({
        nombre: contacto.nombre,
        email: contacto.email,
        telefono: contacto.telefono,
        asunto: contacto.asunto,
        mensaje: contacto.mensaje,
        contactoId: contacto.id,
      })
    } catch (emailError) {
      console.error('Error enviando email de notificación al administrador:', emailError)
      // No fallar la request si el email falla, pero loguear el error
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mensaje enviado exitosamente',
        contactoId: contacto.id 
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creando contacto:', error)
    return NextResponse.json(
      { success: false, error: 'Error al procesar el mensaje' },
      { status: 500 }
    )
  }
}

