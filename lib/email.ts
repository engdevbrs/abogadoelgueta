import { Resend } from 'resend'

// Inicializar Resend (se configurará con variable de entorno)
// Si no hay API key, Resend fallará silenciosamente en desarrollo
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@abogadoelgueta.cl'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@abogadoelgueta.cl'
const BANCO_CUENTA = process.env.BANCO_CUENTA || 'Cuenta bancaria pendiente de configuración'
const BANCO_TIPO = process.env.BANCO_TIPO || 'Tipo de cuenta'
const BANCO_NUMERO = process.env.BANCO_NUMERO || 'Número de cuenta'
const BANCO_RUT = process.env.BANCO_RUT || ''
const BANCO_NOMBRE_TITULAR = process.env.BANCO_NOMBRE_TITULAR || 'Abogado Elgueta'

/**
 * Template base HTML para emails
 */
function getEmailTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Abogado Elgueta</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; line-height: 1.6; color: #333;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-collapse: collapse; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #0a1e3a 0%, #1a3a5a 100%); padding: 30px 20px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">
                    Abogado Elgueta
                  </h1>
                  <p style="margin: 8px 0 0 0; color: #e0e0e0; font-size: 14px; font-weight: 300;">
                    Asesoría Legal Profesional
                  </p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  ${content}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #0a1e3a; padding: 20px 30px; text-align: center;">
                  <p style="margin: 0; color: #ffffff; font-size: 12px; line-height: 1.5;">
                    Este es un correo automático, por favor no responda a este mensaje.<br>
                    © ${new Date().getFullYear()} Abogado Elgueta. Todos los derechos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

interface ConfirmacionCitaData {
  nombre: string
  motivoConsulta: string
}

interface AprobacionCitaData {
  nombre: string
  motivoConsulta: string
  googleMeetLink: string
  fechaSolicitada?: Date | null
}

/**
 * Envía email de confirmación cuando se recibe una solicitud de cita
 */
