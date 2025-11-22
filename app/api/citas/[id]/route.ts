import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendAprobacionCitaEmail } from '@/lib/email'
import { createGoogleMeetEvent } from '@/lib/google-calendar'
import { z } from 'zod'

const updateCitaSchema = z.object({
  estado: z.enum(['PENDIENTE', 'PAGO_PENDIENTE', 'APROBADA', 'RECHAZADA', 'COMPLETADA', 'CANCELADA']),
  googleMeetLink: z.string().optional(),
})

// GET - Obtener una cita específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const cita = await prisma.cita.findUnique({
      where: { id: params.id },
      include: {
        aprobadaPor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!cita) {
      return NextResponse.json(
        { success: false, error: 'Cita no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, cita })
  } catch (error) {
    console.error('Error obteniendo cita:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener la cita' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar una cita
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateCitaSchema.parse(body)

    const cita = await prisma.cita.findUnique({
      where: { id: params.id },
    })

    if (!cita) {
      return NextResponse.json(
        { success: false, error: 'Cita no encontrada' },
        { status: 404 }
      )
    }

    let googleMeetLink = validatedData.googleMeetLink
    let updateData: any = {
      estado: validatedData.estado,
    }

    // Si se aprueba la cita, generar link de Google Meet
    if (validatedData.estado === 'APROBADA' && !googleMeetLink) {
      // Verificar si Google Calendar API está configurado
      const hasGoogleConfig = 
        process.env.GOOGLE_CLIENT_ID && 
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.GOOGLE_ACCESS_TOKEN &&
        process.env.GOOGLE_REFRESH_TOKEN

      if (hasGoogleConfig) {
        try {
          const startTime = cita.fechaSolicitada 
            ? new Date(cita.fechaSolicitada)
            : new Date(Date.now() + 24 * 60 * 60 * 1000) // Si no hay fecha, mañana
          
          const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hora después

          const meetEvent = await createGoogleMeetEvent({
            summary: `Consulta Legal: ${cita.motivoConsulta}`,
            description: `Consulta legal solicitada por ${cita.nombre}`,
            startTime,
            endTime,
            attendeeEmail: cita.email,
            attendeeName: cita.nombre,
          })

          googleMeetLink = meetEvent.meetLink
          updateData.googleMeetLink = googleMeetLink
        } catch (error) {
          console.error('Error generando Google Meet link con API:', error)
          // Si falla, el administrador deberá agregar el enlace manualmente
          // No generamos un enlace falso, mejor que lo agregue manualmente
        }
      } else {
        console.warn('Google Calendar API no está configurado. El administrador debe agregar el enlace de Google Meet manualmente.')
        // El administrador puede agregar el enlace manualmente a través del campo googleMeetLink
      }
    }

    // Si se aprueba la cita, actualizar fecha de aprobación y quien aprobó
    if (validatedData.estado === 'APROBADA') {
      updateData.aprobadaAt = new Date()
      updateData.aprobadaPorId = session.user.id
    }

    const updatedCita = await prisma.cita.update({
      where: { id: params.id },
      data: updateData,
      include: {
        aprobadaPor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Si se aprobó la cita, enviar email de aprobación
    if (validatedData.estado === 'APROBADA' && googleMeetLink) {
      try {
        await sendAprobacionCitaEmail(cita.email, {
          nombre: cita.nombre,
          motivoConsulta: cita.motivoConsulta,
          googleMeetLink,
          fechaSolicitada: cita.fechaSolicitada,
        })
      } catch (emailError) {
        console.error('Error enviando email de aprobación:', emailError)
        // No fallar la request si el email falla
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Cita actualizada exitosamente',
      cita: updatedCita,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error actualizando cita:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la cita' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar una cita
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    await prisma.cita.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Cita eliminada exitosamente',
    })
  } catch (error) {
    console.error('Error eliminando cita:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar la cita' },
      { status: 500 }
    )
  }
}

