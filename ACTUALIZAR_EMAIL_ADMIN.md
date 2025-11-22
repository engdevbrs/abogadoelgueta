# 🔄 Actualizar Email del Usuario Administrador

## 📝 Situación

El email del usuario administrador se ha cambiado de:
- **Antiguo**: `admin@abogadoelgueta.cl`
- **Nuevo**: `adrianep@elguetabogado.cl`

Esto es necesario porque el dominio verificado en Resend es `elguetabogado.cl`.

---

## ✅ Opción 1: Actualizar el Email del Usuario Existente

Si ya creaste el usuario admin con el email antiguo, puedes actualizarlo:

### Paso 1: Verificar tu archivo `.env`

Asegúrate de que tengas configurado:

```env
ADMIN_EMAIL="adrianep@elguetabogado.cl"
ADMIN_PASSWORD="tu-password-actual"
ADMIN_NAME="Administrador"
```

### Paso 2: Ejecutar el Script de Actualización

```bash
npm run update-admin-email
```

Este script:
- Buscará el usuario con el email antiguo (`admin@abogadoelgueta.cl`)
- Lo actualizará al nuevo email (`adrianep@elguetabogado.cl`)
- Te mostrará un mensaje de confirmación

### Paso 3: Iniciar Sesión

Ahora puedes iniciar sesión en el dashboard con:
- **Email**: `adrianep@elguetabogado.cl`
- **Password**: (la contraseña que tenías configurada)

---

## ✅ Opción 2: Crear un Nuevo Usuario Admin

Si prefieres crear un nuevo usuario con el email correcto:

### Paso 1: Eliminar el Usuario Antiguo (Opcional)

Si quieres eliminar el usuario antiguo, puedes hacerlo manualmente usando Prisma Studio:

```bash
npm run db:studio
```

Luego elimina el usuario con el email antiguo desde la interfaz.

### Paso 2: Configurar tu `.env`

```env
ADMIN_EMAIL="adrianep@elguetabogado.cl"
ADMIN_PASSWORD="tu-nuevo-password-seguro"
ADMIN_NAME="Administrador"
```

### Paso 3: Crear el Nuevo Usuario

```bash
npm run create-admin
```

### Paso 4: Iniciar Sesión

Ahora puedes iniciar sesión con:
- **Email**: `adrianep@elguetabogado.cl`
- **Password**: (el password que configuraste en `.env`)

---

## 🔍 Verificar el Email Actual

Para ver qué email tiene tu usuario admin actualmente, puedes:

1. **Usar Prisma Studio**:
   ```bash
   npm run db:studio
   ```
   Luego ve a la tabla `User` y revisa el email.

2. **O simplemente intentar iniciar sesión**:
   - Si funciona con `adrianep@elguetabogado.cl`, entonces ya está actualizado
   - Si solo funciona con `admin@abogadoelgueta.cl`, entonces necesitas actualizarlo

---

## ⚠️ Importante

- **El email para iniciar sesión debe ser**: `adrianep@elguetabogado.cl`
- **La contraseña**: es la que configuraste cuando creaste el usuario admin
- **Si olvidaste la contraseña**: tendrás que eliminarlo y crear uno nuevo

---

## 📝 Resumen

**Para iniciar sesión ahora usa**:
- **Email**: `adrianep@elguetabogado.cl`
- **Password**: (tu contraseña actual)

Si no puedes iniciar sesión con ese email, ejecuta:
```bash
npm run update-admin-email
```

¡Y listo! 🎉