export async function sendConfirmacionCitaEmail(
  to: string,
  data: ConfirmacionCitaData
) {
  if (!resend) {
    console.warn('Resend no está configurado. Email no enviado.')
    return null
  }

  try {
    const htmlContent = `
      <h2 style="color: #0a1e3a; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
        Confirmación de Solicitud de Consulta
      </h2>
      
      <p style="margin: 0 0 16px 0; font-size: 16px; color: #333;">
        Estimado/a <strong style="color: #0a1e3a;">${data.nombre}</strong>,
      </p>
      
      <p style="margin: 0 0 20px 0; font-size: 16px; color: #555; line-height: 1.6;">
        Hemos recibido su solicitud de consulta legal sobre: <strong style="color: #0a1e3a;">${data.motivoConsulta}</strong>
      </p>
      
      <p style="margin: 0 0 30px 0; font-size: 16px; color: #555; line-height: 1.6;">
        Su solicitud ha sido registrada y está pendiente de revisión y aprobación.
      </p>
      
      <div style="background-color: #f8f9fa; border-left: 4px solid #0a1e3a; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <h3 style="color: #0a1e3a; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
          💳 Información de Pago
        </h3>
        <p style="margin: 0 0 12px 0; font-size: 15px; color: #555; line-height: 1.6;">
          Para procesar su solicitud, le solicitamos realizar el abono correspondiente a la siguiente cuenta:
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #333; font-size: 14px; width: 140px;">Banco:</td>
            <td style="padding: 8px 0; color: #555; font-size: 14px;">${BANCO_CUENTA}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #333; font-size: 14px;">Tipo de Cuenta:</td>
            <td style="padding: 8px 0; color: #555; font-size: 14px;">${BANCO_TIPO}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #333; font-size: 14px;">Número de Cuenta:</td>
            <td style="padding: 8px 0; color: #555; font-size: 14px; font-family: monospace;">${BANCO_NUMERO}</td>
          </tr>
          ${BANCO_RUT ? `
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #333; font-size: 14px;">RUT:</td>
            <td style="padding: 8px 0; color: #555; font-size: 14px;">${BANCO_RUT}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #333; font-size: 14px;">Titular:</td>
            <td style="padding: 8px 0; color: #555; font-size: 14px;">${BANCO_NOMBRE_TITULAR}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #e8f4f8; border: 1px solid #0a1e3a; border-radius: 6px; padding: 20px; margin: 30px 0; text-align: center;">
        <p style="margin: 0 0 12px 0; font-size: 15px; color: #0a1e3a; font-weight: 600;">
          ⏳ Próximos Pasos
        </p>
        <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">
          Una vez que hayamos verificado el pago, aprobaremos su solicitud y le enviaremos un correo con el enlace para unirse a la videollamada mediante Google Meet.
        </p>
      </div>
      
      <p style="margin: 30px 0 0 0; font-size: 15px; color: #555; line-height: 1.6;">
        Si tiene alguna consulta, no dude en contactarnos.
      </p>
      
      <p style="margin: 30px 0 0 0; font-size: 15px; color: #333; line-height: 1.6;">
        Atentamente,<br>
        <strong style="color: #0a1e3a;">Abogado Elgueta</strong>
      </p>
    `

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Confirmación de Solicitud de Consulta - Abogado Elgueta',
      html: getEmailTemplate(htmlContent),
      text: `
        Confirmación de Solicitud de Consulta - Abogado Elgueta

        Estimado/a ${data.nombre},

        Hemos recibido su solicitud de consulta legal sobre: ${data.motivoConsulta}

        Su solicitud ha sido registrada y está pendiente de revisión y aprobación.

        Información de Pago:
        Tipo de Cuenta: ${BANCO_TIPO}
        Número de Cuenta: ${BANCO_NUMERO}
        Banco: ${BANCO_CUENTA}

        Una vez que hayamos verificado el pago, aprobaremos su solicitud y le enviaremos un correo con el enlace para unirse a la videollamada mediante Google Meet.

        Atentamente,
        Abogado Elgueta
      `,
    })

    if (error) {
      console.error('Error enviando email:', error)
      throw error
    }

    return emailData
  } catch (error) {
    console.error('Error en sendConfirmacionCitaEmail:', error)
    throw error
  }
}

/**
 * Envía email cuando una cita es aprobada con el link de Google Meet
 */
export async function sendAprobacionCitaEmail(
  to: string,
  data: AprobacionCitaData
) {
  if (!resend) {
    console.warn('Resend no está configurado. Email no enviado.')
    return null
  }

  try {
    const fecha = data.fechaSolicitada 
      ? new Intl.DateTimeFormat('es-CL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(data.fechaSolicitada))
      : 'A confirmar'

    const htmlContent = `
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px; border-radius: 8px; display: inline-block;">
          <p style="margin: 0; font-size: 18px; font-weight: 600;">✓ Su Consulta ha sido Aprobada</p>
        </div>
      </div>
      
      <h2 style="color: #0a1e3a; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
        ¡Bienvenido/a!
      </h2>
      
      <p style="margin: 0 0 16px 0; font-size: 16px; color: #333;">
        Estimado/a <strong style="color: #0a1e3a;">${data.nombre}</strong>,
      </p>
      
      <p style="margin: 0 0 30px 0; font-size: 16px; color: #555; line-height: 1.6;">
        Nos complace informarle que su solicitud de consulta sobre: <strong style="color: #0a1e3a;">${data.motivoConsulta}</strong> ha sido aprobada.
      </p>
      
      <div style="background-color: #f8f9fa; border-left: 4px solid #0a1e3a; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <h3 style="color: #0a1e3a; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
          📅 Detalles de la Consulta
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #333; font-size: 14px; width: 120px;">Fecha y Hora:</td>
            <td style="padding: 8px 0; color: #555; font-size: 14px;">${fecha}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #333; font-size: 14px;">Motivo:</td>
            <td style="padding: 8px 0; color: #555; font-size: 14px;">${data.motivoConsulta}</td>
          </tr>
        </table>
      </div>

      <div style="background: linear-gradient(135deg, #e8f4f8 0%, #d1e7dd 100%); border: 2px solid #0a1e3a; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
        <h3 style="color: #0a1e3a; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">
          🎥 Unirse a la Videollamada
        </h3>
        <p style="margin: 0 0 20px 0; font-size: 15px; color: #555; line-height: 1.6;">
          Puede unirse a la consulta mediante Google Meet en el siguiente enlace:
        </p>
        <a href="${data.googleMeetLink}" style="display: inline-block; background-color: #0a1e3a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: background-color 0.3s;">
          Unirse a Google Meet
        </a>
        <p style="margin: 20px 0 0 0; font-size: 13px; color: #666; line-height: 1.6;">
          O copie este enlace en su navegador:<br>
          <span style="word-break: break-all; font-family: monospace; color: #0a1e3a;">${data.googleMeetLink}</span>
        </p>
      </div>

      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px; color: #856404; line-height: 1.6;">
          <strong>💡 Recomendación:</strong> Le recomendamos unirse unos minutos antes de la hora programada para verificar que todo funcione correctamente.
        </p>
      </div>
      
      <p style="margin: 30px 0 0 0; font-size: 15px; color: #555; line-height: 1.6;">
        Si tiene alguna consulta o necesita cambiar la fecha/hora, por favor contáctenos con anticipación.
      </p>
      
      <p style="margin: 30px 0 0 0; font-size: 15px; color: #333; line-height: 1.6;">
        Esperamos verle pronto.<br>
        Atentamente,<br>
        <strong style="color: #0a1e3a;">Abogado Elgueta</strong>
      </p>
    `

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: '✅ Su Consulta ha sido Aprobada - Abogado Elgueta',
      html: getEmailTemplate(htmlContent),
      text: `
        Su Consulta ha sido Aprobada - Abogado Elgueta

        Estimado/a ${data.nombre},

        Nos complace informarle que su solicitud de consulta sobre: ${data.motivoConsulta} ha sido aprobada.

        Detalles de la Consulta:
        Fecha y Hora: ${fecha}

        Unirse a la Videollamada:
        Puede unirse a la consulta mediante Google Meet en el siguiente enlace:
        ${data.googleMeetLink}

        Le recomendamos unirse unos minutos antes de la hora programada para verificar que todo funcione correctamente.

        Atentamente,
        Abogado Elgueta
      `,
    })

    if (error) {
      console.error('Error enviando email:', error)
      throw error
    }

    return emailData
  } catch (error) {
    console.error('Error en sendAprobacionCitaEmail:', error)
    throw error
  }
}

