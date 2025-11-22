# 🚀 Pasos para Configurar Google Calendar API - Abogado Elgueta

## ✅ Ya completado
- [x] Proyecto creado en Google Cloud Console con `adelguetap@gmail.com`
- [x] Nombre del proyecto: "Abogado Elgueta - Calendar API"

---

## Paso 2: Habilitar Google Calendar API

1. En [Google Cloud Console](https://console.cloud.google.com), asegúrate de estar en el proyecto **"Abogado Elgueta - Calendar API"**
2. En el menú lateral (☰), ve a **"APIs & Services"** > **"Library"** (Biblioteca)
3. En el buscador, escribe: **"Google Calendar API"**
4. Haz clic en el resultado **"Google Calendar API"**
5. Haz clic en el botón **"Enable"** (Habilitar)
6. Espera unos segundos hasta que se habilite (verás un checkmark verde)

---

## Paso 3: Crear Credenciales OAuth 2.0

### 3.1 Configurar Pantalla de Consentimiento (Primera vez)

1. Ve a **"APIs & Services"** > **"OAuth consent screen"** (Pantalla de consentimiento)
2. Selecciona **"External"** (Externo) y haz clic en **"Create"** (Crear)
3. Completa los campos:
   - **App name**: `Abogado Elgueta`
   - **User support email**: `adelguetap@gmail.com`
   - **Developer contact information**: `adelguetap@gmail.com`
4. Haz clic en **"Save and Continue"** (Guardar y continuar)
5. En **Scopes** (Permisos):
   - Haz clic en **"Add or Remove Scopes"**
   - Busca y selecciona: `https://www.googleapis.com/auth/calendar`
   - Haz clic en **"Update"** y luego **"Save and Continue"**
6. En **Test users** (Usuarios de prueba):
   - Haz clic en **"Add Users"**
   - ⚠️ **IMPORTANTE**: Agrega: `adelguetap@gmail.com`
   - Haz clic en **"Add"**
   - Verifica que `adelguetap@gmail.com` aparezca en la lista
   - Haz clic en **"Save and Continue"**
7. Revisa todo y haz clic en **"Back to Dashboard"**

⚠️ **SI VES EL ERROR "Access blocked"**: Significa que no agregaste tu email como usuario de prueba. Ve a **"OAuth consent screen"** > **"Test users"** y agrega `adelguetap@gmail.com`.

### 3.2 Crear Cliente OAuth 2.0

1. Ve a **"APIs & Services"** > **"Credentials"** (Credenciales)
2. Haz clic en **"Create Credentials"** (Crear credenciales)
3. Selecciona **"OAuth client ID"** (ID de cliente OAuth)
4. Si te pide seleccionar tipo de aplicación:
   - Selecciona **"Web application"** (Aplicación web)
5. Completa el formulario:
   - **Name**: `Abogado Elgueta - Web Client`
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (para desarrollo)
     - `https://elguetabogado.cl` (para producción - si ya tienes dominio)
   - **Authorized redirect URIs** (⚠️ MUY IMPORTANTE):
     - `http://localhost:3000/api/auth/callback/google`
     - `https://developers.google.com/oauthplayground` (para OAuth Playground)
     - `https://elguetabogado.cl/api/auth/callback/google` (para producción - si ya tienes dominio)
6. Haz clic en **"Create"** (Crear)
7. **COPIA Y GUARDA estos valores** (solo se muestran una vez):
   - **Client ID**: `xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx`

---

## Paso 4: Obtener Tokens de Acceso (OAuth Playground)

### 4.1 Agregar Redirect URI de OAuth Playground

⚠️ **CRÍTICO**: Debes hacer esto ANTES de usar OAuth Playground:

1. En Google Cloud Console, ve a **"APIs & Services"** > **"Credentials"**
2. Haz clic en tu **OAuth 2.0 Client ID** recién creado
3. En la sección **"Authorized redirect URIs"**, verifica que esté:
   ```
   https://developers.google.com/oauthplayground
   ```
   Si NO está, agrégalo y haz clic en **"Save"**

### 4.2 Obtener Tokens

**⚠️ IMPORTANTE**: Si obtienes un error "invalid_grant", ve a la sección de Solución de Problemas al final.

1. Ve a [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. En la esquina superior derecha, haz clic en el ícono de configuración ⚙️
3. Marca la casilla **"Use your own OAuth credentials"**
4. Ingresa tus credenciales:
   - **OAuth Client ID**: Pega tu `Client ID` (el que copiaste antes)
   - **OAuth Client secret**: Pega tu `Client Secret` (el que copiaste antes)
5. Haz clic en **"Close"** (Cerrar)

6. En el lado izquierdo, bajo **"Select & authorize APIs"**, busca:
   - **Google Calendar API v1** o escribe en el buscador: `calendar`
7. Selecciona el scope:
   - ✅ `https://www.googleapis.com/auth/calendar` (verás un checkmark)
8. **IMPORTANTE**: Asegúrate de que el scope esté seleccionado antes de continuar
9. Haz clic en **"Authorize APIs"** (Autorizar APIs)
10. **Se abrirá una ventana de Google para iniciar sesión**:
    - Inicia sesión con **`adelguetap@gmail.com`** (¡IMPORTANTE! Debe ser esta cuenta)
    - Revisa los permisos y haz clic en **"Allow"** (Permitir)
11. Volverás a OAuth Playground y verás un **"Authorization code"** en el lado derecho

12. **INMEDIATAMENTE** (sin esperar), en el lado derecho, haz clic en el botón **"Exchange authorization code for tokens"**
    - ⚠️ El código de autorización expira en menos de 1 minuto, hazlo rápido
    - ⚠️ El código solo se puede usar UNA vez, si falla, necesitas obtener uno nuevo

13. Si todo va bien, verás los tokens:
    - **Access token**: (empieza con `ya29.`) - ⚠️ Este expira en 1 hora
    - **Refresh token**: (empieza con `1//`) - ✅ Este es permanente
    - **Token type**: `Bearer`
    - **Expires in**: `3600` (segundos)

14. **COPIA Y GUARDA estos valores** (especialmente el Refresh token):
    - **Access token**: `ya29.a0AfH6SMC...`
    - **Refresh token**: `1//0g...`

**Si obtienes error "invalid_grant"**, ve al Paso 4.3 (Solución de Problemas).

### 4.3 Solución de Error "invalid_grant"

Si obtienes el error `"error": "invalid_grant"` al hacer clic en "Exchange authorization code for tokens", sigue estos pasos:

**Causa**: El código de autorización expiró o ya fue usado. Los códigos solo duran unos segundos.

**Solución**:

1. **Limpia el código actual**:
   - En OAuth Playground, haz clic en **"Reset"** (si está disponible)
   - O simplemente haz clic nuevamente en **"Authorize APIs"** en el paso 9

2. **Obtén un nuevo código**:
   - Haz clic nuevamente en **"Authorize APIs"** (botón azul en el lado izquierdo)
   - Inicia sesión con `adelguetap@gmail.com` otra vez
   - Haz clic en **"Allow"**

3. **Intercambia INMEDIATAMENTE**:
   - Tan pronto como veas el código de autorización en el lado derecho
   - Sin esperar, haz clic en **"Exchange authorization code for tokens"** de inmediato
   - Los códigos expiran muy rápido (menos de 1 minuto)

4. **Si sigue fallando, verifica**:
   - Que hayas agregado `https://developers.google.com/oauthplayground` a los Redirect URIs en Google Cloud Console
   - Que el Client ID y Client Secret sean correctos
   - Que hayas seleccionado el scope `https://www.googleapis.com/auth/calendar`

5. **Alternativa - Usar modo manual**:
   - Si sigue fallando, puedes usar el script local (ver Paso 4.4)

---

## Paso 5: Configurar Variables de Entorno

Abre tu archivo `.env` y agrega estas variables:

```env
# Google Calendar API (para Google Meet automático)
GOOGLE_CLIENT_ID="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/callback/google"
GOOGLE_ACCESS_TOKEN="ya29.a0AfH6SMCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
GOOGLE_REFRESH_TOKEN="1//0gxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**Reemplaza los valores con:**
- `GOOGLE_CLIENT_ID`: Tu Client ID que copiaste
- `GOOGLE_CLIENT_SECRET`: Tu Client Secret que copiaste
- `GOOGLE_ACCESS_TOKEN`: Tu Access token que copiaste
- `GOOGLE_REFRESH_TOKEN`: Tu Refresh token que copiaste (⚠️ MUY IMPORTANTE)

---

## Paso 6: Reiniciar el Servidor

1. Guarda el archivo `.env`
2. Detén el servidor si está corriendo (Ctrl + C)
3. Reinicia el servidor:
   ```bash
   npm run dev
   ```

---

## Paso 7: Probar la Configuración

1. Ve a tu aplicación: `http://localhost:3000`
2. Inicia sesión en el dashboard
3. Ve a una solicitud de cita pendiente
4. Haz clic en **"Aprobar Cita"**
5. Verifica:
   - ✅ El estado cambia a "Aprobada"
   - ✅ Aparece un enlace de Google Meet en la cita
   - ✅ El cliente recibe un email con el enlace
   - ✅ Se crea un evento en el calendario de `adelguetap@gmail.com`

---

## 🔍 Verificar que Funciona

### En Google Calendar

1. Abre [Google Calendar](https://calendar.google.com) con `adelguetap@gmail.com`
2. Deberías ver un evento nuevo creado con:
   - Título: "Consulta Legal: [Motivo de la consulta]"
   - Fecha y hora de la cita
   - Link de Google Meet incluido
   - Cliente como invitado

### En la Aplicación

1. En el dashboard, la cita aprobada debería mostrar:
   - Estado: "Aprobada" (badge verde)
   - Enlace de Google Meet visible
   - Botón "Unirse a la Reunión"

---

## ⚠️ Solución de Problemas

### Error: "unauthorized_client"
- **Causa**: Los tokens están inválidos o expirados
- **Solución**: Regenera los tokens en OAuth Playground usando `adelguetap@gmail.com`

### Error: "redirect_uri_mismatch"
- **Causa**: No agregaste `https://developers.google.com/oauthplayground` a los redirect URIs
- **Solución**: Vuelve al Paso 4.1 y agrega el redirect URI

### No se crean eventos en el calendario
- **Causa**: Los tokens no tienen los permisos correctos
- **Solución**: Asegúrate de haber seleccionado `https://www.googleapis.com/auth/calendar` en OAuth Playground

### El email no se envía
- **Causa**: Problema con Resend (no con Google Calendar)
- **Solución**: Verifica que `RESEND_API_KEY` esté configurado en `.env`

---

## 📝 Notas Importantes

1. **Access Token expira en 1 hora**, pero el sistema lo renueva automáticamente usando el Refresh Token
2. **Refresh Token es permanente**, pero si lo pierdes o se invalida, tendrás que regenerarlo
3. **Los eventos se crean en el calendario de `adelguetap@gmail.com`**
4. **Si cambias de proyecto en Google Cloud, tendrás que crear nuevas credenciales**

---

## ✅ Checklist Final

- [ ] Google Calendar API habilitada
- [ ] OAuth Consent Screen configurado
- [ ] Credenciales OAuth 2.0 creadas
- [ ] Redirect URI de OAuth Playground agregado
- [ ] Tokens obtenidos con `adelguetap@gmail.com`
- [ ] Variables de entorno configuradas en `.env`
- [ ] Servidor reiniciado
- [ ] Prueba de aprobación de cita exitosa
- [ ] Evento creado en Google Calendar de `adelguetap@gmail.com`
- [ ] Email enviado al cliente con el enlace de Google Meet

---

¡Listo! 🎉 Ya tienes Google Calendar API configurado y funcionando.

