# Abogado Elgueta - Aplicación Web Profesional

Aplicación web moderna y escalable para estudio de abogacía, desarrollada con Next.js 14, TypeScript y mejores prácticas de desarrollo.

## 🏗️ Arquitectura

Esta aplicación utiliza una arquitectura moderna basada en:

- **Next.js 14** con App Router (React Server Components)
- **TypeScript** para type safety
- **Prisma ORM** para gestión de base de datos
- **Tailwind CSS** para estilos
- **NextAuth.js** para autenticación
- **Zod** para validación de esquemas
- **Resend** para envío de emails
- **Google Calendar API** para gestión de citas y Google Meet

## 📁 Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── (public)/          # Rutas públicas
│   ├── dashboard/         # Dashboard administrativo
│   ├── api/               # API Routes
│   └── layout.tsx         # Layout principal
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── layout/           # Componentes de layout
│   └── features/         # Componentes específicos de features
├── lib/                   # Utilidades y servicios
│   ├── prisma.ts         # Cliente Prisma
│   ├── auth.ts           # Configuración NextAuth
│   ├── email.ts          # Servicio de emails
│   └── google-calendar.ts # Servicio Google Calendar
├── types/                 # Tipos TypeScript
├── styles/                # Estilos globales
└── prisma/                # Schema y migraciones
```

## 🚀 Inicio Rápido

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Configurar base de datos:
```bash
npx prisma generate
npx prisma db push
```

4. Ejecutar en desarrollo:
```bash
npm run dev
```

## 🔐 Configuración Inicial

Antes de usar la aplicación, necesitas:

1. Crear el usuario administrador inicial
2. Configurar credenciales de Google Calendar API
3. Configurar Resend para envío de emails
4. Configurar variables de entorno

## 📝 Características

- ✅ Páginas públicas responsivas (Inicio, Servicios, Quiénes Somos, Experiencia, Contacto)
- ✅ Sistema de solicitudes de citas con formulario
- ✅ Dashboard administrativo
- ✅ Gestión y aprobación de citas
- ✅ Envío automático de emails
- ✅ Integración con Google Meet para videollamadas
- ✅ Diseño responsive y accesible

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run start` - Inicia servidor de producción
- `npm run db:generate` - Genera cliente Prisma
- `npm run db:push` - Sincroniza schema con BD
- `npm run db:studio` - Abre Prisma Studio

## 📧 Variables de Entorno Requeridas

Ver `.env.example` para lista completa de variables de entorno necesarias.

