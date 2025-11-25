'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
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

// Funciones puras de utilidad
const parsearFechaHora = (fechaHoraISO: string): { fecha: string; hora: string } | null => {
  try {
    const fechaHora = new Date(fechaHoraISO)
    if (isNaN(fechaHora.getTime())) return null
    
    const fecha = fechaHora.toISOString().split('T')[0]
    const hora = `${fechaHora.getHours().toString().padStart(2, '0')}:00`
    return { fecha, hora }
  } catch {
    return null
  }
}

const crearFechaHoraISO = (fecha: string, hora: string): string => {
  const fechaHora = new Date(`${fecha}T${hora}:00`)
  return fechaHora.toISOString()
}

const formatearFechaCorta = (fechaStr: string) => {
  const fecha = new Date(fechaStr)
  return {
    dia: fecha.getDate(),
    mes: fecha.toLocaleDateString('es-CL', { month: 'short' }),
    mesCompleto: fecha.toLocaleDateString('es-CL', { month: 'long' }),
    año: fecha.getFullYear(),
    diaSemana: fecha.toLocaleDateString('es-CL', { weekday: 'short' }),
  }
}

export function DateTimePicker({ value, onChange, error }: DateTimePickerProps) {
  // Estado para datos cargados
  const [fechas, setFechas] = useState<FechaConHorarios[]>([])
  const [horarios, setHorarios] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [cargandoHorarios, setCargandoHorarios] = useState(false)
  
  // Estado interno derivado del prop value
  const estadoInterno = useMemo(() => {
    if (!value) return { fecha: '', hora: '' }
    const parsed = parsearFechaHora(value)
    return parsed || { fecha: '', hora: '' }
  }, [value])
  
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(estadoInterno.fecha)
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>(estadoInterno.hora)
  const cambioInternoRef = useRef(false) // Rastrear cambios internos del usuario

  // Funciones de carga de datos con useCallback (declaradas antes de los efectos)
  const cargarFechas = useCallback(async () => {
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
  }, [])

  const cargarHorarios = useCallback(async (fecha: string, horaPreSeleccionada?: string) => {
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
  }, [])

  // Cargar fechas disponibles al montar
  useEffect(() => {
    cargarFechas()
  }, [cargarFechas])

  // Sincronizar estado interno cuando el prop value cambia externamente
  // Ignorar cambios que vienen de acciones internas del usuario
  useEffect(() => {
    // Si el cambio viene de una acción interna, ignorarlo
    if (cambioInternoRef.current) {
      cambioInternoRef.current = false
      return
    }

    // Sincronizar con el prop value solo cuando viene de fuera
    if (estadoInterno.fecha && estadoInterno.hora) {
      // Hay un valor completo en el prop, sincronizar
      if (fechaSeleccionada !== estadoInterno.fecha || horaSeleccionada !== estadoInterno.hora) {
        setFechaSeleccionada(estadoInterno.fecha)
        setHoraSeleccionada(estadoInterno.hora)
        if (fechaSeleccionada !== estadoInterno.fecha) {
          cargarHorarios(estadoInterno.fecha, estadoInterno.hora)
        }
      }
    } else if (!estadoInterno.fecha && !estadoInterno.hora) {
      // El prop está vacío - solo limpiar si realmente viene de un reset externo
      // (no limpiar si el usuario está seleccionando)
      if (fechaSeleccionada && !value) {
        // Solo limpiar si el prop value es undefined/null y tenemos estado
        // Esto indica un reset del formulario
        setFechaSeleccionada('')
        setHoraSeleccionada('')
        setHorarios([])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // Handlers de eventos con useCallback
  const handleFechaClick = useCallback((fecha: string, e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    // Si se cambió la fecha, actualizar el estado y cargar horarios
    if (fecha !== fechaSeleccionada) {
      cambioInternoRef.current = true // Marcar como cambio interno
      setFechaSeleccionada(fecha)
      setHoraSeleccionada('')
      setHorarios([])
      
      // Si había una hora seleccionada previamente, limpiar el valor del formulario
      // Esto permite que el usuario cambie de fecha sin mantener la hora anterior
      if (horaSeleccionada) {
        onChange(undefined)
      }
      
      cargarHorarios(fecha)
    }
  }, [fechaSeleccionada, horaSeleccionada, onChange, cargarHorarios])

  const handleHoraClick = useCallback((hora: string, e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    cambioInternoRef.current = true // Marcar como cambio interno
    setHoraSeleccionada(hora)
    
    if (fechaSeleccionada && hora) {
      const fechaHoraISO = crearFechaHoraISO(fechaSeleccionada, hora)
      onChange(fechaHoraISO)
    } else {
      onChange(undefined)
    }
  }, [fechaSeleccionada, onChange])

  // Valores calculados con useMemo
  const fechasRender = useMemo(() => {
    return fechas.map((fecha) => ({
      ...fecha,
      fechaCorta: formatearFechaCorta(fecha.fecha),
      estaSeleccionada: fechaSeleccionada === fecha.fecha,
    }))
  }, [fechas, fechaSeleccionada])

  const horariosRender = useMemo(() => {
    return horarios.map((hora) => {
      const [horaNum] = hora.split(':').map(Number)
      const horaFin = `${(horaNum + 1).toString().padStart(2, '0')}:00`
      return {
        hora,
        horaFin,
        estaSeleccionada: horaSeleccionada === hora,
      }
    })
  }, [horarios, horaSeleccionada])

  return (
    <div className="space-y-6">
      {/* Sección de fechas */}
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
            {fechasRender.map((fecha) => (
              <button
                key={fecha.fecha}
                type="button"
                onClick={(e) => handleFechaClick(fecha.fecha, e)}
                onMouseDown={(e) => e.preventDefault()}
                className={cn(
                  "relative p-4 rounded-lg border-2 transition-all duration-200 text-left cursor-pointer",
                  "hover:shadow-md hover:scale-105 active:scale-95",
                  fecha.estaSeleccionada
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-gray-200 bg-white hover:border-primary/50"
                )}
              >
                <div className="flex flex-col gap-1 pointer-events-none">
                  <div className="text-xs text-gray-500 uppercase font-medium">
                    {fecha.fechaCorta.diaSemana}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {fecha.fechaCorta.dia}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {fecha.fechaCorta.mesCompleto}
                  </div>
                  {fecha.horarios.length > 0 && (
                    <div className="text-xs text-primary mt-2 font-medium">
                      {fecha.horarios.length} horario{fecha.horarios.length !== 1 ? 's' : ''} disponible{fecha.horarios.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                {fecha.estaSeleccionada && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sección de horarios */}
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
              {horariosRender.map((horario) => (
                <button
                  key={horario.hora}
                  type="button"
                  onClick={(e) => handleHoraClick(horario.hora, e)}
                  onMouseDown={(e) => e.preventDefault()}
                  className={cn(
                    "py-2.5 px-2 sm:px-3 rounded-lg border-2 transition-all duration-200 cursor-pointer",
                    "hover:shadow-md hover:scale-105 active:scale-95",
                    horario.estaSeleccionada
                      ? "border-primary bg-primary text-white shadow-md"
                      : "border-gray-200 bg-white text-gray-900 hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-center gap-1 whitespace-nowrap pointer-events-none">
                    <span className={cn(
                      "text-sm font-bold",
                      horario.estaSeleccionada ? "text-white" : "text-gray-900"
                    )}>
                      {horario.hora}
                    </span>
                    <span className={cn(
                      "text-sm",
                      horario.estaSeleccionada ? "text-white/80" : "text-gray-500"
                    )}>
                      - {horario.horaFin}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
