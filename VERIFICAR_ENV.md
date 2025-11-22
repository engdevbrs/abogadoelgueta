# ✅ Verificar Configuración de Email en .env

## 🔍 El Problema

El error menciona `abogadoelgueta.cl`, pero tu dominio verificado es `elguetabogado.cl`.

Esto significa que probablemente en tu archivo `.env` tienes un valor incorrecto.

---

## ✅ Solución: Verificar tu archivo `.env`

### Paso 1: Abre tu archivo `.env`

Asegúrate de que tenga exactamente esto:

```env
# Resend (Emails)
RESEND_API_KEY="tu-api-key-de-resend"
FROM_EMAIL="adrianep@elguetabogado.cl"  # ⚠️ Debe ser elguetabogado.cl (no abogadoelgueta.cl)
ADMIN_EMAIL="adrianep@elguetabogado.cl"
```

### Paso 2: Verifica que NO tengas:

❌ **NO uses estos valores**:
```env
FROM_EMAIL="adrianep@abogadoelgueta.cl"  # ❌ INCORRECTO
FROM_EMAIL="noreply@abogadoelgueta.cl"   # ❌ INCORRECTO
```

✅ **Usa este valor**:
```env
FROM_EMAIL="adrianep@elguetabogado.cl"   # ✅ CORRECTO
```

### Paso 3: Reinicia el Servidor

Después de corregir el `.env`:

```bash
# Detén el servidor (Ctrl + C)
npm run dev
```

---

## 🔍 Cómo Verificar

1. **Abre tu archivo `.env`** en la raíz del proyecto
2. **Busca la línea `FROM_EMAIL=`**
3. **Verifica que diga**: `FROM_EMAIL="adrianep@elguetabogado.cl"`
4. **Si dice algo diferente**, cámbialo a `adrianep@elguetabogado.cl`

---

## ⚠️ Importante

El dominio que está verificado en Resend es: **`elguetabogado.cl`**

Por lo tanto, el email debe ser: **`adrianep@elguetabogado.cl`**

**NO uses**: `abogadoelgueta.cl` (ese dominio no está verificado)

---

## ✅ Después de Corregir

Una vez que corrijas el `.env` y reinicies el servidor:

1. Prueba aprobar una cita
2. El email debería enviarse correctamente
3. No deberías ver más el error de dominio no verificado

---

¿Puedes verificar qué valor tiene `FROM_EMAIL` en tu archivo `.env`?

