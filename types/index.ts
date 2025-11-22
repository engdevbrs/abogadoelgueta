// Tipos para enums (convertidos a string para SQLite)
export type Role = 'ADMIN'

export type EstadoCita = 
  | 'PENDIENTE'
  | 'PAGO_PENDIENTE'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'COMPLETADA'
  | 'CANCELADA'

export interface SolicitudCita {
  nombre: string
  email: string
  telefono?: string
  motivoConsulta: string
  mensaje?: string
  fechaSolicitada?: Date
}

export interface ContactoForm {
  nombre: string
  email: string
  telefono?: string
  asunto: string
  mensaje: string
}

export interface DashboardStats {
  totalPendientes: number
  totalPagoPendiente: number
  totalAprobadas: number
  totalRechazadas: number
  totalCompletadas: number
}

export type MotivoConsulta =
  | 'Responsabilidad Civil'
  | 'Accidentes Del Trabajo Y Enfermedades Laborales'
  | 'Defensa En Procesos Por Deudas Civiles'
  | 'Asesoria Empresas'
  | 'Otra Consulta Legal'

