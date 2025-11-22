# 📍 Cómo Navegar a OAuth Consent Screen - Agregar Usuarios de Prueba

## 🎯 Desde la Pantalla Actual ("Descripción general de OAuth")

Si estás viendo la pantalla de "Descripción general de OAuth" con las gráficas:

### Opción 1: Desde el Menú Lateral

1. En el **menú lateral izquierdo** (☰), busca:
   - **"APIs & Services"** (APIs y Servicios)
   - O **"APIs y Servicios"** (si está en español)

2. Haz clic en **"APIs & Services"** o **"APIs y Servicios"**

3. En el submenú que aparece, busca y haz clic en:
   - **"OAuth consent screen"** (Pantalla de consentimiento de OAuth)
   - O **"Pantalla de consentimiento de OAuth"** (si está en español)

### Opción 2: Desde el Buscador en la Parte Superior

1. En la **barra de búsqueda superior** (donde dice "OAuth Consent Screen"), haz clic
2. Escribe: **"OAuth consent"** o **"consent screen"**
3. Selecciona la opción que aparece: **"OAuth consent screen"** o **"Pantalla de consentimiento de OAuth"**

### Opción 3: URL Directa

Ve directamente a esta URL (asegúrate de estar en el proyecto correcto):
```
https://console.cloud.google.com/apis/credentials/consent?project=tu-project-id
```

Reemplaza `tu-project-id` con el ID de tu proyecto (lo encuentras en la parte superior donde dice "Abogado Elgueta - Calendar API").

---

## ✅ Una Vez que Estés en "OAuth Consent Screen"

Deberías ver:

1. **En la parte superior**: Tabs o pestañas con:
   - "Edit app" (Editar app)
   - "Publishing status" (Estado de publicación)
   - "Test users" (Usuarios de prueba) ← **AQUÍ es donde necesitas ir**

2. **O si ves el formulario completo**, desplázate hacia abajo hasta la sección:
   - **"Test users"** (Usuarios de prueba)
   - O **"Usuarios de prueba"** (en español)

3. **Para agregar tu email**:
   - Haz clic en **"+ ADD USERS"** o **"+ AGREGAR USUARIOS"**
   - Ingresa: `adelguetap@gmail.com`
   - Haz clic en **"Add"** o **"Agregar"**
   - Haz clic en **"Save"** o **"Guardar"**

---

## 🔍 Si No Encuentras "OAuth Consent Screen"

### Verificar que Estás en el Proyecto Correcto

1. En la parte superior de la página, verifica que diga:
   - **"Abogado Elgueta - Calendar API"** (o el nombre de tu proyecto)

2. Si NO es el proyecto correcto:
   - Haz clic en el nombre del proyecto (arriba)
   - Selecciona **"Abogado Elgueta - Calendar API"** de la lista

---

## 📸 Qué Deberías Ver en "OAuth Consent Screen"

Una vez allí, deberías ver algo como:

```
OAuth consent screen
───────────────────────

Edit app | Publishing status | Test users

[Formulario con campos como:]
- App name: Abogado Elgueta
- User support email: adelguetap@gmail.com
- Developer contact information: adelguetap@gmail.com

[Al final:]
Test users
─────────
+ ADD USERS  ← Hacer clic aquí

[Lista de usuarios de prueba]
```

---

## ⚠️ Si "OAuth Consent Screen" No Existe

Si no encuentras la opción "OAuth Consent Screen" en el menú:

1. **Primero debes crear las credenciales OAuth**:
   - Ve a **"APIs & Services"** > **"Credentials"** (Credenciales)
   - Haz clic en **"+ CREATE CREDENTIALS"** o **"+ CREAR CREDENCIALES"**
   - Selecciona **"OAuth client ID"**
   - Esto te llevará automáticamente a configurar el OAuth Consent Screen

---

## 🎯 Pasos Rápidos (Resumen)

1. **Menú lateral** > **"APIs & Services"** > **"OAuth consent screen"**
2. Ve a la pestaña/sección **"Test users"** (Usuarios de prueba)
3. Haz clic en **"+ ADD USERS"** (Agregar usuarios)
4. Ingresa: `adelguetap@gmail.com`
5. Haz clic en **"Add"** (Agregar)
6. Haz clic en **"Save"** (Guardar)
7. Espera 1-2 minutos
8. Vuelve a intentar en OAuth Playground

---

¿Necesitas ayuda para encontrar algo específico? Dime qué ves en tu pantalla actual.

