# Arquitectura de la Aplicación - Abogado Elgueta

## 🏗️ Arquitectura General

Esta aplicación utiliza una arquitectura moderna basada en **Next.js 14** con **App Router**, siguiendo mejores prácticas de desarrollo y principios de diseño escalable.

### Stack Tecnológico

- **Frontend:**
  - Next.js 14 (App Router)
  - React 18+ con TypeScript
  - Tailwind CSS para estilos
  - Componentes UI basados en Radix UI y shadcn/ui
  
- **Backend:**
  - Next.js API Routes
  - Prisma ORM para gestión de base de datos
  - NextAuth.js para autenticación
  
- **Base de Datos:**
  - PostgreSQL (recomendado para producción)
  - SQLite (opcional para desarrollo)
  
- **Servicios Externos:**
  - Resend para envío de emails
  - Google Calendar API para generar links de Google Meet

### Estructura de Directorios

```
├── app/                      # Next.js App Router
│   ├── (public)/            # Rutas públicas (grupo de rutas)
│   │   ├── layout.tsx       # Layout público (Header + Footer)
│   │   ├── page.tsx         # Página de inicio
│   │   ├── servicios/       # Página de servicios
│   │   ├── quienes-somos/   # Página quiénes somos
│   │   ├── experiencia/     # Página experiencia
│   │   └── contacto/        # Página contacto
│   ├── dashboard/           # Dashboard administrativo
│   │   ├── layout.tsx       # Layout del dashboard
│   │   ├── login/           # Página de login
│   │   └── page.tsx         # Dashboard principal
│   ├── api/                 # API Routes
│   │   ├── auth/            # NextAuth
│   │   ├── citas/           # API de citas
│   │   └── contacto/        # API de contacto
│   └── layout.tsx           # Layout raíz
│
├── components/              # Componentes React
│   ├── ui/                  # Componentes base reutilizables
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layout/              # Componentes de layout
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Hero.tsx
│   ├── sections/            # Secciones de página
│   │   ├── ServiciosPreview.tsx
│   │   ├── AboutPreview.tsx
│   │   └── ...
│   ├── forms/               # Formularios
│   │   └── SolicitudCitaForm.tsx
│   └── dashboard/           # Componentes del dashboard
│       ├── DashboardNav.tsx
│       └── CitasList.tsx
│
├── lib/                     # Utilidades y servicios
│   ├── utils.ts             # Funciones utilitarias
│   ├── prisma.ts            # Cliente Prisma
│   ├── auth.ts              # Configuración NextAuth
│   ├── email.ts             # Servicio de emails
│   └── google-calendar.ts   # Servicio Google Calendar
│
├── types/                   # Tipos TypeScript
│   ├── index.ts
│   └── next-auth.d.ts
│
├── prisma/                  # Schema y migraciones
│   └── schema.prisma
│
├── styles/                  # Estilos globales
│   └── globals.css
│
└── scripts/                 # Scripts de utilidad
    └── create-admin.ts      # Script para crear admin inicial
```

## 🎨 Sistema de Diseño

### Colores

La aplicación utiliza los colores de marca:
- **Azul Marino Oscuro** (`#0a1e3a`) como color primario
- **Blanco** como color secundario

Estos colores están configurados en `tailwind.config.ts` y se pueden usar mediante clases de Tailwind:
- `bg-primary`, `text-primary`, etc.
- `bg-secondary`, `text-secondary`, etc.

### Componentes Reutilizables

Los componentes base están en `components/ui/` y siguen el patrón de **shadcn/ui**:
- Componentes accesibles (basados en Radix UI)
- Altamente personalizables
- Type-safe con TypeScript
- Composición flexible

## 🔐 Autenticación

### NextAuth.js

La autenticación está implementada con NextAuth.js usando:
- **Credentials Provider** para login con email/password
- **JWT** para sesiones
- **Middleware** para proteger rutas del dashboard

### Flujo de Autenticación

1. Usuario ingresa credenciales en `/dashboard/login`
2. NextAuth valida contra la base de datos
3. Si es válido, crea un JWT token
4. Middleware protege rutas `/dashboard/*`
5. Session se mantiene en cookies

## 📧 Sistema de Emails

