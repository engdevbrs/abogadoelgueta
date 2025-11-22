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
}) {
  try {
    const calendar = google.calendar({ version: 'v3', auth })

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
      attendees: data.attendeeEmail
        ? [
            {
              email: data.attendeeEmail,
              displayName: data.attendeeName,
            },
          ]
        : undefined,
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: event,
    })

    const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri

    if (!meetLink) {
      throw new Error('No se pudo generar el link de Google Meet')
    }

    return {
      eventId: response.data.id,
      meetLink: meetLink,
      htmlLink: response.data.htmlLink,
    }
  } catch (error) {
    console.error('Error creando evento de Google Meet:', error)
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

