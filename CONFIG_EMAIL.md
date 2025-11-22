# 📧 Configuración de Emails - Abogado Elgueta

## Configuración de Resend

### Paso 1: Crear cuenta en Resend

1. Visita [Resend](https://resend.com) y crea una cuenta
2. Verifica tu email

### Paso 2: Obtener API Key

1. Ve a [API Keys](https://resend.com/api-keys) en el dashboard de Resend
2. Haz clic en "Create API Key"
3. Dale un nombre (ej: "Abogado Elgueta - Producción")
4. Copia la API key (solo se muestra una vez)

### Paso 3: Configurar dominio (Recomendado para producción)

Para producción, necesitas verificar tu propio dominio:

1. Ve a [Domains](https://resend.com/domains) en Resend
2. Haz clic en "Add Domain"
3. Ingresa tu dominio (ej: `abogadoelgueta.cl`)
4. Resend te dará registros DNS para agregar a tu proveedor de dominio
5. Una vez verificado, podrás usar emails como `noreply@abogadoelgueta.cl`

**Nota**: En desarrollo puedes usar el dominio de prueba de Resend (limitado).

### Paso 4: Configurar variables de entorno

Agrega estas variables a tu archivo `.env`:

```env
# Resend (Emails)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
FROM_EMAIL="noreply@abogadoelgueta.cl"  # Debe ser un email verificado en Resend
ADMIN_EMAIL="admin@abogadoelgueta.cl"    # Email del administrador

# Información Bancaria (se mostrará en los emails)
BANCO_CUENTA="Banco de Chile"
BANCO_TIPO="Cuenta Corriente"
BANCO_NUMERO="1234567890"
BANCO_RUT="12.345.678-9"  # Opcional
BANCO_NOMBRE_TITULAR="Abogado Elgueta"
```

## Templates de Email

El sistema incluye dos templates profesionales de email:

### 1. Email de Confirmación de Solicitud

Se envía automáticamente cuando un usuario solicita una consulta.

**Incluye:**
- Confirmación de recepción de la solicitud
- Motivo de la consulta
- Información bancaria para el pago
- Instrucciones de próximos pasos

### 2. Email de Aprobación de Cita

Se envía automáticamente cuando el administrador aprueba una cita.

**Incluye:**
- Confirmación de aprobación
- Fecha y hora de la consulta
- Enlace de Google Meet para unirse a la videollamada
- Recomendaciones importantes

## Personalización

Los templates están en `lib/email.ts` y usan:

- **Colores principales**: Azul marino oscuro (#0a1e3a)
- **Diseño responsive**: Compatible con móviles
- **Estilos modernos**: Gradientes y sombras sutiles
- **HTML semántico**: Tablas para compatibilidad con clientes de email

### Modificar templates

Puedes personalizar:

1. **Colores**: Busca los valores hex (#0a1e3a, etc.) en `lib/email.ts`
2. **Texto**: Modifica los strings dentro de las funciones `sendConfirmacionCitaEmail` y `sendAprobacionCitaEmail`
3. **Logo**: Agrega una imagen en el header del template base (`getEmailTemplate`)
4. **Información adicional**: Agrega más campos bancarios o información de contacto

## Pruebas

### Desarrollo

En desarrollo, si no configuras `RESEND_API_KEY`, verás un warning en consola pero la aplicación funcionará normalmente (los emails no se enviarán).

```bash
npm run dev
```

### Probar envío de emails

1. Configura `RESEND_API_KEY` en `.env`
2. Usa el formulario de solicitud de cita en la aplicación
3. Verifica tu email (incluyendo spam)
4. Revisa los logs en consola para ver el estado del envío

### Verificar emails en Resend

1. Ve al [Logs](https://resend.com/emails) de Resend
2. Verás todos los emails enviados con su estado (enviado, entregado, fallido, etc.)

## Límites de Resend

### Plan Gratuito
- 3,000 emails/mes
- 100 emails/día
- Solo dominio de prueba

### Plan Pro ($20/mes)
- 50,000 emails/mes
- Dominios personalizados
- Analytics avanzados
- API avanzada

## Solución de Problemas

### Error: "Resend no está configurado"

- Verifica que `RESEND_API_KEY` esté en `.env`
- Reinicia el servidor de desarrollo (`npm run dev`)

### Emails no se envían

1. Verifica que la API key sea correcta
2. Verifica que el dominio/email en `FROM_EMAIL` esté verificado en Resend
3. Revisa los logs en Resend para ver errores específicos
4. Verifica la consola del servidor para errores

### Emails van a spam

1. Verifica tu dominio en Resend (SPF, DKIM)
2. Usa un dominio verificado, no el de prueba
3. Evita palabras que activan filtros de spam
4. Prueba con diferentes clientes de email

### Templates no se ven bien en algunos clientes

Los templates usan HTML inline compatible con la mayoría de clientes. Si tienes problemas:
- Evita CSS externo
- Usa tablas para layout
- Prueba en diferentes clientes (Gmail, Outlook, Apple Mail)

## Seguridad

- **Nunca** subas tu `.env` al repositorio
- Rota tus API keys periódicamente
- Usa diferentes keys para desarrollo y producción
- Limita los permisos de las API keys en Resend

## Recursos

- [Documentación de Resend](https://resend.com/docs)
- [Best Practices de Email](https://resend.com/docs/best-practices)
- [Email Testing Tools](https://resend.com/docs/test-email)

