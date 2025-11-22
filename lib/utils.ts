import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea una fecha a formato legible en español
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj)
}

/**
 * Formatea una fecha con hora
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

/**
 * Valida formato de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida formato de teléfono chileno
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+?56)?[\s-]?[9]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Convierte un estado técnico de cita a texto amigable para el usuario
 */
export function getEstadoTexto(estado: string): string {
  const estados: Record<string, string> = {
    'PENDIENTE': 'Pendiente',
    'PAGO_PENDIENTE': 'Pago Pendiente',
    'APROBADA': 'Aprobada',
    'RECHAZADA': 'Rechazada',
    'COMPLETADA': 'Completada',
    'CANCELADA': 'Cancelada',
  }
  return estados[estado] || estado
}

/**
 * Convierte un estado técnico de cita a texto para mensajes de éxito
 */
export function getEstadoMensaje(estado: string): string {
  const mensajes: Record<string, string> = {
    'PENDIENTE': 'pendiente',
    'PAGO_PENDIENTE': 'pago pendiente',
    'APROBADA': 'aprobada',
    'RECHAZADA': 'rechazada',
    'COMPLETADA': 'completada',
    'CANCELADA': 'cancelada',
  }
  return mensajes[estado] || estado.toLowerCase()
}

