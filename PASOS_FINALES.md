# ✅ Pasos Finales - Probar la Configuración

## 🚀 Paso 1: Reiniciar el Servidor

**MUY IMPORTANTE**: Las variables de entorno en `.env` solo se cargan cuando inicias el servidor.

Si el servidor está corriendo:
1. Ve a la terminal donde corre `npm run dev`
2. Presiona **Ctrl + C** para detenerlo
3. Reinicia con:
   ```bash
   npm run dev
   ```

---

## 🧪 Paso 2: Probar Todo Funciona

### A. Probar Google Calendar API

1. **Crear una solicitud de cita de prueba**:
   - Ve a `http://localhost:3000`
   - Llena el formulario "Solicita una Consulta"
   - Selecciona un motivo y una fecha/hora
   - Envía la solicitud

2. **Aprobar la cita**:
   - Inicia sesión en el dashboard: `http://localhost:3000/dashboard/login`
   - Ve a la solicitud recién creada
   - Haz clic en **"Aprobar Cita"** (o primero "Marcar como Pago Pendiente" y luego "Aprobar Cita")

3. **Verificar que funcione**:
   - ✅ Deberías ver un **enlace de Google Meet** en la cita aprobada
   - ✅ En la consola del servidor, deberías ver mensajes de éxito (no errores)
   - ✅ El cliente debería recibir un email con el enlace

4. **Verificar en Google Calendar**:
   - Abre [Google Calendar](https://calendar.google.com) con `adelguetap@gmail.com`
   - Deberías ver un evento nuevo con la cita
   - El evento debe tener un enlace de Google Meet

### B. Verificar Emails

1. **Revisa el buzón del email del cliente**:
   - Email de confirmación (al solicitar la cita)
   - Email de aprobación (al aprobar la cita con el link de Google Meet)

2. **Si no recibes emails**:
   - Verifica `RESEND_API_KEY` en `.env`
   - Revisa los logs en Resend: https://resend.com/emails
   - Revisa la consola del servidor para errores

---

## ✅ Qué Deberías Ver si Todo Funciona

### En el Dashboard:
- ✅ La cita muestra estado "Aprobada" (badge verde)
- ✅ Aparece una sección verde con el enlace de Google Meet
- ✅ Botón "Unirse a la Reunión" funciona

### En Google Calendar:
- ✅ Evento creado con:
  - Título: "Consulta Legal: [Motivo]"
  - Fecha y hora correctas
  - Enlace de Google Meet
  - Cliente como invitado

### En los Emails:
- ✅ Email de confirmación con información bancaria
- ✅ Email de aprobación con enlace de Google Meet

---

## 🔍 Revisar Logs del Servidor

Mientras pruebas, observa la consola donde corre `npm run dev`:

### ✅ Si todo funciona:
```
Email enviado exitosamente
Evento creado en Google Calendar
Google Meet link: https://meet.google.com/xxx-xxxx-xxx
```

### ❌ Si hay errores:
- **"unauthorized_client"**: Los tokens están inválidos, regenera en OAuth Playground
- **"Resend no está configurado"**: Verifica `RESEND_API_KEY` en `.env`
- **"Error enviando email"**: Revisa la configuración de Resend

---

## 🎉 ¡Listo!

Si todo funciona correctamente, tu aplicación está completamente configurada y lista para usar:

- ✅ **Emails**: Se envían desde `adrianep@elguetabogado.cl`
- ✅ **Google Meet**: Links se generan automáticamente
- ✅ **Google Calendar**: Eventos se crean automáticamente
- ✅ **Dashboard**: Funciona correctamente

---

¿Funciona todo correctamente? Si hay algún error, comparte el mensaje que aparece en la consola.

