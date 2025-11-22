# 🚀 Guía de Instalación Rápida - Abogado Elgueta

## ⚡ Inicio Rápido (5 minutos)

### Paso 1: Instalar Dependencias

```bash
npm install
```

### Paso 2: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Copia el archivo de ejemplo
cp .env.example .env
```

Edita `.env` y configura al menos estas variables esenciales:

```env
# Base de datos (usa SQLite para desarrollo rápido)
DATABASE_URL="file:./dev.db"

# NextAuth (genera un secreto seguro)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-aqui-generalo-con-openssl-rand-base64-32"

# Admin inicial
ADMIN_EMAIL="admin@ejemplo.com"
ADMIN_PASSWORD="tu-password-seguro"
ADMIN_NAME="Administrador"

# Emails (opcional por ahora)
RESEND_API_KEY=""
FROM_EMAIL="adrianep@elguetabogado.cl"

# Banco (configura después)
BANCO_CUENTA="Pendiente"
BANCO_TIPO="Cuenta Corriente"
BANCO_NUMERO="1234567890"
```

### Paso 3: Configurar Base de Datos

```bash
# Generar cliente Prisma
npm run db:generate

# Crear base de datos
npm run db:push
```

### Paso 4: Crear Usuario Administrador

```bash
npm run create-admin
```

### Paso 5: Iniciar Servidor de Desarrollo

```bash
npm run dev
```

¡Listo! La aplicación estará corriendo en `http://localhost:3000`

## 📝 Próximos Pasos

1. **Accede al dashboard**: `http://localhost:3000/dashboard/login`
2. **Configura emails**: Obtén una API key de [Resend](https://resend.com) y configúrala en `.env`
3. **Configura información bancaria**: Actualiza las variables `BANCO_*` en `.env`
4. **Personaliza contenido**: Edita las páginas en `app/(public)/`

## 🔧 Solución de Problemas

### Error: "Cannot find module"

```bash
npm install
```

### Error de base de datos

```bash
# Verifica que DATABASE_URL esté correcta en .env
# Luego ejecuta:
npm run db:push
```

### Error al crear admin

- Verifica que las variables `ADMIN_EMAIL` y `ADMIN_PASSWORD` estén en `.env`
- Asegúrate de que la base de datos esté configurada primero

## 📚 Documentación Completa

Para más detalles, consulta:
- `SETUP.md` - Guía completa de configuración
- `ARCHITECTURE.md` - Documentación de la arquitectura
- `README.md` - Información general del proyecto

