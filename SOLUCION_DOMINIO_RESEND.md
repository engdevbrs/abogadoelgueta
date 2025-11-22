# 🔧 Solución: Error "Domain is not verified" en Resend

## ❌ Error Actual

```
Error: The abogadoelgueta.cl domain is not verified.
Please, add and verify your domain on https://resend.com/domains
```

## 🔍 Problema

El dominio `elguetabogado.cl` **no está verificado en Resend**.

Resend requiere que verifiques tu dominio antes de enviar emails desde él.

---

## ✅ Solución Rápida (Usar Dominio de Prueba)

Para poder probar **ahora mismo**, usa el dominio de prueba de Resend:

### Paso 1: Cambiar FROM_EMAIL temporalmente

En tu archivo `.env`, cambia:

```env
# Cambiar de:
FROM_EMAIL="adrianep@elguetabogado.cl"

# A esto (dominio de prueba de Resend):
FROM_EMAIL="onboarding@resend.dev"
```

### Paso 2: Reiniciar el Servidor

```bash
# Detén el servidor (Ctrl + C)
npm run dev
```

### Paso 3: Probar

Ahora los emails deberían enviarse correctamente usando el dominio de prueba.

⚠️ **Limitaciones del dominio de prueba**:
- Máximo 50 emails/día
- Puede tener restricciones de entrega
- Recomendado solo para desarrollo

---

## 🎯 Solución Definitiva (Verificar tu Dominio)

Para usar `adrianep@elguetabogado.cl` en producción:

### Paso 1: Agregar Dominio en Resend

1. Ve a [Resend Domains](https://resend.com/domains)
2. Haz clic en **"Add Domain"**
3. Ingresa: **`elguetabogado.cl`**
4. Haz clic en **"Add"**

### Paso 2: Agregar Registros DNS

Resend te mostrará registros DNS que debes agregar en tu proveedor de dominio:

1. **DKIM (TXT)**:
   - Nombre: `resend._domainkey`
   - Valor: (lo que Resend te da)

2. **SPF (TXT)**:
   - Nombre: `@` o `elguetabogado.cl`
   - Valor: `v=spf1 include:resend.net ~all`

### Paso 3: Agregar en tu Proveedor de Dominio

1. Accede al panel DNS de tu proveedor de dominio
2. Agrega los registros que Resend te mostró
3. Espera la propagación (minutos a 48 horas)

### Paso 4: Verificar

1. Vuelve a Resend Domains
2. Espera a que aparezca el checkmark verde ✅
3. Una vez verificado, puedes usar:
   ```env
   FROM_EMAIL="adrianep@elguetabogado.cl"
   ```

---

## 📋 Resumen

**Para probar ahora**:
- Usa `FROM_EMAIL="onboarding@resend.dev"` temporalmente

**Para producción**:
- Verifica el dominio `elguetabogado.cl` en Resend
- Luego usa `FROM_EMAIL="adrianep@elguetabogado.cl"`

---

¿Quieres que te ayude a configurar el dominio de prueba ahora o prefieres verificar tu dominio primero?
