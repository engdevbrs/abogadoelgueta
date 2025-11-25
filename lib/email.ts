import { Resend } from 'resend'

// Inicializar Resend (se configurará con variable de entorno)
// Si no hay API key, Resend fallará silenciosamente en desarrollo
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM_EMAIL = process.env.FROM_EMAIL || 'adrianep@elguetabogado.cl'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'adrianep@elguetabogado.cl'
const GOOGLE_CALENDAR_EMAIL = process.env.GOOGLE_CALENDAR_EMAIL || 'adelguetap@gmail.com'
const BANCO_CUENTA = process.env.BANCO_CUENTA || 'Cuenta bancaria pendiente de configuración'
const BANCO_TIPO = process.env.BANCO_TIPO || 'Tipo de cuenta'
const BANCO_NUMERO = process.env.BANCO_NUMERO || 'Número de cuenta'
const BANCO_RUT = process.env.BANCO_RUT || ''
const BANCO_NOMBRE_TITULAR = process.env.BANCO_NOMBRE_TITULAR || 'Abogado Elgueta'

/**
 * Template base HTML para emails con soporte para modo claro y oscuro
 */
function getEmailTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <title>Abogado Elgueta</title>
      <style>
        /* Contenedor principal - márgenes verticales aumentados */
        .email-container {
          padding-top: 80px !important;
          padding-bottom: 80px !important;
          padding-left: 20px !important;
          padding-right: 20px !important;
        }
        
        /* Soporte para modo oscuro */
        @media (prefers-color-scheme: dark) {
          .email-container {
            background-color: #1a1a1a !important;
            padding-top: 80px !important;
            padding-bottom: 80px !important;
          }
          .email-content {
            background-color: #2d2d2d !important;
            color: #e0e0e0 !important;
          }
          .email-text {
            color: #e0e0e0 !important;
          }
          .email-text-secondary {
            color: #b0b0b0 !important;
          }
          .email-card {
            background-color: #3a3a3a !important;
          }
          /* Header - colores neutros compatibles con ambos modos */
          .email-header {
            background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%) !important;
          }
          .email-header h1 {
            color: #ffffff !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;
          }
          .email-header p {
            color: #ffffff !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;
          }
          /* Footer - colores neutros para modo oscuro */
          .email-footer {
            background-color: #2d3748 !important;
          }
          .email-footer p {
            color: #ffffff !important;
          }
          /* Sección de videollamada - colores neutros para modo oscuro */
          .email-videocall-section {
            background: linear-gradient(135deg, #3a4655 0%, #2d3748 100%) !important;
            border: 2px solid #4a5568 !important;
          }
          .email-videocall-section h3 {
            color: #000000 !important;
          }
          .email-videocall-section p {
            color: #1a1a1a !important;
          }
          .email-videocall-link {
            color: #cbd5e0 !important;
          }
          /* Botones - colores neutros para modo oscuro */
          .email-button {
            background-color: #4a5568 !important;
            color: #ffffff !important;
            border: 1px solid #2d3748 !important;
          }
          .email-button:hover {
            background-color: #3a4655 !important;
          }
          /* Mejorar contraste de enlaces */
          a {
            color: #60a5fa !important;
          }
        }
        
        /* Asegurar que los textos principales sean legibles */
        .email-text {
          color: #333333;
        }
        .email-text-secondary {
          color: #555555;
        }
        .email-card {
          background-color: #f8f9fa;
        }
        
        /* Prevenir inversión automática problemática en modo oscuro */
        [data-ogsc] .email-container {
          background-color: #f4f4f4 !important;
        }
        [data-ogsc] .email-content {
          background-color: #ffffff !important;
          color: #333333 !important;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; line-height: 1.6; color: #333333;">
      <table role="presentation" class="email-container" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 80px 20px 80px 20px;">
        <tr>
          <td align="center" style="padding: 0;">
            <table role="presentation" class="email-content" style="width: 100%; max-width: 600px; background-color: #ffffff; border-collapse: collapse; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 0 auto;">
              <!-- Header -->
              <tr>
                <td class="email-header" style="background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%); padding: 30px 20px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff !important; font-size: 28px; font-weight: 700; letter-spacing: 0.5px; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                    Abogado Elgueta
                  </h1>
                  <p style="margin: 8px 0 0 0; color: #ffffff !important; font-size: 14px; font-weight: 300; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                    Asesoría Legal Profesional
                  </p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td class="email-content" style="padding: 40px 30px; background-color: #ffffff; color: #333333;">
                  ${content}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td class="email-footer" style="background-color: #2d3748; padding: 20px 30px; text-align: center;">
                  <p class="email-footer" style="margin: 0; color: #ffffff; font-size: 12px; line-height: 1.5;">
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

interface PagoPendienteCitaData {
  nombre: string
  motivoConsulta: string
  fechaSolicitada?: Date | null
}

interface AprobacionCitaData {
  nombre: string
  motivoConsulta: string
  googleMeetLink?: string
  fechaSolicitada?: Date | null
}

interface NotificacionNuevaCitaData {
  nombre: string
  email: string
  telefono?: string | null
  motivoConsulta: string
  mensaje?: string | null
  fechaSolicitada?: Date | null
  citaId: string
}

interface NotificacionContactoData {
  nombre: string
  email: string
  telefono?: string | null
  asunto: string
  mensaje: string
  contactoId: string
}

interface ConfirmacionContactoData {
  nombre: string
  asunto: string
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
      <h2 class="email-text" style="color: #0a1e3a; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
        Confirmación de Solicitud de Consulta
      </h2>
      
      <p class="email-text" style="margin: 0 0 16px 0; font-size: 16px; color: #333333;">
        Estimado/a <strong style="color: #0a1e3a;">${data.nombre}</strong>,
      </p>
      
      <p class="email-text-secondary" style="margin: 0 0 20px 0; font-size: 16px; color: #555555; line-height: 1.6;">
        Hemos recibido su solicitud de consulta legal sobre: <strong style="color: #0a1e3a;">${data.motivoConsulta}</strong>
      </p>
      
      <p class="email-text-secondary" style="margin: 0 0 30px 0; font-size: 16px; color: #555555; line-height: 1.6;">
        Su solicitud ha sido registrada y está pendiente de revisión y aprobación.
      </p>
      
      <div class="email-card" style="background-color: #f8f9fa; border-left: 4px solid #0a1e3a; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <h3 style="color: #0a1e3a; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
          💳 Información de Pago
        </h3>
        <p class="email-text-secondary" style="margin: 0 0 12px 0; font-size: 15px; color: #555555; line-height: 1.6;">
          Para procesar su solicitud, le solicitamos realizar el abono correspondiente a la siguiente cuenta:
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td class="email-text" style="padding: 8px 0; font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Banco:</td>
            <td class="email-text-secondary" style="padding: 8px 0; color: #555555; font-size: 14px;">${BANCO_CUENTA}</td>
          </tr>
          <tr>
            <td class="email-text" style="padding: 8px 0; font-weight: 600; color: #333333; font-size: 14px;">Tipo de Cuenta:</td>
            <td class="email-text-secondary" style="padding: 8px 0; color: #555555; font-size: 14px;">${BANCO_TIPO}</td>
          </tr>
          <tr>
            <td class="email-text" style="padding: 8px 0; font-weight: 600; color: #333333; font-size: 14px;">Número de Cuenta:</td>
            <td class="email-text-secondary" style="padding: 8px 0; color: #555555; font-size: 14px; font-family: monospace; word-break: break-all;">${BANCO_NUMERO}</td>
          </tr>
          <tr>
            <td class="email-text" style="padding: 8px 0; font-weight: 600; color: #333333; font-size: 14px;">RUT:</td>
            <td class="email-text-secondary" style="padding: 8px 0; color: #555555; font-size: 14px;">${BANCO_RUT || 'No especificado'}</td>
          </tr>
          <tr>
            <td class="email-text" style="padding: 8px 0; font-weight: 600; color: #333333; font-size: 14px;">Titular:</td>
            <td class="email-text-secondary" style="padding: 8px 0; color: #555555; font-size: 14px;">${BANCO_NOMBRE_TITULAR}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #e8f4f8; border: 1px solid #0a1e3a; border-radius: 6px; padding: 20px; margin: 30px 0; text-align: center;">
        <p style="margin: 0 0 12px 0; font-size: 15px; color: #0a1e3a; font-weight: 600;">
          ⏳ Próximos Pasos
        </p>
        <p class="email-text-secondary" style="margin: 0; font-size: 14px; color: #555555; line-height: 1.6;">
          Una vez que hayamos verificado el pago, aprobaremos su solicitud y le enviaremos un correo con el enlace para unirse a la videollamada mediante Google Meet.
        </p>
      </div>
      
      <p class="email-text-secondary" style="margin: 30px 0 0 0; font-size: 15px; color: #555555; line-height: 1.6;">
        Si tiene alguna consulta, no dude en contactarnos.
      </p>
      
      <p class="email-text" style="margin: 30px 0 0 0; font-size: 15px; color: #333333; line-height: 1.6;">
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
        Banco: ${BANCO_CUENTA}
        Tipo de Cuenta: ${BANCO_TIPO}
        Número de Cuenta: ${BANCO_NUMERO}
        RUT: ${BANCO_RUT || 'No especificado'}
        Titular: ${BANCO_NOMBRE_TITULAR}

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
 * Envía email cuando una cita se marca como Pago Pendiente
 */
export async function sendPagoPendienteCitaEmail(
  to: string,
  data: PagoPendienteCitaData
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
          timeZone: 'America/Santiago', // Especificar zona horaria de Chile
        }).format(new Date(data.fechaSolicitada))
      : 'A confirmar'

    const htmlContent = `
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; padding: 15px; border-radius: 8px; display: inline-block;">
          <p style="margin: 0; font-size: 18px; font-weight: 600;">⏳ Pago Pendiente</p>
        </div>
      </div>
      
      <h2 class="email-text" style="color: #0a1e3a; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
        Recordatorio de Pago
      </h2>
      
      <p class="email-text" style="margin: 0 0 16px 0; font-size: 16px; color: #333333;">
        Estimado/a <strong style="color: #0a1e3a;">${data.nombre}</strong>,
      </p>
      
      <p class="email-text-secondary" style="margin: 0 0 20px 0; font-size: 16px; color: #555555; line-height: 1.6;">
        Le recordamos que su solicitud de consulta legal sobre: <strong style="color: #0a1e3a;">${data.motivoConsulta}</strong> está pendiente de pago.
      </p>
      
      ${data.fechaSolicitada ? `
      <div class="email-card" style="background-color: #f8f9fa; border-left: 4px solid #0a1e3a; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <h3 style="color: #0a1e3a; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
          📅 Fecha de Consulta Solicitada
        </h3>
        <p class="email-text-secondary" style="margin: 0; font-size: 16px; color: #555555; font-weight: 600;">
          ${fecha}
        </p>
      </div>
      ` : ''}
      
      <div style="background-color: #fff3cd; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
          ⚠️ Importante
        </h3>
        <p style="margin: 0 0 12px 0; font-size: 15px; color: #856404; line-height: 1.6;">
          Para proceder con la aprobación de su consulta, necesitamos verificar el pago correspondiente.
        </p>
        <p style="margin: 0; font-size: 15px; color: #856404; line-height: 1.6;">
          Una vez verificado el pago, aprobaremos su solicitud y le enviaremos el enlace para unirse a la videollamada mediante Google Meet.
        </p>
      </div>
      
      <div class="email-card" style="background-color: #f8f9fa; border-left: 4px solid #0a1e3a; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <h3 style="color: #0a1e3a; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
          💳 Información de Pago
        </h3>
        <p class="email-text-secondary" style="margin: 0 0 12px 0; font-size: 15px; color: #555555; line-height: 1.6;">
          Por favor, realice el abono correspondiente a la siguiente cuenta:
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td class="email-text" style="padding: 8px 0; font-weight: 600; color: #333333; font-size: 14px; width: 140px;">Banco:</td>
            <td class="email-text-secondary" style="padding: 8px 0; color: #555555; font-size: 14px;">${BANCO_CUENTA}</td>
          </tr>
          <tr>
            <td class="email-text" style="padding: 8px 0; font-weight: 600; color: #333333; font-size: 14px;">Tipo de Cuenta:</td>
            <td class="email-text-secondary" style="padding: 8px 0; color: #555555; font-size: 14px;">${BANCO_TIPO}</td>
          </tr>
          <tr>
            <td class="email-text" style="padding: 8px 0; font-weight: 600; color: #333333; font-size: 14px;">Número de Cuenta:</td>
            <td class="email-text-secondary" style="padding: 8px 0; color: #555555; font-size: 14px; font-family: monospace; word-break: break-all;">${BANCO_NUMERO}</td>
          </tr>
          <tr>
            <td class="email-text" style="padding: 8px 0; font-weight: 600; color: #333333; font-size: 14px;">RUT:</td>
            <td class="email-text-secondary" style="padding: 8px 0; color: #555555; font-size: 14px;">${BANCO_RUT || 'No especificado'}</td>
          </tr>
          <tr>
            <td class="email-text" style="padding: 8px 0; font-weight: 600; color: #333333; font-size: 14px;">Titular:</td>
            <td class="email-text-secondary" style="padding: 8px 0; color: #555555; font-size: 14px;">${BANCO_NOMBRE_TITULAR}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #e8f4f8; border: 1px solid #0a1e3a; border-radius: 6px; padding: 20px; margin: 30px 0; text-align: center;">
        <p style="margin: 0 0 12px 0; font-size: 15px; color: #0a1e3a; font-weight: 600;">
          ⏳ Próximos Pasos
        </p>
        <p class="email-text-secondary" style="margin: 0; font-size: 14px; color: #555555; line-height: 1.6;">
          Una vez que hayamos verificado el pago, aprobaremos su solicitud y le enviaremos un correo con el enlace para unirse a la videollamada mediante Google Meet.
        </p>
      </div>
      
      <p class="email-text-secondary" style="margin: 30px 0 0 0; font-size: 15px; color: #555555; line-height: 1.6;">
        Si ya realizó el pago o tiene alguna consulta, no dude en contactarnos.
      </p>
      
      <p class="email-text" style="margin: 30px 0 0 0; font-size: 15px; color: #333333; line-height: 1.6;">
        Atentamente,<br>
        <strong style="color: #0a1e3a;">Abogado Elgueta</strong>
      </p>
    `

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: '⏳ Pago Pendiente - Abogado Elgueta',
      html: getEmailTemplate(htmlContent),
      text: `
        Pago Pendiente - Abogado Elgueta

        Estimado/a ${data.nombre},

        Le recordamos que su solicitud de consulta legal sobre: ${data.motivoConsulta} está pendiente de pago.

        ${data.fechaSolicitada ? `
        Fecha de Consulta Solicitada:
        ${fecha}
        ` : ''}

        IMPORTANTE:
        Para proceder con la aprobación de su consulta, necesitamos verificar el pago correspondiente.
        Una vez verificado el pago, aprobaremos su solicitud y le enviaremos el enlace para unirse a la videollamada mediante Google Meet.

        Información de Pago:
        Banco: ${BANCO_CUENTA}
        Tipo de Cuenta: ${BANCO_TIPO}
        Número de Cuenta: ${BANCO_NUMERO}
        RUT: ${BANCO_RUT || 'No especificado'}
        Titular: ${BANCO_NOMBRE_TITULAR}

        Próximos Pasos:
        Una vez que hayamos verificado el pago, aprobaremos su solicitud y le enviaremos un correo con el enlace para unirse a la videollamada mediante Google Meet.

        Si ya realizó el pago o tiene alguna consulta, no dude en contactarnos.

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
    console.error('Error en sendPagoPendienteCitaEmail:', error)
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
          timeZone: 'America/Santiago', // Especificar zona horaria de Chile
        }).format(new Date(data.fechaSolicitada))
      : 'A confirmar'

    const htmlContent = `
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 15px; border-radius: 8px; display: inline-block;">
          <p style="margin: 0; font-size: 18px; font-weight: 600;">✓ Su Consulta ha sido Aprobada</p>
        </div>
      </div>
      
      <h2 class="email-text" style="color: #2d3748; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
        ¡Bienvenido/a!
      </h2>
      
      <p class="email-text" style="margin: 0 0 16px 0; font-size: 16px; color: #333333;">
        Estimado/a <strong style="color: #2d3748;">${data.nombre}</strong>,
      </p>
      
      <p class="email-text-secondary" style="margin: 0 0 30px 0; font-size: 16px; color: #555555; line-height: 1.6;">
        Nos complace informarle que su solicitud de consulta sobre: <strong style="color: #2d3748;">${data.motivoConsulta}</strong> ha sido aprobada.
      </p>
      
      <div class="email-card" style="background-color: #f8f9fa; border-left: 4px solid #4a5568; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
          📅 Detalles de la Consulta
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td class="email-text" style="padding: 8px 0; font-weight: 600; color: #333333; font-size: 14px; width: 120px;">Fecha y Hora:</td>
            <td class="email-text-secondary" style="padding: 8px 0; color: #555555; font-size: 14px;">${fecha}</td>
          </tr>
          <tr>
            <td class="email-text" style="padding: 8px 0; font-weight: 600; color: #333333; font-size: 14px;">Motivo:</td>
            <td class="email-text-secondary" style="padding: 8px 0; color: #555555; font-size: 14px;">${data.motivoConsulta}</td>
          </tr>
        </table>
      </div>

      ${data.googleMeetLink ? `
      <!-- Videollamada -->
      <div class="email-videocall-section" style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px solid #4a5568; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
        <h3 class="email-videocall-section" style="color: #000000 !important; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">
          🎥 Unirse a la Videollamada
        </h3>
        <p class="email-text-secondary email-videocall-section" style="margin: 0 0 20px 0; font-size: 15px; color: #1a1a1a !important; line-height: 1.6;">
          Puede unirse a la consulta mediante Google Meet en el siguiente enlace:
        </p>
        <a href="${data.googleMeetLink || '#'}" class="email-button" style="display: inline-block; background-color: #4a5568; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.2); border: 1px solid #2d3748;">
          Unirse a Google Meet
        </a>
        <p class="email-videocall-section" style="margin: 20px 0 0 0; font-size: 13px; color: #718096; line-height: 1.6;">
          O copie este enlace en su navegador:<br>
          <span class="email-videocall-link" style="word-break: break-all; font-family: monospace; color: #4a5568;">${data.googleMeetLink || 'Pendiente'}</span>
        </p>
      </div>
      ` : `
      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 15px; color: #856404; line-height: 1.6;">
          <strong>📧 Enlace de Google Meet:</strong> Se le enviará el enlace de la videollamada próximamente. Por favor, esté atento a su correo electrónico.
        </p>
      </div>
      `}

      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px; color: #856404; line-height: 1.6;">
          <strong>💡 Recomendación:</strong> Le recomendamos unirse unos minutos antes de la hora programada para verificar que todo funcione correctamente.
        </p>
      </div>
      
      <p class="email-text-secondary" style="margin: 30px 0 0 0; font-size: 15px; color: #555555; line-height: 1.6;">
        Si tiene alguna consulta o necesita cambiar la fecha/hora, por favor contáctenos con anticipación.
      </p>
      
      <p class="email-text" style="margin: 30px 0 0 0; font-size: 15px; color: #333333; line-height: 1.6;">
        Esperamos verle pronto.<br>
        Atentamente,<br>
        <strong style="color: #0a1e3a;">Abogado Elgueta</strong>
      </p>
    `

    // Enviar el email al cliente y también a adrianep@elguetabogado.cl
    // El remitente (from) se mantiene como adrianep@elguetabogado.cl
    // NOTA: adelguetap@gmail.com NO recibe este email, solo crea y envía las invitaciones de Google Calendar
    const recipients = [to] // Cliente
    if (ADMIN_EMAIL && ADMIN_EMAIL !== to) {
      recipients.push(ADMIN_EMAIL) // Agregar adrianep@elguetabogado.cl
    }
    // adelguetap@gmail.com NO se incluye en los destinatarios del email

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL, // Remitente: adrianep@elguetabogado.cl
      to: recipients,
      subject: '✅ Su Consulta ha sido Aprobada - Abogado Elgueta',
      html: getEmailTemplate(htmlContent),
      text: `
        Su Consulta ha sido Aprobada - Abogado Elgueta

        Estimado/a ${data.nombre},

        Nos complace informarle que su solicitud de consulta sobre: ${data.motivoConsulta} ha sido aprobada.

        Detalles de la Consulta:
        Fecha y Hora: ${fecha}

        ${data.googleMeetLink ? `
        Unirse a la Videollamada:
        Puede unirse a la consulta mediante Google Meet en el siguiente enlace:
        ${data.googleMeetLink}

        Le recomendamos unirse unos minutos antes de la hora programada para verificar que todo funcione correctamente.
        ` : `
        Enlace de Google Meet:
        Se le enviará el enlace de la videollamada próximamente. Por favor, esté atento a su correo electrónico.
        `}

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

/**
 * Envía email de notificación al administrador cuando se recibe una nueva solicitud de cita
 */
export async function sendNotificacionNuevaCitaEmail(
  data: NotificacionNuevaCitaData
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
          timeZone: 'America/Santiago', // Especificar zona horaria de Chile
        }).format(new Date(data.fechaSolicitada))
      : 'No especificada'

    const htmlContent = `
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: linear-gradient(135deg, #0a1e3a 0%, #1a3a5a 100%); color: white; padding: 15px; border-radius: 8px; display: inline-block;">
          <p style="margin: 0; font-size: 18px; font-weight: 600;">🔔 Nueva Solicitud de Consulta</p>
        </div>
      </div>
      
      <h2 style="color: #0a1e3a; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;" class="email-text">
        Has recibido una nueva solicitud de consulta
      </h2>
      
      <p style="margin: 0 0 30px 0; font-size: 16px;" class="email-text-secondary">
        Se ha recibido una nueva solicitud de consulta legal que requiere tu revisión.
      </p>
      
      <div class="email-card">
        <h3 style="color: #0a1e3a; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;" class="email-text">
          👤 Información del Cliente
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; font-size: 14px; width: 140px;" class="email-text">Nombre:</td>
            <td style="padding: 8px 0; font-size: 14px;" class="email-text-secondary">${data.nombre}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; font-size: 14px;" class="email-text">Email:</td>
            <td style="padding: 8px 0; font-size: 14px;" class="email-text-secondary">${data.email}</td>
          </tr>
          ${data.telefono ? `
          <tr>
            <td style="padding: 8px 0; font-weight: 600; font-size: 14px;" class="email-text">Teléfono:</td>
            <td style="padding: 8px 0; font-size: 14px;" class="email-text-secondary">${data.telefono}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <div class="email-card">
        <h3 style="color: #0a1e3a; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;" class="email-text">
          📋 Detalles de la Consulta
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; font-size: 14px; width: 140px;" class="email-text">Motivo:</td>
            <td style="padding: 8px 0; font-size: 14px;" class="email-text-secondary">${data.motivoConsulta}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; font-size: 14px;" class="email-text">Fecha Solicitada:</td>
            <td style="padding: 8px 0; font-size: 14px;" class="email-text-secondary">${fecha}</td>
          </tr>
          ${data.mensaje ? `
          <tr>
            <td style="padding: 8px 0; font-weight: 600; font-size: 14px; vertical-align: top;" class="email-text">Mensaje:</td>
            <td style="padding: 8px 0; font-size: 14px;" class="email-text-secondary">${data.mensaje}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <div style="background-color: #e8f4f8; border: 1px solid #0a1e3a; border-radius: 6px; padding: 20px; margin: 30px 0; text-align: center;" class="email-card">
        <p style="margin: 0 0 12px 0; font-size: 15px; color: #0a1e3a; font-weight: 600;" class="email-text">
          ⚡ Acción Requerida
        </p>
        <p style="margin: 0; font-size: 14px;" class="email-text-secondary">
          Por favor, revisa la solicitud en el dashboard y valida el pago para poder aprobar la consulta.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.elguetabogado.cl'}/dashboard" class="email-button">
          Ver Solicitud en el Dashboard
        </a>
      </div>
      
      <p style="margin: 30px 0 0 0; font-size: 15px;" class="email-text-secondary">
        ID de la solicitud: <span style="font-family: monospace; color: #0a1e3a;" class="email-text">${data.citaId}</span>
      </p>
    `

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `🔔 Nueva Solicitud de Consulta - ${data.nombre}`,
      html: getEmailTemplate(htmlContent),
      text: `
        Nueva Solicitud de Consulta - Abogado Elgueta

        Has recibido una nueva solicitud de consulta legal que requiere tu revisión.

        Información del Cliente:
        Nombre: ${data.nombre}
        Email: ${data.email}
        ${data.telefono ? `Teléfono: ${data.telefono}` : ''}

        Detalles de la Consulta:
        Motivo: ${data.motivoConsulta}
        Fecha Solicitada: ${fecha}
        ${data.mensaje ? `Mensaje: ${data.mensaje}` : ''}

        Acción Requerida:
        Por favor, revisa la solicitud en el dashboard y valida el pago para poder aprobar la consulta.

        ID de la solicitud: ${data.citaId}

        Ver solicitud en el dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'https://www.elguetabogado.cl'}/dashboard
      `,
    })

    if (error) {
      console.error('Error enviando email:', error)
      throw error
    }

    return emailData
  } catch (error) {
    console.error('Error en sendNotificacionNuevaCitaEmail:', error)
    throw error
  }
}

