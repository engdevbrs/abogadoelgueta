import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        
        // IMPORTANTE: Permitir acceso a /dashboard/login sin autenticación
        // Esto previene el bucle de redirección
        if (pathname === '/dashboard/login' || pathname.startsWith('/dashboard/login')) {
          return true
        }
        
        // Para todas las demás rutas de dashboard, requerir autenticación
        if (pathname.startsWith('/dashboard')) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    // Excluir explícitamente /dashboard/login del matcher no funciona bien con withAuth
    // Por eso lo manejamos en el callback authorized
  ],
}

