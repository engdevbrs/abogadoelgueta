import { google } from 'googleapis'

// Configurar OAuth2 Client
const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

// Configurar tokens de acceso
if (process.env.GOOGLE_ACCESS_TOKEN && process.env.GOOGLE_REFRESH_TOKEN) {
  auth.setCredentials({
    access_token: process.env.GOOGLE_ACCESS_TOKEN,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    expiry_date: process.env.GOOGLE_TOKEN_EXPIRY ? parseInt(process.env.GOOGLE_TOKEN_EXPIRY) : undefined,
  })
  
  // Configurar refresh automático de tokens
  auth.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
      // Si Google devuelve un nuevo refresh_token, guardarlo
      console.log('⚠️ Nuevo refresh_token recibido (deberías actualizar .env si es necesario)')
      console.log('⚠️ Nuevo refresh_token:', tokens.refresh_token.substring(0, 20) + '...')
    }
    if (tokens.access_token) {
      console.log('✅ Access token actualizado automáticamente')
      // Actualizar en memoria
      auth.setCredentials({
        access_token: tokens.access_token,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        expiry_date: tokens.expiry_date,
      })
    }
  })
}

/**
 * Crea un evento en Google Calendar y genera un link de Google Meet
 */
export async function createGoogleMeetEvent(data: {
  summary: string
  description?: string
  startTime: Date
  endTime: Date
  attendeeEmail?: string
  attendeeName?: string
  additionalAttendees?: string[] // Nuevo campo para asistentes adicionales
}) {
  try {
    // Verificar que los tokens estén configurados
    if (!process.env.GOOGLE_ACCESS_TOKEN || !process.env.GOOGLE_REFRESH_TOKEN) {
      throw new Error('Google Calendar API no está configurado. Faltan tokens de acceso.')
    }

    // Verificar que las credenciales estén configuradas
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('Google Calendar API no está configurado. Faltan CLIENT_ID o CLIENT_SECRET.')
    }

    // Asegurar que los tokens estén actualizados
    try {
      const { credentials } = await auth.refreshAccessToken()
      if (credentials?.access_token) {
        auth.setCredentials(credentials)
        console.log('✅ Access token refrescado exitosamente')
      }
    } catch (refreshError: any) {
      console.error('❌ Error refrescando access token:', refreshError)
      if (refreshError?.message?.includes('invalid_grant')) {
        throw new Error('Los tokens de Google han expirado. Necesitas regenerar los tokens de OAuth.')
      }
      throw refreshError
    }

    const calendar = google.calendar({ version: 'v3', auth })

    // Preparar lista de asistentes (evitando duplicados)
    // NOTA: adelguetap@gmail.com es el organizador (usa los tokens OAuth), pero NO se agrega como asistente
    const attendees = []
    const addedEmails = new Set<string>()
    
    // Agregar el cliente si hay email
    if (data.attendeeEmail) {
      const clientEmail = data.attendeeEmail.toLowerCase()
      attendees.push({
        email: data.attendeeEmail,
        displayName: data.attendeeName || 'Cliente',
      })
      addedEmails.add(clientEmail)
    }
    
    // Agregar asistentes adicionales (evitando duplicados)
    // No incluimos adelguetap@gmail.com aquí, solo el cliente y adrianep@elguetabogado.cl
    if (data.additionalAttendees) {
      data.additionalAttendees.forEach(email => {
        if (email && !addedEmails.has(email.toLowerCase())) {
          attendees.push({ email })
          addedEmails.add(email.toLowerCase())
        }
      })
    }

    console.log('Asistentes del evento:', attendees.map(a => `${a.displayName || a.email} (${a.email})`).join(', '))
    console.log('Nota: adelguetap@gmail.com es el organizador (no aparece como asistente)')

    // Crear el evento con Google Meet
    const event = {
      summary: data.summary,
      description: data.description || '',
      start: {
        dateTime: data.startTime.toISOString(),
        timeZone: 'America/Santiago',
      },
      end: {
        dateTime: data.endTime.toISOString(),
        timeZone: 'America/Santiago',
      },
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
      attendees: attendees.length > 0 ? attendees : undefined,
    }

    console.log('Creando evento en Google Calendar...')
    console.log('Calendario: primary')
    console.log('Inicio:', data.startTime.toISOString())
    console.log('Fin:', data.endTime.toISOString())
    console.log('Asistentes:', JSON.stringify(attendees, null, 2))

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: event,
      sendUpdates: 'all', // Enviar invitaciones a todos los asistentes
    })

    console.log('Evento creado exitosamente en Google Calendar')
    console.log('Event ID:', response.data.id)
    console.log('HTML Link:', response.data.htmlLink)
    console.log('Asistentes en la respuesta:', JSON.stringify(response.data.attendees, null, 2))

    const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri

    if (!meetLink) {
      console.warn('No se pudo obtener el link de Google Meet del evento')
      console.warn('Response data:', JSON.stringify(response.data, null, 2))
      throw new Error('No se pudo generar el link de Google Meet')
    }

    console.log('Google Meet link generado:', meetLink)

    return {
      eventId: response.data.id,
      meetLink: meetLink,
      htmlLink: response.data.htmlLink,
    }
  } catch (error: any) {
    console.error('Error creando evento de Google Meet:', error)
    if (error.response) {
      console.error('Error response:', error.response.data)
      console.error('Error status:', error.response.status)
      console.error('Error headers:', error.response.headers)
    }
    throw error
  }
}

/**
 * Genera un link de Google Meet sin crear evento en el calendario
 * (Alternativa más simple si no se necesita sincronización)
 * 
 * Nota: Google Meet requiere que los enlaces se generen a través de su API
 * o creando eventos en el calendario. Esta función genera un ID único que
 * puede usarse, pero el enlace real debe ser creado manualmente o a través de la API.
 * 
 * Para producción, se recomienda usar Google Calendar API o crear los enlaces
 * manualmente desde Google Calendar/Meet.
 */
export function generateGoogleMeetLink(): string {
  // Genera un ID único para la reunión
  // Formato: 3 grupos de letras/números separados por guiones
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const generateGroup = () => {
    let group = ''
    for (let i = 0; i < 3; i++) {
      group += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return group
  }
  
  const meetingId = `${generateGroup()}-${generateGroup()}-${generateGroup()}`
  return `https://meet.google.com/${meetingId}`
}

