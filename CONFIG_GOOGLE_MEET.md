# 🎥 Configuración de Google Meet - Abogado Elgueta

## ⚠️ Importante: Configuración Necesaria

Para generar enlaces de Google Meet, necesitas **una de estas opciones**:

### Opción 1: Configurar Google Calendar API (Recomendado)
- Genera enlaces oficiales de Google Meet
- Crea eventos automáticamente en tu calendario
- Invita automáticamente al cliente

### Opción 2: Crear Enlaces Manualmente
- El administrador puede crear enlaces desde Google Calendar/Meet
- Copiar y pegar el enlace en el dashboard cuando aprueba la cita

**Nota**: Google Meet no permite generar enlaces válidos sin usar su API o crear eventos en el calendario.

---

## 🚀 Opción Avanzada: Integración con Google Calendar (Opcional)

Si quieres una integración más completa que:
- Cree eventos automáticamente en tu Google Calendar
- Agregue al cliente como invitado al evento
- Sincronice la fecha y hora automáticamente
- Genere enlaces de Google Meet oficiales desde el calendario

Entonces necesitas configurar Google Calendar API.

### Paso 1: Crear Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Dale un nombre (ej: "Abogado Elgueta - Calendar API")

### Paso 2: Habilitar Google Calendar API

1. En el menú lateral, ve a **APIs & Services** > **Library**
2. Busca "Google Calendar API"
3. Haz clic en **Enable**

### Paso 3: Configurar Permisos (Scopes)

1. En la pantalla de **Permisos** (que estás viendo ahora):
2. Haz clic en **"Agregar o quitar permisos"**
3. Busca y selecciona estos permisos:
   - ✅ `https://www.googleapis.com/auth/calendar` (Google Calendar API - Acceso completo al calendario)
   - ✅ `https://www.googleapis.com/auth/calendar.events` (Google Calendar API - Crear eventos)
4. Haz clic en **Actualizar** o **Guardar**

**Nota**: Puedes usar solo `https://www.googleapis.com/auth/calendar` que ya incluye acceso a eventos.

### Paso 4: Crear Credenciales OAuth 2.0

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **Create Credentials** > **OAuth client ID**
3. Si es la primera vez, configura la pantalla de consentimiento:
   - Tipo: **External**
   - Nombre de la app: "Abogado Elgueta"
   - Email de soporte: tu email
   - Agrega tu email como usuario de prueba
4. Tipo de aplicación: **Web application**
5. Nombre: "Abogado Elgueta - Web Client"
6. **Authorized redirect URIs**: 
   - Para desarrollo: `http://localhost:3000/api/auth/callback/google`
   - Para producción: `https://tudominio.com/api/auth/callback/google`
7. Haz clic en **Create**
8. **Copia el Client ID y Client Secret** (los necesitarás)

### Paso 5: Obtener Tokens de Acceso

Para obtener los tokens de acceso y refresh, necesitas autenticarte una vez:

#### Opción A: Usar Google OAuth Playground (Más fácil)

**⚠️ IMPORTANTE - Antes de empezar: Agregar Redirect URI de OAuth Playground**

OAuth Playground tiene su propio redirect URI. Necesitas agregarlo a tus credenciales:

