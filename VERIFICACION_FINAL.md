# ✅ Verificación Final - Configuración Completa

## 🔍 Verifica tu archivo `.env`

Asegúrate de que tu archivo `.env` tenga estas variables configuradas:

```env
# Google Calendar API
GOOGLE_CLIENT_ID="tu-client-id-aqui"
GOOGLE_CLIENT_SECRET="tu-client-secret-aqui"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/callback/google"
GOOGLE_ACCESS_TOKEN="ya29.xxxxxxxxxxxx"
GOOGLE_REFRESH_TOKEN="1//0gxxxxxxxxxxxx"

# Resend (Emails)
RESEND_API_KEY="re_xxxxxxxxxxxx"
FROM_EMAIL="adrianep@elguetabogado.cl"
ADMIN_EMAIL="adrianep@elguetabogado.cl"
```

---

## 🚀 Paso 1: Reiniciar el Servidor

Si tu servidor está corriendo, detenlo y reinícialo:

1. En la terminal donde corre `npm run dev`, presiona **Ctrl + C**
2. Reinicia el servidor:
   ```bash
   npm run dev
   ```

⚠️ **IMPORTANTE**: Los cambios en `.env` solo se aplican cuando reinicias el servidor.

---

## 🧪 Paso 2: Probar la Configuración

### Opción A: Probar Aprobando una Cita (Recomendado)

1. Ve a tu aplicación: `http://localhost:3000`
2. Si no tienes una cita de prueba, crea una desde el formulario público
3. Inicia sesión en el dashboard: `http://localhost:3000/dashboard/login`
4. Ve a una solicitud de cita (estado "Pendiente" o "Pago Pendiente")
5. Haz clic en **"Aprobar Cita"**
6. **Deberías ver**:
   - ✅ Estado cambia a "Aprobada"
   - ✅ Aparece un enlace de Google Meet en la cita
   - ✅ El cliente recibe un email con el enlace

### Opción B: Verificar en Google Calendar

1. Abre [Google Calendar](https://calendar.google.com) con `adelguetap@gmail.com`
2. Deberías ver un evento nuevo creado con:
   - Título: "Consulta Legal: [Motivo]"
   - Fecha y hora de la cita
   - Link de Google Meet incluido
   - Cliente como invitado

---

## ✅ Qué Debería Funcionar Ahora

1. ✅ **Emails se envían** desde `adrianep@elguetabogado.cl`
   - Confirmación de solicitud (con información bancaria)
   - Aprobación de cita (con enlace de Google Meet)

2. ✅ **Google Meet links se generan** automáticamente
   - Cuando apruebas una cita
   - Se crea evento en el calendario de `adelguetap@gmail.com`
   - Link único para cada cita

3. ✅ **Eventos en Google Calendar**
   - Se crean automáticamente al aprobar citas
   - Incluyen fecha, hora, motivo y enlace de Google Meet

---

## 🔍 Verificar Logs

Mientras pruebas, revisa la consola del servidor (donde corre `npm run dev`):

### Si TODO funciona, deberías ver:
```
✅ Email enviado exitosamente
✅ Evento creado en Google Calendar
✅ Google Meet link generado: https://meet.google.com/xxx-xxxx-xxx
```

### Si hay errores:
- **Error con Google Calendar**: Verifica los tokens en `.env`
- **Error con emails**: Verifica `RESEND_API_KEY` en `.env`
- **Error de autorización**: Los tokens pueden estar expirados, regéneralos

---

## 📧 Verificar Emails

1. **Email de confirmación** (cuando se solicita una cita):
   - Revisa el buzón del cliente (o el email que usaste para la prueba)
   - Debe incluir información bancaria
   - Debe indicar que está pendiente de pago

2. **Email de aprobación** (cuando apruebas una cita):
   - Debe incluir el enlace de Google Meet
   - Debe mostrar la fecha y hora de la cita

---

## 🎉 ¡Todo Listo!

Si todo funciona correctamente, tu aplicación está completamente configurada:

- ✅ Google Calendar API configurada
- ✅ Google Meet links se generan automáticamente
- ✅ Emails se envían desde `adrianep@elguetabogado.cl`
- ✅ Eventos se crean en el calendario de `adelguetap@gmail.com`

---

## 🔄 Si Algo No Funciona

### Google Meet no se genera:
- Verifica que los tokens estén correctos en `.env`
- Revisa la consola del servidor para ver el error específico
- Si falla, el sistema usará un método alternativo y el email se enviará igual

### Emails no se envían:
- Verifica `RESEND_API_KEY` en `.env`
- Verifica que `FROM_EMAIL="adrianep@elguetabogado.cl"` esté configurado
- Revisa los logs en Resend: https://resend.com/emails

### Error "unauthorized_client":
- Los tokens pueden estar expirados
- Regenera los tokens en OAuth Playground usando `adelguetap@gmail.com`

---

¡Pruébalo y dime cómo va! 🚀

