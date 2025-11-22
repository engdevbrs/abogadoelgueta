# 🔒 Solución: "Access blocked" - Error 403: access_denied

## ❌ Error que estás viendo:

```
Access blocked: Abogado Elgueta has not completed the Google verification process
Error 403: access_denied
```

## ✅ Solución Rápida (Agregar Usuario de Prueba)

Este error significa que tu aplicación OAuth está en modo "Testing" (Prueba) y solo pueden acceder los usuarios que agregues como "Test users" (Usuarios de prueba).

### Pasos para resolverlo:

1. **Ve a Google Cloud Console**:
   - [https://console.cloud.google.com](https://console.cloud.google.com)
   - Asegúrate de estar en el proyecto **"Abogado Elgueta - Calendar API"**
   - Asegúrate de estar conectado con `adelguetap@gmail.com`

2. **Ve a OAuth Consent Screen**:
   - En el menú lateral, ve a **"APIs & Services"** > **"OAuth consent screen"**
   - O ve directamente a: [https://console.cloud.google.com/apis/credentials/consent](https://console.cloud.google.com/apis/credentials/consent)

3. **Agrega tu email como Usuario de Prueba**:
   - Desplázate hacia abajo hasta la sección **"Test users"** (Usuarios de prueba)
   - Haz clic en **"+ ADD USERS"** o **"Add Users"**
   - En el campo de texto, ingresa: `adelguetap@gmail.com`
   - Haz clic en **"Add"** o **"Save"**
   - Verifica que `adelguetap@gmail.com` aparezca en la lista de usuarios de prueba

4. **Guarda los cambios**:
   - Haz clic en **"Save"** o **"Save and Continue"** si está disponible

5. **Espera unos segundos** (puede tardar hasta 1 minuto en aplicarse)

6. **Vuelve a intentar**:
   - Vuelve a [OAuth Playground](https://developers.google.com/oauthplayground/)
   - Haz clic en "Reset" si es necesario
   - Haz clic en "Authorize APIs" nuevamente
   - Ahora debería funcionar

---

## 🔍 Verificar que está configurado correctamente

Después de agregar el usuario de prueba, verifica:

1. En **OAuth consent screen**, debes ver:
   - **Publishing status**: "Testing" (Prueba)
   - En la sección **"Test users"**, debe aparecer: `adelguetap@gmail.com`

2. Si no aparece, agrégala nuevamente siguiendo los pasos anteriores

---

## ⚠️ Nota Importante

**Modo "Testing" (Prueba)**:
- ✅ Funciona perfectamente para desarrollo y uso personal
- ✅ Puede tener hasta 100 usuarios de prueba
- ✅ No requiere verificación de Google
- ⚠️ Solo los usuarios agregados como "Test users" pueden acceder

**Modo "In production" (En producción)**:
- Requiere verificación de Google (proceso largo)
- Cualquier usuario puede acceder
- Solo necesario si vas a distribuir la app públicamente

**Para tu caso (uso personal/empresarial)**: El modo "Testing" es perfecto, solo necesitas agregar tu email como usuario de prueba.

---

## 🔄 Si sigue sin funcionar

1. **Espera 1-2 minutos**: A veces los cambios tardan en aplicarse
2. **Limpia la caché del navegador**:
   - Cierra todas las ventanas de Google
   - Abre una ventana de incógnito
   - Intenta nuevamente
3. **Verifica que estés usando la cuenta correcta**:
   - Asegúrate de estar iniciado con `adelguetap@gmail.com` en el navegador
   - No uses una cuenta diferente
4. **Verifica que el email esté exactamente igual**:
   - Debe ser: `adelguetap@gmail.com`
   - Sin espacios
   - Todo en minúsculas

---

## ✅ Después de resolverlo

Una vez que hayas agregado `adelguetap@gmail.com` como usuario de prueba y esperes 1-2 minutos:

1. Vuelve a OAuth Playground
2. Haz clic en "Authorize APIs"
3. Deberías poder iniciar sesión sin problemas
4. Procede con el intercambio de tokens

¡Listo! 🎉

