'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FechaConHorarios {
  fecha: string
  fechaFormateada: string
  horarios: string[]
}

interface DateTimePickerProps {
  value: string | undefined
  onChange: (value: string | undefined) => void
  error?: string
}

export function DateTimePicker({ value, onChange, error }: DateTimePickerProps) {
  const [fechas, setFechas] = useState<FechaConHorarios[]>([])
  const [horarios, setHorarios] = useState<string[]>([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('')
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [cargandoHorarios, setCargandoHorarios] = useState(false)

  // Cargar fechas disponibles al montar el componente
  useEffect(() => {
    cargarFechas()
  }, [])

  // Actualizar fecha y hora cuando cambia el valor
  useEffect(() => {
    if (value) {
      try {
        const fechaHora = new Date(value)
        const fechaStr = fechaHora.toISOString().split('T')[0]
        const horaStr = `${fechaHora.getHours().toString().padStart(2, '0')}:00`
        
        setFechaSeleccionada(fechaStr)
        setHoraSeleccionada(horaStr)
        cargarHorarios(fechaStr, horaStr)
      } catch (error) {
        console.error('Error parseando fecha:', error)
      }
    } else {
      setFechaSeleccionada('')
      setHoraSeleccionada('')
      setHorarios([])
    }
  }, [value])

  const cargarFechas = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/citas/horarios-disponibles')
      const data = await response.json()
      
      if (data.success) {
        setFechas(data.fechas || [])
      }
    } catch (error) {
      console.error('Error cargando fechas:', error)
    } finally {
      setLoading(false)
    }
  }

  const cargarHorarios = async (fecha: string, horaPreSeleccionada?: string) => {
    setCargandoHorarios(true)
    try {
      const response = await fetch(`/api/citas/horarios-disponibles?fecha=${fecha}`)
      const data = await response.json()
      
      if (data.success) {
        setHorarios(data.horarios || [])
        
        // Si hay una hora pre-seleccionada y está disponible, seleccionarla
        if (horaPreSeleccionada && data.horarios.includes(horaPreSeleccionada)) {
          setHoraSeleccionada(horaPreSeleccionada)
        } else {
          setHoraSeleccionada('')
        }
      }
    } catch (error) {
      console.error('Error cargando horarios:', error)
      setHorarios([])
      setHoraSeleccionada('')
    } finally {
      setCargandoHorarios(false)
    }
  }

  const handleFechaClick = (fecha: string, e?: React.MouseEvent) => {
    // Prevenir comportamiento por defecto y propagación
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    setFechaSeleccionada(fecha)
    setHoraSeleccionada('')
    setHorarios([])
    onChange(undefined)
    
    if (fecha) {
      cargarHorarios(fecha)
    }
  }

  const handleHoraClick = (hora: string, e?: React.MouseEvent) => {
    // Prevenir comportamiento por defecto y propagación
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    setHoraSeleccionada(hora)
    
    if (fechaSeleccionada && hora) {
      // Crear fecha completa en formato ISO
      const fechaHora = new Date(`${fechaSeleccionada}T${hora}:00`)
      onChange(fechaHora.toISOString())
    } else {
      onChange(undefined)
    }
  }

  // Formatear fecha corta para el calendario
  const formatearFechaCorta = (fechaStr: string) => {
    const fecha = new Date(fechaStr)
    const dia = fecha.getDate()
    const mes = fecha.toLocaleDateString('es-CL', { month: 'short' })
    const mesCompleto = fecha.toLocaleDateString('es-CL', { month: 'long' })
    const año = fecha.getFullYear()
    const diaSemana = fecha.toLocaleDateString('es-CL', { weekday: 'short' })
    
    return {
      dia,
      mes,
      mesCompleto,
      año,
      diaSemana,
    }
  }


  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-gray-700 font-semibold block text-left flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Fecha de la consulta <span className="text-primary">*</span>
        </Label>
        
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Cargando fechas disponibles...
          </div>
        ) : fechas.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
            No hay fechas disponibles en este momento
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
            {fechas.map((fecha) => {
              const fechaCorta = formatearFechaCorta(fecha.fecha)
              const estaSeleccionada = fechaSeleccionada === fecha.fecha
              
              return (
                <button
                  key={fecha.fecha}
                  type="button"
                  onClick={(e) => handleFechaClick(fecha.fecha, e)}
                  onMouseDown={(e) => e.preventDefault()} // Prevenir doble clic en móviles
                  className={cn(
                    "relative p-4 rounded-lg border-2 transition-all duration-200 text-left cursor-pointer",
                    "hover:shadow-md hover:scale-105 active:scale-95",
                    estaSeleccionada
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-gray-200 bg-white hover:border-primary/50"
                  )}
                >
                  <div className="flex flex-col gap-1 pointer-events-none">
                    <div className="text-xs text-gray-500 uppercase font-medium">
                      {fechaCorta.diaSemana}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {fechaCorta.dia}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {fechaCorta.mesCompleto}
                    </div>
                    {fecha.horarios.length > 0 && (
                      <div className="text-xs text-primary mt-2 font-medium">
                        {fecha.horarios.length} horario{fecha.horarios.length !== 1 ? 's' : ''} disponible{fecha.horarios.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  {estaSeleccionada && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full"></div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {fechaSeleccionada && (
        <div className="space-y-3 animate-fadeIn">
          <Label className="text-gray-700 font-semibold block text-left flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Hora de la consulta <span className="text-primary">*</span>
          </Label>
          
          {cargandoHorarios ? (
            <div className="text-center py-8 text-gray-500">
              Cargando horarios disponibles...
            </div>
          ) : horarios.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
              No hay horarios disponibles para esta fecha
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3">
              {horarios.map((hora) => {
                const [horaNum] = hora.split(':').map(Number)
                const horaFin = `${(horaNum + 1).toString().padStart(2, '0')}:00`
                const estaSeleccionada = horaSeleccionada === hora
                
                return (
                  <button
                    key={hora}
                    type="button"
                    onClick={(e) => handleHoraClick(hora, e)}
                    onMouseDown={(e) => e.preventDefault()} // Prevenir doble clic en móviles
                    className={cn(
                      "py-2.5 px-2 sm:px-3 rounded-lg border-2 transition-all duration-200 cursor-pointer",
                      "hover:shadow-md hover:scale-105 active:scale-95",
                      estaSeleccionada
                        ? "border-primary bg-primary text-white shadow-md"
                        : "border-gray-200 bg-white text-gray-900 hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-center gap-1 whitespace-nowrap pointer-events-none">
                      <span className={cn(
                        "text-sm font-bold",
                        estaSeleccionada ? "text-white" : "text-gray-900"
                      )}>
                        {hora}
                      </span>
                      <span className={cn(
                        "text-sm",
                        estaSeleccionada ? "text-white/80" : "text-gray-500"
                      )}>
                        - {horaFin}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