/**
 * Envía email de notificación al administrador cuando se recibe un mensaje de contacto
 */
export async function sendNotificacionContactoEmail(
  data: NotificacionContactoData
) {
  if (!resend) {
    console.warn('Resend no está configurado. Email no enviado.')
    return null
  }

  try {
    const htmlContent = `
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: linear-gradient(135deg, #0a1e3a 0%, #1a3a5a 100%); color: white; padding: 15px; border-radius: 8px; display: inline-block;">
          <p style="margin: 0; font-size: 18px; font-weight: 600;">📧 Nuevo Mensaje de Contacto</p>
        </div>
      </div>
      
      <h2 style="color: #0a1e3a; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;" class="email-text">
        Has recibido un nuevo mensaje
      </h2>
      
      <p style="margin: 0 0 30px 0; font-size: 16px;" class="email-text-secondary">
        Se ha recibido un nuevo mensaje a través del formulario de contacto en tu sitio web.
      </p>
      
      <div class="email-card">
        <h3 style="color: #0a1e3a; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;" class="email-text">
          👤 Información del Contacto
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; font-size: 14px; width: 140px;" class="email-text">Nombre:</td>
            <td style="padding: 8px 0; font-size: 14px;" class="email-text-secondary">${data.nombre}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; font-size: 14px;" class="email-text">Email:</td>
            <td style="padding: 8px 0; font-size: 14px;" class="email-text-secondary">${data.email}</td>
          </tr>
          ${data.telefono ? `
          <tr>
            <td style="padding: 8px 0; font-weight: 600; font-size: 14px;" class="email-text">Teléfono:</td>
            <td style="padding: 8px 0; font-size: 14px;" class="email-text-secondary">${data.telefono}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <div class="email-card">
        <h3 style="color: #0a1e3a; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;" class="email-text">
          📝 Detalles del Mensaje
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; font-size: 14px; width: 140px;" class="email-text">Asunto:</td>
            <td style="padding: 8px 0; font-size: 14px;" class="email-text-secondary">${data.asunto}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; font-size: 14px; vertical-align: top;" class="email-text">Mensaje:</td>
            <td style="padding: 8px 0; font-size: 14px; white-space: pre-wrap;" class="email-text-secondary">${data.mensaje}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #e8f4f8; border: 1px solid #0a1e3a; border-radius: 6px; padding: 20px; margin: 30px 0; text-align: center;" class="email-card">
        <p style="margin: 0; font-size: 14px;" class="email-text-secondary">
          Puedes responder directamente a este correo respondiendo a: <strong style="color: #0a1e3a;" class="email-text">${data.email}</strong>
        </p>
      </div>
      
      <p style="margin: 30px 0 0 0; font-size: 15px;" class="email-text-secondary">
        ID del mensaje: <span style="font-family: monospace; color: #0a1e3a;" class="email-text">${data.contactoId}</span>
      </p>
    `

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      reply_to: data.email, // Permite responder directamente al usuario
      subject: `📧 Nuevo Mensaje de Contacto - ${data.asunto}`,
      html: getEmailTemplate(htmlContent),
      text: `
        Nuevo Mensaje de Contacto - Abogado Elgueta

        Has recibido un nuevo mensaje a través del formulario de contacto en tu sitio web.

        Información del Contacto:
        Nombre: ${data.nombre}
        Email: ${data.email}
        ${data.telefono ? `Teléfono: ${data.telefono}` : ''}

        Detalles del Mensaje:
        Asunto: ${data.asunto}
        Mensaje: ${data.mensaje}

        Puedes responder directamente a este correo respondiendo a: ${data.email}

        ID del mensaje: ${data.contactoId}
      `,
    })

    if (error) {
      console.error('Error enviando email:', error)
      throw error
    }

    return emailData
  } catch (error) {
    console.error('Error en sendNotificacionContactoEmail:', error)
    throw error
  }
}

/**
 * Envía email de confirmación al usuario cuando se recibe su mensaje de contacto
 */
export async function sendConfirmacionContactoEmail(
  to: string,
  data: ConfirmacionContactoData
) {
  if (!resend) {
    console.warn('Resend no está configurado. Email no enviado.')
    return null
  }

  try {
    const htmlContent = `
      <h2 style="color: #0a1e3a; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;" class="email-text">
        Confirmación de Mensaje Recibido
      </h2>
      
      <p style="margin: 0 0 16px 0; font-size: 16px;" class="email-text">
        Estimado/a <strong style="color: #0a1e3a;" class="email-text">${data.nombre}</strong>,
      </p>
      
      <p style="margin: 0 0 20px 0; font-size: 16px;" class="email-text-secondary">
        Hemos recibido tu mensaje sobre: <strong style="color: #0a1e3a;" class="email-text">${data.asunto}</strong>
      </p>
      
      <p style="margin: 0 0 30px 0; font-size: 16px;" class="email-text-secondary">
        Te responderemos lo antes posible. Por favor, mantente atento a tu correo electrónico.
      </p>
      
      <div style="background-color: #e8f4f8; border: 1px solid #0a1e3a; border-radius: 6px; padding: 20px; margin: 30px 0; text-align: center;" class="email-card">
        <p style="margin: 0; font-size: 14px;" class="email-text-secondary">
          💡 Si tienes alguna consulta urgente, no dudes en contactarnos directamente por teléfono.
        </p>
      </div>
      
      <p style="margin: 30px 0 0 0; font-size: 15px;" class="email-text-secondary">
        Gracias por contactarnos.
      </p>
      
      <p style="margin: 30px 0 0 0; font-size: 15px;" class="email-text">
        Atentamente,<br>
        <strong style="color: #0a1e3a;" class="email-text">Abogado Elgueta</strong>
      </p>
    `

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Confirmación de Mensaje Recibido - ${data.asunto}`,
      html: getEmailTemplate(htmlContent),
      text: `
        Confirmación de Mensaje Recibido - Abogado Elgueta

        Estimado/a ${data.nombre},

        Hemos recibido tu mensaje sobre: ${data.asunto}

        Te responderemos lo antes posible. Por favor, mantente atento a tu correo electrónico.

        Si tienes alguna consulta urgente, no dudes en contactarnos directamente por teléfono.

        Gracias por contactarnos.

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
    console.error('Error en sendConfirmacionContactoEmail:', error)
    throw error
  }
}