### Resend Integration

El sistema utiliza **Resend** para enviar emails:
- Confirmación de solicitud de cita
- Aprobación de cita con link de Google Meet
- (Futuro) Notificaciones al administrador

### Templates de Email

Los templates están en `lib/email.ts` y son:
- HTML responsive
- Texto plano como fallback
- Personalizados con información del cliente

## 📅 Google Calendar Integration

### Generación de Google Meet Links

El sistema puede generar links de Google Meet de dos formas:

1. **Creando evento en Google Calendar** (recomendado):
   - Usa Google Calendar API
   - Crea evento con conferencia
   - Genera link único automáticamente

2. **Link simple** (fallback):
   - Genera link único sin evento
   - Usa función auxiliar en `lib/google-calendar.ts`

## 💾 Base de Datos

### Prisma ORM

La base de datos se gestiona con Prisma:

**Modelos principales:**
- `User`: Usuarios (solo admin por ahora)
- `Cita`: Solicitudes de citas
- `Contacto`: Mensajes del formulario de contacto

**Estados de Cita:**
- `PENDIENTE`: Recién enviada
- `PAGO_PENDIENTE`: Esperando pago
- `APROBADA`: Pagada y aprobada
- `RECHAZADA`: Rechazada por admin
- `COMPLETADA`: Cita realizada
- `CANCELADA`: Cancelada

## 🚀 Flujo de Solicitud de Cita

1. **Usuario completa formulario** en la página principal
2. **Sistema crea registro** en base de datos con estado `PENDIENTE`
3. **Se envía email de confirmación** al usuario con información de pago
4. **Admin marca como PAGO_PENDIENTE** después de validar pago
5. **Admin aprueba la cita**:
   - Sistema genera link de Google Meet
   - Actualiza estado a `APROBADA`
   - Envía email al usuario con el link
6. **Usuario se une a la videollamada** en la fecha/hora acordada
7. **Admin marca como COMPLETADA** después de la cita

## 🔄 API Routes

### `/api/citas`
- `POST`: Crear nueva solicitud de cita
- `GET`: Obtener listado de citas (requiere autenticación)

### `/api/citas/[id]`
- `GET`: Obtener cita específica
- `PATCH`: Actualizar cita (cambiar estado, etc.)
- `DELETE`: Eliminar cita

### `/api/contacto`
- `POST`: Enviar mensaje de contacto

### `/api/auth/[...nextauth]`
- Rutas de NextAuth para autenticación

## 📱 Responsive Design

La aplicación está diseñada para ser completamente responsive:
- **Mobile First** approach
- Breakpoints de Tailwind CSS
- Componentes adaptativos
- Navegación móvil con menú hamburguesa

## 🧪 Mejores Prácticas Implementadas

1. **Type Safety**: TypeScript en todo el proyecto
2. **Validación**: Zod para validación de esquemas
3. **Formularios**: React Hook Form para gestión de forms
4. **Componentes**: Reutilizables y composables
5. **Estilos**: Sistema de diseño consistente
6. **Seguridad**: Autenticación y autorización
7. **Error Handling**: Manejo de errores en todas las capas
8. **Email Templates**: HTML responsive y accesible

## 🚀 Despliegue

### Recomendaciones

- **Base de Datos**: PostgreSQL en producción (Vercel Postgres, Supabase, etc.)
- **Hosting**: Vercel (recomendado para Next.js)
- **Variables de Entorno**: Configurar todas las variables necesarias
- **Email**: Configurar dominio en Resend
- **Google Calendar**: Configurar OAuth2 credentials

### Pasos de Despliegue

1. Configurar base de datos PostgreSQL
2. Configurar variables de entorno
3. Ejecutar migraciones de Prisma
4. Crear usuario administrador
5. Configurar Resend
6. Configurar Google Calendar API
7. Desplegar en Vercel o plataforma similar

## 📝 Próximas Mejoras

- [ ] Panel para editar información de contacto
- [ ] Sistema de notificaciones en tiempo real
- [ ] Integración con calendario del abogado
- [ ] Sistema de archivos/documentos
- [ ] Dashboard de estadísticas
- [ ] Multi-idioma
- [ ] SEO mejorado

