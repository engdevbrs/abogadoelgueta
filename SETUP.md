# Guía de Configuración - Abogado Elgueta

## 📋 Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- PostgreSQL (para producción) o SQLite (para desarrollo)
- Cuenta de Resend (para emails)
- Cuenta de Google Cloud Platform (para Google Calendar API)

## 🚀 Instalación

### 1. Clonar e Instalar Dependencias

```bash
# Instalar dependencias
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` y créalo como `.env`:

```bash
cp .env.example .env
```

Luego edita el archivo `.env` con tus configuraciones:

#### Base de Datos

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/abogado_elgueta?schema=public"
```

Para desarrollo rápido con SQLite:
```env
DATABASE_URL="file:./dev.db"
```

#### NextAuth

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-super-seguro"
```

Genera un secreto seguro:
```bash
openssl rand -base64 32
```

#### Resend (Emails)

Obtén tu API key de [Resend](https://resend.com):
```env
RESEND_API_KEY="re_xxxxxxxxxxxx"
FROM_EMAIL="noreply@tudominio.com"
ADMIN_EMAIL_NOTIFICATIONS="admin@tudominio.com"
```

#### Información Bancaria

```env
BANCO_CUENTA="Banco de Chile"
BANCO_TIPO="Cuenta Corriente"
BANCO_NUMERO="1234567890"
```

#### Google Calendar API (Opcional)

Si quieres generar links de Google Meet automáticamente:

1. Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com)
2. Habilita Google Calendar API
3. Crea credenciales OAuth 2.0
4. Configura las variables:

```env
GOOGLE_CLIENT_ID="tu-client-id"
GOOGLE_CLIENT_SECRET="tu-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/callback/google"
```

### 3. Configurar Base de Datos

```bash
# Generar cliente Prisma
npm run db:generate

# Crear base de datos y tablas
npm run db:push

# (O para migraciones en producción)
npm run db:migrate
```

### 4. Crear Usuario Administrador

```bash
# Configura las credenciales en .env primero:
# ADMIN_EMAIL="admin@ejemplo.com"
# ADMIN_PASSWORD="tu-password-seguro"
# ADMIN_NAME="Nombre Admin"

# Luego ejecuta:
npm run create-admin
```

⚠️ **IMPORTANTE**: Cambia la contraseña después del primer inicio de sesión.

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔐 Acceso al Dashboard

1. Ve a `http://localhost:3000/dashboard/login`
2. Ingresa las credenciales del administrador que creaste
3. Serás redirigido al dashboard

## 📧 Configuración de Emails

### Resend

1. Regístrate en [Resend](https://resend.com)
2. Verifica tu dominio (o usa el dominio de prueba)
3. Obtén tu API key
4. Configúrala en `.env`

**Nota**: En desarrollo, los emails no se enviarán si no hay API key configurada, pero se loguearán en consola.

## 📅 Configuración de Google Calendar (Opcional)

### Opción 1: Con Google Calendar API (Recomendado)

1. Crea un proyecto en Google Cloud Console
2. Habilita Google Calendar API
3. Crea credenciales OAuth 2.0
4. Configura la URL de redirección: `http://localhost:3000/api/auth/callback/google`
5. Obtén los tokens de acceso y refresh
6. Configura en `.env`

### Opción 2: Sin API (Fallback)

Si no configuras Google Calendar API, el sistema generará links únicos de Google Meet de forma simple.

## 🐛 Solución de Problemas

### Error: "Cannot find module 'next/server'"

```bash
npm install
```

### Error de conexión a base de datos

- Verifica que PostgreSQL esté ejecutándose
- Verifica la `DATABASE_URL` en `.env`
- Asegúrate de que las credenciales sean correctas

### Error al crear usuario administrador

- Verifica que la base de datos esté configurada
- Asegúrate de que `DATABASE_URL` sea correcta
- Ejecuta `npm run db:push` primero

### Emails no se envían

- Verifica que `RESEND_API_KEY` esté configurada
- Verifica que `FROM_EMAIL` esté verificado en Resend
- Revisa la consola para errores

### Google Meet links no se generan

- Si usas Google Calendar API: verifica las credenciales
- Si no: el sistema usará links simples automáticamente

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. Configura `DATABASE_URL` con Vercel Postgres o tu base de datos
4. Despliega

### Otra Plataforma

1. Construye el proyecto: `npm run build`
2. Configura las variables de entorno
3. Ejecuta migraciones de Prisma
4. Crea usuario administrador
5. Inicia: `npm start`

## 📝 Próximos Pasos

1. ✅ Configura todas las variables de entorno
2. ✅ Crea usuario administrador
3. ✅ Configura dominio de email en Resend
4. ✅ (Opcional) Configura Google Calendar API
5. ✅ Personaliza contenido en las páginas
6. ✅ Agrega logo cuando esté disponible
7. ✅ Configura dirección de oficina cuando esté definida

## 🔄 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar producción
npm start

# Prisma
npm run db:generate    # Generar cliente Prisma
npm run db:push        # Sincronizar schema
npm run db:migrate     # Crear migración
npm run db:studio      # Abrir Prisma Studio

# Crear admin
npm run create-admin
```

## 📞 Soporte

Si tienes problemas durante la configuración, revisa:
- Los logs en la consola
- La documentación de [Next.js](https://nextjs.org/docs)
- La documentación de [Prisma](https://www.prisma.io/docs)
- La documentación de [Resend](https://resend.com/docs)

