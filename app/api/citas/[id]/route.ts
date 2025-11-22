import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendAprobacionCitaEmail, sendPagoPendienteCitaEmail } from '@/lib/email'
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

          // Agregar adrianep@elguetabogado.cl como asistente adicional
          // adelguetap@gmail.com NO se agrega como asistente, solo es el organizador que crea el evento
          const adminEmail = process.env.ADMIN_EMAIL || 'adrianep@elguetabogado.cl'
          
          const meetEvent = await createGoogleMeetEvent({
            summary: `Consulta Legal: ${cita.motivoConsulta}`,
            description: `Consulta legal solicitada por ${cita.nombre}`,
            startTime,
            endTime,
            attendeeEmail: cita.email,
            attendeeName: cita.nombre,
            additionalAttendees: [
              adminEmail, // adrianep@elguetabogado.cl debe recibir la invitación
              // NOTA: adelguetap@gmail.com no se agrega aquí, solo es el organizador que crea y envía las invitaciones
            ],
          })

          googleMeetLink = meetEvent.meetLink
          updateData.googleMeetLink = googleMeetLink
          updateData.googleEventId = meetEvent.eventId
          updateData.googleHtmlLink = meetEvent.htmlLink
          
          console.log('✅ Evento de Google Calendar creado exitosamente')
          console.log('Event ID:', meetEvent.eventId)
          console.log('HTML Link:', meetEvent.htmlLink)
        } catch (error: any) {
          console.error('❌ Error creando evento de Google Meet:', error)
          console.error('Error message:', error?.message)
          console.error('Error code:', error?.code)
          if (error?.response) {
            console.error('Error response:', JSON.stringify(error.response.data, null, 2))
            console.error('Error status:', error.response.status)
          }
          
          // Si el error es de autenticación, intentar refrescar tokens
          if (error?.code === 401 || error?.message?.includes('unauthorized') || error?.message?.includes('invalid_grant')) {
            console.error('⚠️ Error de autenticación detectado. Los tokens pueden haber expirado.')
            console.error('⚠️ Necesitas regenerar los tokens de Google OAuth.')
          }
          
          // Generar link simple como fallback
          const { generateGoogleMeetLink } = await import('@/lib/google-calendar')
          googleMeetLink = generateGoogleMeetLink()
          updateData.googleMeetLink = googleMeetLink
          console.warn('⚠️ Usando link simple de Google Meet como fallback (evento no creado en calendario)')
        }
      } else {
        console.warn('Google Calendar API no está configurado. El administrador debe agregar el enlace de Google Meet manualmente.')
        // No generamos link temporal, el administrador debe agregarlo manualmente
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

    // Si se marca como Pago Pendiente, enviar email de recordatorio de pago
    if (validatedData.estado === 'PAGO_PENDIENTE') {
      try {
        await sendPagoPendienteCitaEmail(cita.email, {
          nombre: cita.nombre,
          motivoConsulta: cita.motivoConsulta,
          fechaSolicitada: cita.fechaSolicitada,
        })
      } catch (emailError) {
        console.error('Error enviando email de pago pendiente:', emailError)
        // No fallar la request si el email falla, pero loguear el error
      }
    }

    // Si se aprobó la cita, enviar email de aprobación
    if (validatedData.estado === 'APROBADA') {
      try {
        // Enviar email siempre, con o sin link de Google Meet
        // Si no hay link, el email se enviará sin la sección del link
        // y el administrador puede agregarlo después y reenviar el email si es necesario
        await sendAprobacionCitaEmail(cita.email, {
          nombre: cita.nombre,
          motivoConsulta: cita.motivoConsulta,
          googleMeetLink: googleMeetLink || '', // Enviar string vacío si no hay link, el email lo manejará
          fechaSolicitada: cita.fechaSolicitada,
        })
      } catch (emailError) {
        console.error('Error enviando email de aprobación:', emailError)
        // No fallar la request si el email falla, pero loguear el error
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

