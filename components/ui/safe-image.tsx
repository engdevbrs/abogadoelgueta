'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface SafeImageProps {
  src: string
  fallbackSrc: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  [key: string]: any
}

/**
 * Componente de imagen con fallback automático
 * Intenta cargar la imagen local primero, si falla, usa la imagen de fallback (Unsplash)
 */
export function SafeImage({ src, fallbackSrc, alt, fill, className, priority, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(fallbackSrc) // Empezar con fallback para evitar errores
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Si la imagen es una ruta local, intentar cargarla primero
    if (src && src.startsWith('/')) {
      const testImg = new window.Image()
      
      testImg.onload = () => {
        // La imagen local existe, usarla
        setImgSrc(src)
        setIsLoading(false)
      }
      
      testImg.onerror = () => {
        // La imagen local no existe, usar fallback
        setImgSrc(fallbackSrc)
        setIsLoading(false)
      }
      
      testImg.src = src
    } else {
      // Si no es una ruta local, usar directamente
      setImgSrc(src || fallbackSrc)
      setIsLoading(false)
    }
  }, [src, fallbackSrc])

  if (isLoading) {
    // Mostrar un placeholder mientras se verifica
    return (
      <div className={`${fill ? 'absolute inset-0' : ''} ${className || ''} bg-gray-200 animate-pulse`} />
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={fill ? undefined : props.width}
      height={fill ? undefined : props.height}
      className={className}
      priority={priority}
      {...props}
    />
  )
}