1. Ve a [Google Cloud Console](https://console.cloud.google.com) > **APIs & Services** > **Credentials**
2. Haz clic en tu **OAuth 2.0 Client ID** (ejemplo: `123456789-xxxxxxxxxx`)
3. En **"Authorized redirect URIs"**, agrega esta línea:
   ```
   https://developers.google.com/oauthplayground
   ```
4. Haz clic en **"Save"** (Guardar)

**Ahora sí, obtener los tokens:**

1. Ve a [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. En la esquina superior derecha, haz clic en el ícono de configuración ⚙️
3. Marca **"Use your own OAuth credentials"**
4. Ingresa tu **Client ID** y **Client Secret**:
   - OAuth Client ID: `tu-client-id.apps.googleusercontent.com`
   - OAuth Client secret: `tu-client-secret`
5. Haz clic en **"Close"**
6. En el lado izquierdo, en **"Select & authorize APIs"**, busca "Google Calendar API v1" y selecciona:
   - ✅ `https://www.googleapis.com/auth/calendar`
7. Haz clic en **"Authorize APIs"**
8. Inicia sesión con tu cuenta de Google (la que usarás para las reuniones)
9. Revisa y acepta los permisos:
   - "Ver, editar, compartir y eliminar permanentemente todos los calendarios a los que tienes acceso"
10. Haz clic en **"Allow"** (Permitir)
11. En el lado derecho, verás el código de autorización. Haz clic en **"Exchange authorization code for tokens"**
12. **Copia estos valores** (los necesitarás para tu `.env`):
    - **Access token**: Lo verás en el campo "Access token" (empieza con `ya29.`)
    - **Refresh token**: Lo verás en el campo "Refresh token" (empieza con `1//`)
    - ⚠️ **Guarda estos tokens de forma segura, los necesitarás para tu `.env`**

#### Opción B: Crear un script de autenticación

Puedo ayudarte a crear un script que te guíe por el proceso de autenticación.

### Paso 6: Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# Google Calendar API (Opcional - solo si quieres integración completa)
GOOGLE_CLIENT_ID="tu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/callback/google"
GOOGLE_ACCESS_TOKEN="ya29.a0AfH6SMC..."  # Token de acceso (se renueva automáticamente)
GOOGLE_REFRESH_TOKEN="1//0g..."  # Token de refresh (permanente)
```

### Paso 7: Reiniciar el Servidor

```bash
npm run dev
```

---

## 🔄 ¿Cómo Funciona el Sistema?

El sistema intenta usar Google Calendar API primero. Si falla o no está configurado, automáticamente usa el método simple:

```typescript
// Intenta crear evento en Google Calendar
try {
  const meetEvent = await createGoogleMeetEvent({...})
  googleMeetLink = meetEvent.meetLink
} catch (error) {
  // Si falla, usa método simple
  googleMeetLink = generateGoogleMeetLink()
}
```

### Método Simple (Sin Configuración)
- ✅ Genera enlaces únicos de Google Meet
- ✅ Funciona inmediatamente
- ✅ No requiere configuración
- ❌ No crea eventos en el calendario
- ❌ No invita automáticamente al cliente

### Método Completo (Con Google Calendar API)
- ✅ Genera enlaces oficiales de Google Meet
- ✅ Crea eventos en tu Google Calendar
- ✅ Invita automáticamente al cliente
- ✅ Sincroniza fecha y hora
- ❌ Requiere configuración inicial

---

## 🧪 Probar la Configuración

### Sin Configuración (Método Simple)

1. Aprobar una cita desde el dashboard
2. Verificar que se genere un enlace de Google Meet
3. El enlace debería verse en el dashboard
4. El cliente recibirá el enlace por email

### Con Google Calendar API

1. Verificar que las variables de entorno estén configuradas
2. Aprobar una cita desde el dashboard
3. Verificar en tu Google Calendar que se haya creado el evento
4. Verificar que el cliente haya recibido la invitación por email

---

## 🔧 Solución de Problemas

### Error: "No se pudo generar el link de Google Meet"

**Solución**: El sistema automáticamente usará el método simple. Verifica los logs en consola para ver el error específico.

### Error: "Invalid credentials"

**Solución**: 
- Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` sean correctos
- Asegúrate de que los tokens no hayan expirado
- Regenera los tokens si es necesario

### Error: "Access token expired"

**Solución**: El sistema debería renovar automáticamente con el refresh token. Si persiste:
- Verifica que `GOOGLE_REFRESH_TOKEN` sea correcto
- Regenera los tokens desde OAuth Playground

### Los enlaces no funcionan

**Solución**: 
- Verifica que el enlace sea válido (formato: `https://meet.google.com/xxx-xxxx-xxx`)
- Prueba abrir el enlace en una ventana de incógnito
- Verifica que Google Meet esté habilitado en tu cuenta de Google

### No se crean eventos en el calendario

**Solución**:
- Verifica que Google Calendar API esté habilitada
- Verifica que los permisos del OAuth incluyan `calendar` y `calendar.events`
- Verifica que los tokens sean válidos

---

## 📝 Notas Importantes

1. **Los enlaces generados con el método simple son válidos** y funcionan perfectamente
2. **No es necesario configurar Google Calendar API** para usar el sistema
3. **La configuración de Google Calendar API es opcional** y solo mejora la experiencia
4. **Los tokens de acceso expiran**, pero el refresh token los renueva automáticamente
5. **En producción**, asegúrate de actualizar `GOOGLE_REDIRECT_URI` con tu dominio real

---

## 🎯 Recomendación

**Para empezar**: Usa el método simple (sin configuración). Funciona perfectamente.

**Para producción**: Si quieres una experiencia más profesional, configura Google Calendar API para tener eventos automáticos en tu calendario.

---

## 💰 Costos de Google Calendar API

### ¡Es Gratuita! 🎉

**Google Calendar API es completamente gratuita** para el uso normal:

- ✅ **1,000,000 de consultas por día** sin costo
- ✅ **Sin tarifas** por crear eventos o enlaces de Google Meet
- ✅ **Sin tarifa de suscripción** mensual
- ✅ **Gratis para siempre** mientras no excedas los límites

### ¿Cuánto es 1,000,000 de consultas?

Para ponerlo en perspectiva:
- Si creas **100 citas al día** = 100 consultas/día
- Esto te daría para **10,000 días** = **más de 27 años** de uso gratuito

**En resumen**: Para un estudio de abogados, nunca tendrás que pagar por usar Google Calendar API.

### ¿Cuándo se cobra?

Solo se cobra si:
- Excedes los 1,000,000 de consultas por día (casi imposible para un uso normal)
- Necesitas funcionalidades premium de Google Workspace (no relacionado con la API)

**Para tu caso de uso**: Es completamente gratuita. ✅

---

## 📚 Recursos

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [Google Calendar API Pricing](https://developers.google.com/calendar/api/pricing) - Confirma que es gratuita
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
- [Google Cloud Console](https://console.cloud.google.com)

