import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendConfirmacionCitaEmail, sendNotificacionNuevaCitaEmail } from '@/lib/email'
import { z } from 'zod'

const solicitudCitaSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().optional(),
  motivoConsulta: z.string().min(1),
  mensaje: z.string().optional(),
  fechaSolicitada: z.string().min(1, 'Debes seleccionar una fecha y hora para la consulta'),
})

/**
 * Verifica si una fecha es día laborable (lunes a viernes)
 */
function esDiaLaborable(fecha: Date): boolean {
  const dia = fecha.getDay() // 0 = domingo, 6 = sábado
  return dia >= 1 && dia <= 5 // Lunes (1) a Viernes (5)
}

/**
 * Verifica si la hora está en el rango laboral (8 AM - 6 PM)
 */
function esHoraLaboral(fecha: Date): boolean {
  const hora = fecha.getHours()
  return hora >= 8 && hora < 18
}

/**
 * Verifica si la hora es múltiplo de 1 hora (8:00, 9:00, etc.)
 */
function esHoraExacta(fecha: Date): boolean {
  return fecha.getMinutes() === 0 && fecha.getSeconds() === 0
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos
    const validatedData = solicitudCitaSchema.parse(body)

    // Validar fecha y hora
    const fechaSolicitada = new Date(validatedData.fechaSolicitada)
    
    // Verificar que es día laborable
    if (!esDiaLaborable(fechaSolicitada)) {
      return NextResponse.json(
        { success: false, error: 'Solo se pueden agendar citas de lunes a viernes' },
        { status: 400 }
      )
    }
    
    // Verificar que está en horario laboral
    if (!esHoraLaboral(fechaSolicitada)) {
      return NextResponse.json(
        { success: false, error: 'El horario de atención es de 8:00 AM a 6:00 PM' },
        { status: 400 }
      )
    }
    
    // Verificar que es hora exacta
    if (!esHoraExacta(fechaSolicitada)) {
      return NextResponse.json(
        { success: false, error: 'Las citas deben ser en horas exactas (ej: 8:00, 9:00, 10:00)' },
        { status: 400 }
      )
    }
    
    // Verificar que no sea en el pasado
    const ahora = new Date()
    if (fechaSolicitada < ahora) {
      return NextResponse.json(
        { success: false, error: 'No se pueden agendar citas en el pasado' },
        { status: 400 }
      )
    }
    
    // Verificar disponibilidad - buscar citas aprobadas en el mismo horario
    const fechaInicio = new Date(fechaSolicitada)
    fechaInicio.setMinutes(0, 0, 0)
    const fechaFin = new Date(fechaInicio)
    fechaFin.setHours(fechaFin.getHours() + 1)
    
    const citaExistente = await prisma.cita.findFirst({
      where: {
        estado: 'APROBADA',
        fechaSolicitada: {
          gte: fechaInicio,
          lt: fechaFin,
        },
      },
    })
    
    if (citaExistente) {
      return NextResponse.json(
        { success: false, error: 'Ya existe una cita aprobada en este horario. Por favor, selecciona otro horario.' },
        { status: 400 }
      )
    }

    // Crear la cita en la base de datos
    const cita = await prisma.cita.create({
      data: {
        nombre: validatedData.nombre,
        email: validatedData.email,
        telefono: validatedData.telefono || null,
        motivoConsulta: validatedData.motivoConsulta,
        mensaje: validatedData.mensaje || null,
        fechaSolicitada: validatedData.fechaSolicitada 
          ? new Date(validatedData.fechaSolicitada) 
          : null,
        estado: 'PENDIENTE',
      },
    })

    // Enviar email de confirmación al cliente
    try {
      await sendConfirmacionCitaEmail(cita.email, {
        nombre: cita.nombre,
        motivoConsulta: cita.motivoConsulta,
      })
    } catch (emailError) {
      console.error('Error enviando email de confirmación:', emailError)
      // No fallar la request si el email falla, pero loguear el error
    }

    // Enviar email de notificación al administrador
    try {
      await sendNotificacionNuevaCitaEmail({
        nombre: cita.nombre,
        email: cita.email,
        telefono: cita.telefono,
        motivoConsulta: cita.motivoConsulta,
        mensaje: cita.mensaje,
        fechaSolicitada: cita.fechaSolicitada,
        citaId: cita.id,
      })
    } catch (emailError) {
      console.error('Error enviando email de notificación al administrador:', emailError)
      // No fallar la request si el email falla, pero loguear el error
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Solicitud de cita creada exitosamente',
        citaId: cita.id 
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

    console.error('Error creando solicitud de cita:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error al procesar la solicitud'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const estado = searchParams.get('estado')
    const nombre = searchParams.get('nombre') || ''
    const fechaDesde = searchParams.get('fechaDesde')
    const fechaHasta = searchParams.get('fechaHasta')
    const ordenarPor = searchParams.get('ordenarPor') || 'createdAt'
    const orden = searchParams.get('orden') || 'desc'
    const pagina = parseInt(searchParams.get('pagina') || '1', 10)
    const porPagina = parseInt(searchParams.get('porPagina') || '10', 10)

    // Construir condiciones WHERE
    const where: any = {}

    // Filtro por estado
    if (estado) {
      where.estado = estado
    }

    // Búsqueda por nombre (case-insensitive)
    // SQLite no soporta mode: 'insensitive' nativamente, así que lo manejamos de otra manera
    if (nombre.trim()) {
      where.nombre = {
        contains: nombre.trim(),
      }
    }

    // Filtro por fecha
    if (fechaDesde || fechaHasta) {
      where.createdAt = {}
      if (fechaDesde) {
        where.createdAt.gte = new Date(fechaDesde)
      }
      if (fechaHasta) {
        const fechaHastaFin = new Date(fechaHasta)
        fechaHastaFin.setHours(23, 59, 59, 999) // Incluir todo el día
        where.createdAt.lte = fechaHastaFin
      }
    }

    // Construir ordenamiento
    const orderBy: any = {}
    const camposPermitidos = ['createdAt', 'fechaSolicitada', 'nombre', 'estado']
    const ordenPermitido = orden === 'asc' ? 'asc' : 'desc'
    const campoOrden = camposPermitidos.includes(ordenarPor) ? ordenarPor : 'createdAt'
    orderBy[campoOrden] = ordenPermitido

    // Calcular paginación
    const skip = (pagina - 1) * porPagina
    const take = Math.min(porPagina, 100) // Máximo 100 por página

    // Obtener total de registros (para paginación)
    const total = await prisma.cita.count({ where })

    // Obtener citas con paginación
    const citas = await prisma.cita.findMany({
      where,
      orderBy,
      skip,
      take,
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

    const totalPaginas = Math.ceil(total / porPagina)

    return NextResponse.json({
      success: true,
      citas,
      paginacion: {
        pagina,
        porPagina,
        total,
        totalPaginas,
        tieneAnterior: pagina > 1,
        tieneSiguiente: pagina < totalPaginas,
      },
    })
  } catch (error) {
    console.error('Error obteniendo citas:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener las citas' },
      { status: 500 }
    )
  }
}

