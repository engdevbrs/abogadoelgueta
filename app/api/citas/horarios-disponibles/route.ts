import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Forzar renderizado dinámico para evitar error en build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Genera horarios disponibles para citas
 * - Lunes a viernes
 * - 8:00 AM a 6:00 PM
 * - Cada 1 hora
 */
function generarHorariosDisponibles() {
  const horas = []
  for (let hora = 8; hora < 18; hora++) {
    horas.push(`${hora.toString().padStart(2, '0')}:00`)
  }
  return horas
}

/**
 * Verifica si una fecha es día laborable (lunes a viernes)
 */
function esDiaLaborable(fecha: Date): boolean {
  const dia = fecha.getDay() // 0 = domingo, 6 = sábado
  return dia >= 1 && dia <= 5 // Lunes (1) a Viernes (5)
}

/**
 * Obtiene las próximas 30 fechas laborables
 */
function obtenerFechasLaborables(): Date[] {
  const fechas: Date[] = []
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  
  let fechaActual = new Date(hoy)
  let diasAgregados = 0
  
  while (diasAgregados < 60) { // Buscar en los próximos 60 días
    if (esDiaLaborable(fechaActual)) {
      // Si es hoy, verificar que no hayamos pasado las 6 PM
      if (fechaActual.getTime() === hoy.getTime()) {
        const ahora = new Date()
        if (ahora.getHours() < 18) {
          fechas.push(new Date(fechaActual))
          diasAgregados++
        }
      } else {
        fechas.push(new Date(fechaActual))
        diasAgregados++
      }
    }
    
    // Pasar al siguiente día
    fechaActual.setDate(fechaActual.getDate() + 1)
  }
  
  return fechas
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fechaStr = searchParams.get('fecha')
    
    // Obtener fechas laborables
    const fechasLaborables = obtenerFechasLaborables()
    
    // Obtener citas aprobadas para verificar disponibilidad
    let citasAprobadas: Array<{ fechaSolicitada: Date | null }> = []
    try {
      citasAprobadas = await prisma.cita.findMany({
        where: {
          estado: 'APROBADA',
          fechaSolicitada: {
            not: null,
          },
        },
        select: {
          fechaSolicitada: true,
        },
      })
    } catch (dbError) {
      console.error('Error de base de datos al obtener citas:', dbError)
      // Si falla la BD, continuar sin filtrar horarios ocupados
      citasAprobadas = []
    }
    
    // Crear set de horarios ocupados
    const horariosOcupados = new Set<string>()
    citasAprobadas.forEach((cita: { fechaSolicitada: Date | null }) => {
      if (cita.fechaSolicitada) {
        const fecha = new Date(cita.fechaSolicitada)
        const fechaStr = fecha.toISOString().split('T')[0]
        const horaStr = `${fecha.getHours().toString().padStart(2, '0')}:00`
        horariosOcupados.add(`${fechaStr}-${horaStr}`)
      }
    })
    
    // Si se solicita una fecha específica, retornar solo sus horarios
    if (fechaStr) {
      const fecha = new Date(fechaStr)
      
      if (!esDiaLaborable(fecha)) {
        return NextResponse.json({
          success: true,
          fecha: fechaStr,
          horarios: [],
          mensaje: 'La fecha seleccionada no es un día laborable',
        })
      }
      
      const horarios = generarHorariosDisponibles()
      
      // Filtrar horarios ocupados
      const horariosDisponibles = horarios.filter((hora) => {
        const clave = `${fechaStr}-${hora}`
        return !horariosOcupados.has(clave)
      })
      
      // Si es hoy, filtrar horarios pasados
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      const fechaComparar = new Date(fecha)
      fechaComparar.setHours(0, 0, 0, 0)
      
      const horariosFinales = fechaComparar.getTime() === hoy.getTime()
        ? horariosDisponibles.filter((hora) => {
            const [horaNum] = hora.split(':').map(Number)
            return horaNum > hoy.getHours() || (horaNum === hoy.getHours() && hoy.getMinutes() === 0)
          })
        : horariosDisponibles
      
      return NextResponse.json({
        success: true,
        fecha: fechaStr,
        horarios: horariosFinales,
      })
    }
    
    // Retornar fechas laborables con horarios disponibles
    const fechasConHorarios = fechasLaborables.map((fecha) => {
      const fechaStr = fecha.toISOString().split('T')[0]
      const horarios = generarHorariosDisponibles()
      
      // Filtrar horarios ocupados
      const horariosDisponibles = horarios.filter((hora) => {
        const clave = `${fechaStr}-${hora}`
        return !horariosOcupados.has(clave)
      })
      
      // Si es hoy, filtrar horarios pasados
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      const fechaComparar = new Date(fecha)
      fechaComparar.setHours(0, 0, 0, 0)
      
      const horariosFinales = fechaComparar.getTime() === hoy.getTime()
        ? horariosDisponibles.filter((hora) => {
            const [horaNum] = hora.split(':').map(Number)
            return horaNum > hoy.getHours() || (horaNum === hoy.getHours() && hoy.getMinutes() === 0)
          })
        : horariosDisponibles
      
      // Formatear fecha en español
      const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
      
      const diaSemana = diasSemana[fecha.getDay()]
      const dia = fecha.getDate()
      const mes = meses[fecha.getMonth()]
      const año = fecha.getFullYear()
      
      const fechaFormateada = `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}, ${dia} de ${mes} de ${año}`
      
      return {
        fecha: fechaStr,
        fechaFormateada,
        horarios: horariosFinales,
      }
    })
    
    return NextResponse.json({
      success: true,
      fechas: fechasConHorarios,
    })
  } catch (error) {
    console.error('Error obteniendo horarios disponibles:', error)
    
    // Mejor información de error para debugging
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      env: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    })
    
    // En producción, no exponer detalles del error al cliente
    const isProduction = process.env.NODE_ENV === 'production'
    
    return NextResponse.json(
      { 
        success: false, 
        error: isProduction 
          ? 'Error al obtener horarios disponibles. Por favor, intenta nuevamente.' 
          : `Error al obtener horarios disponibles: ${errorMessage}`,
      },
      { status: 500 }
    )
  }
}

