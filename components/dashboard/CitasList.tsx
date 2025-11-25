'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatDate, formatDateTime, getEstadoTexto, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle, XCircle, Clock, AlertCircle, ExternalLink, Loader2, Copy, Check, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import type { EstadoCita } from '@/types'

interface Cita {
  id: string
  nombre: string
  email: string
  telefono: string | null
  motivoConsulta: string
  mensaje: string | null
  estado: EstadoCita
  fechaSolicitada: Date | null
  googleMeetLink: string | null
  createdAt: Date
  aprobadaAt: Date | null
  aprobadaPor: {
    id: string
    name: string
    email: string
  } | null
}

interface Paginacion {
  pagina: number
  porPagina: number
  total: number
  totalPaginas: number
  tieneAnterior: boolean
  tieneSiguiente: boolean
}

export function CitasList() {
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<EstadoCita | 'TODAS'>('TODAS')
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({})
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Estado para el modal de rechazo
  const [modalRechazoAbierto, setModalRechazoAbierto] = useState(false)
  const [citaParaRechazar, setCitaParaRechazar] = useState<Cita | null>(null)
  const [motivoRechazo, setMotivoRechazo] = useState('')
  const [errorMotivoRechazo, setErrorMotivoRechazo] = useState('')

  // Nuevos estados para búsqueda, filtros y paginación
  const [busquedaNombre, setBusquedaNombre] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [ordenarPor, setOrdenarPor] = useState('createdAt')
  const [orden, setOrden] = useState<'asc' | 'desc'>('desc')
  const [pagina, setPagina] = useState(1)
  const [paginacion, setPaginacion] = useState<Paginacion | null>(null)

  // Debounce para búsqueda
  const [busquedaTimeout, setBusquedaTimeout] = useState<NodeJS.Timeout | null>(null)
  
  // Estado para mostrar/ocultar filtros avanzados
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const fetchCitas = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filter !== 'TODAS') {
        params.append('estado', filter)
      }
      if (busquedaNombre.trim()) {
        params.append('nombre', busquedaNombre.trim())
      }
      if (fechaDesde) {
        params.append('fechaDesde', fechaDesde)
      }
      if (fechaHasta) {
        params.append('fechaHasta', fechaHasta)
      }
      params.append('ordenarPor', ordenarPor)
      params.append('orden', orden)
      params.append('pagina', pagina.toString())
      params.append('porPagina', '10')
      
      const response = await fetch(`/api/citas?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setCitas(data.citas)
        if (data.paginacion) {
          setPaginacion(data.paginacion)
        }
      }
    } catch (error) {
      console.error('Error obteniendo citas:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las citas',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [filter, busquedaNombre, fechaDesde, fechaHasta, ordenarPor, orden, pagina, toast])

  useEffect(() => {
    // Resetear a página 1 cuando cambian los filtros
    if (pagina !== 1) {
      setPagina(1)
    } else {
      fetchCitas()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, ordenarPor, orden])

  useEffect(() => {
    // Debounce para búsqueda por nombre
    if (busquedaTimeout) {
      clearTimeout(busquedaTimeout)
    }

    const timeout = setTimeout(() => {
      setPagina(1) // Resetear a página 1 al buscar
      fetchCitas()
    }, 500) // Esperar 500ms después de que el usuario deje de escribir

    setBusquedaTimeout(timeout)

    return () => {
      if (timeout) clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busquedaNombre])

  useEffect(() => {
    fetchCitas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina])

  // Función para manejar cambio de fechas
  const handleFechaChange = () => {
    setPagina(1)
    fetchCitas()
  }

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setBusquedaNombre('')
    setFechaDesde('')
    setFechaHasta('')
    setPagina(1)
    // fetchCitas se ejecutará automáticamente con useEffect
  }

  const abrirModalRechazo = (cita: Cita) => {
    setCitaParaRechazar(cita)
    setMotivoRechazo('')
    setModalRechazoAbierto(true)
  }

  const cerrarModalRechazo = () => {
    setModalRechazoAbierto(false)
    setCitaParaRechazar(null)
    setMotivoRechazo('')
    setErrorMotivoRechazo('')
  }

  const confirmarRechazo = async () => {
    if (!citaParaRechazar) return

    // Validar que el motivo esté presente
    if (!motivoRechazo.trim()) {
      setErrorMotivoRechazo('El motivo del rechazo es obligatorio')
      return
    }

    setErrorMotivoRechazo('')
    const actionKey = `${citaParaRechazar.id}-RECHAZADA`
    
    try {
      setLoadingActions((prev) => ({ ...prev, [actionKey]: true }))
      
      const response = await fetch(`/api/citas/${citaParaRechazar.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          estado: 'RECHAZADA',
          motivoRechazo: motivoRechazo.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Éxito',
          description: 'La cita ha sido rechazada y se ha enviado un correo al usuario',
        })
        cerrarModalRechazo()
        fetchCitas()
      } else {
        throw new Error(data.error || 'Error al rechazar la cita')
      }
    } catch (error) {
      console.error('Error rechazando cita:', error)
      toast({
        title: 'Error',
        description: 'No se pudo rechazar la cita',
        variant: 'destructive',
      })
    } finally {
      setLoadingActions((prev) => {
        const newState = { ...prev }
        delete newState[actionKey]
        return newState
      })
    }
  }

  const updateEstado = async (citaId: string, nuevoEstado: EstadoCita) => {
    const actionKey = `${citaId}-${nuevoEstado}`
    
    try {
      setLoadingActions((prev) => ({ ...prev, [actionKey]: true }))
      
      const response = await fetch(`/api/citas/${citaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Éxito',
          description: `Estado actualizado a ${getEstadoTexto(nuevoEstado)}`,
        })
        fetchCitas()
      } else {
        throw new Error(data.error || 'Error al actualizar estado')
      }
    } catch (error) {
      console.error('Error actualizando estado:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado de la cita',
        variant: 'destructive',
      })
    } finally {
      setLoadingActions((prev) => {
        const newState = { ...prev }
        delete newState[actionKey]
        return newState
      })
    }
  }

  const getEstadoIcon = (estado: EstadoCita) => {
    switch (estado) {
      case 'PENDIENTE':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'PAGO_PENDIENTE':
        return <Clock className="h-4 w-4 text-orange-600" />
      case 'APROBADA':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'RECHAZADA':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'COMPLETADA':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  const getEstadoBadgeClass = (estado: EstadoCita) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800'
      case 'PAGO_PENDIENTE':
        return 'bg-orange-100 text-orange-800'
      case 'APROBADA':
        return 'bg-green-100 text-green-800'
      case 'RECHAZADA':
        return 'bg-red-100 text-red-800'
      case 'COMPLETADA':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando citas...</div>
  }

  return (
    <div className="space-y-4">
      {/* Búsqueda por nombre - siempre visible */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
        <div className="flex-1 min-w-0">
          <Label htmlFor="busqueda" className="text-sm font-medium mb-2 block">
            <Search className="inline h-4 w-4 mr-1" />
            Buscar por nombre
          </Label>
          <Input
            id="busqueda"
            type="text"
            placeholder="Escribe el nombre..."
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2 flex-shrink-0 sm:items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="whitespace-nowrap"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          {(busquedaNombre || fechaDesde || fechaHasta || filter !== 'TODAS') && (
            <Button
              variant="outline"
              size="sm"
              onClick={limpiarFiltros}
              className="whitespace-nowrap"
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Filtros por estado - siempre visibles */}
      <div className="flex gap-2 flex-wrap items-center">
        <Button
            variant={filter === 'TODAS' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setFilter('TODAS')
              setPagina(1)
            }}
            className="text-xs sm:text-sm"
          >
            Todas
          </Button>
          <Button
            variant={filter === 'PENDIENTE' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setFilter('PENDIENTE')
              setPagina(1)
            }}
            className="text-xs sm:text-sm"
          >
            Pendientes
          </Button>
          <Button
            variant={filter === 'PAGO_PENDIENTE' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setFilter('PAGO_PENDIENTE')
              setPagina(1)
            }}
            className="text-xs sm:text-sm whitespace-nowrap"
          >
            Pago Pendiente
          </Button>
          <Button
            variant={filter === 'APROBADA' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setFilter('APROBADA')
              setPagina(1)
            }}
            className="text-xs sm:text-sm"
          >
            Aprobadas
          </Button>
          <Button
            variant={filter === 'RECHAZADA' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setFilter('RECHAZADA')
              setPagina(1)
            }}
            className="text-xs sm:text-sm"
          >
            Rechazadas
          </Button>
          <Button
            variant={filter === 'COMPLETADA' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setFilter('COMPLETADA')
              setPagina(1)
            }}
            className="text-xs sm:text-sm"
          >
            Completadas
          </Button>
      </div>

      {/* Filtros avanzados - solo visibles cuando mostrarFiltros es true */}
      {mostrarFiltros && (
        <Card className="border-2 p-3 sm:p-4">
          <div className="space-y-4">
            {/* Filtros de fecha y ordenamiento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="fechaDesde" className="text-sm font-medium mb-2 block">
                  Fecha desde
                </Label>
                <Input
                  id="fechaDesde"
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => {
                    setFechaDesde(e.target.value)
                    handleFechaChange()
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="fechaHasta" className="text-sm font-medium mb-2 block">
                  Fecha hasta
                </Label>
                <Input
                  id="fechaHasta"
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => {
                    setFechaHasta(e.target.value)
                    handleFechaChange()
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="ordenarPor" className="text-sm font-medium mb-2 block flex items-center gap-1">
                  <ArrowUpDown className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Ordenar por</span>
                </Label>
                <Select value={ordenarPor} onValueChange={(value) => {
                  setOrdenarPor(value)
                  setPagina(1)
                }}>
                  <SelectTrigger id="ordenarPor" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Fecha de solicitud</SelectItem>
                    <SelectItem value="fechaSolicitada">Fecha de cita</SelectItem>
                    <SelectItem value="nombre">Nombre</SelectItem>
                    <SelectItem value="estado">Estado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="orden" className="text-sm font-medium mb-2 block">
                  Orden
                </Label>
                <Select value={orden} onValueChange={(value: 'asc' | 'desc') => {
                  setOrden(value)
                  setPagina(1)
                }}>
                  <SelectTrigger id="orden" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descendente</SelectItem>
                    <SelectItem value="asc">Ascendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Información de resultados */}
      {paginacion && (
        <div className="text-sm text-gray-600">
          Mostrando {((paginacion.pagina - 1) * paginacion.porPagina) + 1} - {Math.min(paginacion.pagina * paginacion.porPagina, paginacion.total)} de {paginacion.total} citas
        </div>
      )}

      {citas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay citas {filter !== 'TODAS' ? `con estado ${getEstadoTexto(filter)}` : ''}
        </div>
      ) : (
        <div className="space-y-4">
          {citas.map((cita) => (
            <Card key={cita.id} className="border-2">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
                  <div className="flex-1 min-w-0 pr-2">
                    <CardTitle className="text-sm sm:text-base md:text-lg leading-tight font-semibold tracking-tight">{cita.nombre}</CardTitle>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5 break-all font-normal">{cita.email}</p>
                    {cita.telefono && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5 font-normal">{cita.telefono}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 ml-2">
                    <span className="flex-shrink-0">{getEstadoIcon(cita.estado)}</span>
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap leading-tight ${getEstadoBadgeClass(cita.estado)}`}>
                      {getEstadoTexto(cita.estado)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Motivo de Consulta:</p>
                    <p className="text-sm text-gray-900">{cita.motivoConsulta}</p>
                  </div>
                  {cita.mensaje && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Mensaje:</p>
                      <p className="text-sm text-gray-900">{cita.mensaje}</p>
                    </div>
                  )}
                  {cita.fechaSolicitada && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Fecha Solicitada:</p>
                      <p className="text-sm text-gray-900">{formatDateTime(cita.fechaSolicitada)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Fecha de Solicitud:</p>
                    <p className="text-sm text-gray-900">{formatDateTime(cita.createdAt)}</p>
                  </div>
                  {cita.aprobadaAt && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Aprobada el:</p>
                      <p className="text-sm text-gray-900">{formatDateTime(cita.aprobadaAt)}</p>
                      {cita.aprobadaPor && (
                        <p className="text-xs text-gray-500">por {cita.aprobadaPor.name}</p>
                      )}
                    </div>
                  )}
                  {cita.googleMeetLink && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 sm:p-4 mt-2 sm:mt-3 md:mt-4 relative">
                      {/* Ícono de copiar en la esquina superior derecha */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(cita.googleMeetLink || '')
                          setCopiedLinkId(cita.id)
                          toast({
                            title: 'Enlace copiado',
                            description: 'El enlace de Google Meet ha sido copiado al portapapeles',
                          })
                          setTimeout(() => setCopiedLinkId(null), 2000)
                        }}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-md hover:bg-green-100 transition-colors text-green-700 hover:text-green-900"
                        aria-label="Copiar enlace"
                      >
                        {copiedLinkId === cita.id ? (
                          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </button>
                      
                      <div className="pr-7 sm:pr-8">
                        <p className="text-xs sm:text-sm font-semibold text-green-900 mb-1.5 sm:mb-2">
                          🎥 Enlace de Google Meet
                        </p>
                        <p className="text-[10px] sm:text-xs text-green-700 mb-2 sm:mb-3 break-all">
                          {cita.googleMeetLink}
                        </p>
                        <a
                          href={cita.googleMeetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-green-700 transition-colors w-full sm:w-auto"
                        >
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">Unirse a la Reunión</span>
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap pt-3 sm:pt-4 border-t mt-3 sm:mt-4">
                    {cita.estado === 'PENDIENTE' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateEstado(cita.id, 'PAGO_PENDIENTE')}
                          disabled={loadingActions[`${cita.id}-PAGO_PENDIENTE`]}
                        >
                          {loadingActions[`${cita.id}-PAGO_PENDIENTE`] ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Procesando...
                            </>
                          ) : (
                            'Marcar como Pago Pendiente'
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => abrirModalRechazo(cita)}
                          disabled={loadingActions[`${cita.id}-RECHAZADA`]}
                        >
                          {loadingActions[`${cita.id}-RECHAZADA`] ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Procesando...
                            </>
                          ) : (
                            'Rechazar'
                          )}
                        </Button>
                      </>
                    )}
                    {cita.estado === 'PAGO_PENDIENTE' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateEstado(cita.id, 'APROBADA')}
                          disabled={loadingActions[`${cita.id}-APROBADA`]}
                        >
                          {loadingActions[`${cita.id}-APROBADA`] ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Procesando...
                            </>
                          ) : (
                            'Aprobar Cita'
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => abrirModalRechazo(cita)}
                          disabled={loadingActions[`${cita.id}-RECHAZADA`]}
                        >
                          {loadingActions[`${cita.id}-RECHAZADA`] ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Procesando...
                            </>
                          ) : (
                            'Rechazar'
                          )}
                        </Button>
                      </>
                    )}
                    {cita.estado === 'APROBADA' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateEstado(cita.id, 'COMPLETADA')}
                        disabled={loadingActions[`${cita.id}-COMPLETADA`]}
                      >
                        {loadingActions[`${cita.id}-COMPLETADA`] ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          'Marcar como Completada'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Paginación */}
      {paginacion && paginacion.totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagina(p => Math.max(1, p - 1))}
            disabled={!paginacion.tieneAnterior || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, paginacion.totalPaginas) }, (_, i) => {
              let paginaNum: number
              if (paginacion.totalPaginas <= 5) {
                paginaNum = i + 1
              } else if (paginacion.pagina <= 3) {
                paginaNum = i + 1
              } else if (paginacion.pagina >= paginacion.totalPaginas - 2) {
                paginaNum = paginacion.totalPaginas - 4 + i
              } else {
                paginaNum = paginacion.pagina - 2 + i
              }
              
              return (
                <Button
                  key={paginaNum}
                  variant={paginaNum === paginacion.pagina ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPagina(paginaNum)}
                  disabled={loading}
                  className="min-w-[40px]"
                >
                  {paginaNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagina(p => Math.min(paginacion.totalPaginas, p + 1))}
            disabled={!paginacion.tieneSiguiente || loading}
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Modal de rechazo */}
      <Dialog open={modalRechazoAbierto} onOpenChange={(open) => {
        if (!open) {
          cerrarModalRechazo()
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud de Cita</DialogTitle>
            <DialogDescription>
              {citaParaRechazar && (
                <>
                  Estás a punto de rechazar la solicitud de <strong>{citaParaRechazar.nombre}</strong>.
                  {citaParaRechazar.motivoConsulta && (
                    <>
                      <br />
                    <> Motivo de consulta: <strong>{citaParaRechazar.motivoConsulta}</strong></>
                    </>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="motivoRechazo">
                Motivo del rechazo <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="motivoRechazo"
                placeholder="Explique el motivo del rechazo. Este mensaje se enviará al usuario por correo electrónico."
                value={motivoRechazo}
                onChange={(e) => {
                  setMotivoRechazo(e.target.value)
                  if (errorMotivoRechazo && e.target.value.trim()) {
                    setErrorMotivoRechazo('')
                  }
                }}
                rows={5}
                className={cn(
                  "resize-none",
                  errorMotivoRechazo && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
                required
              />
              {errorMotivoRechazo && (
                <p className="text-xs text-red-500">
                  {errorMotivoRechazo}
                </p>
              )}
              {!errorMotivoRechazo && (
                <p className="text-xs text-gray-500">
                  Este motivo se enviará al usuario por correo electrónico.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cerrarModalRechazo}
              disabled={loadingActions[`${citaParaRechazar?.id}-RECHAZADA`]}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmarRechazo}
              disabled={loadingActions[`${citaParaRechazar?.id}-RECHAZADA`]}
            >
              {loadingActions[`${citaParaRechazar?.id}-RECHAZADA`] ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Confirmar Rechazo'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

