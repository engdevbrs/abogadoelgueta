# 📁 Carpeta de Assets

Esta carpeta contiene todos los recursos estáticos de la aplicación (imágenes, iconos, etc.).

## 📂 Estructura

```
assets/
├── images/
│   ├── hero/          # Imágenes para la sección Hero
│   ├── services/      # Imágenes para la sección de Servicios
│   ├── about/         # Imágenes para "Quiénes Somos"
│   ├── experience/    # Imágenes para la sección de Experiencia
│   ├── contact/       # Imágenes para la sección de Contacto
│   └── logos/         # Logos de la aplicación
```

## 🖼️ Uso de Imágenes en Next.js

### Importación y Uso

```tsx
import Image from 'next/image'

// Usando imagen desde assets
<Image 
  src="/assets/images/hero/hero-image.jpg" 
  alt="Descripción de la imagen" 
  width={1920}
  height={1080}
  priority // Para imágenes importantes (hero, etc.)
/>
```

### Optimización

Next.js optimiza automáticamente las imágenes:
- ✅ Lazy loading por defecto
- ✅ Conversión a formatos modernos (WebP, AVIF)
- ✅ Redimensionamiento automático
- ✅ Mejor rendimiento

### Formatos Recomendados

- **JPG**: Para fotografías y imágenes con muchos colores
- **PNG**: Para imágenes con transparencia o pocos colores
- **WebP**: Formato moderno recomendado (Next.js lo convierte automáticamente)
- **SVG**: Para iconos y gráficos vectoriales

### Tamaños Recomendados

- **Hero images**: 1920x1080px (Full HD)
- **Card images**: 800x600px
- **Thumbnails**: 400x300px
- **Logos**: Según necesidad (preferiblemente SVG)

### Ejemplos por Sección

#### Hero Section
```tsx
<Image 
  src="/assets/images/hero/hero-background.jpg"
  alt="Fondo hero"
  fill
  className="object-cover"
  priority
/>
```

#### Cards de Servicios
```tsx
<Image 
  src="/assets/images/services/legal-service.jpg"
  alt="Servicio legal"
  width={800}
  height={600}
  className="rounded-lg"
/>
```

## 📝 Notas

- Todas las imágenes deben estar optimizadas antes de subirlas
- Usa nombres descriptivos para los archivos (ej: `abogado-consulta.jpg` en lugar de `img1.jpg`)
- El tamaño total de la carpeta assets no debe ser muy grande (considera usar un CDN para producción)

