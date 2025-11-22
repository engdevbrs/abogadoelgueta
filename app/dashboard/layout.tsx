import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardNav } from '@/components/dashboard/DashboardNav'
import { Toaster } from '@/components/ui/toaster'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar sesión solo para mostrar el Nav
  // El middleware ya maneja la protección de rutas
  const session = await getServerSession(authOptions)

  // Si no hay sesión, mostrar solo los children (sin Nav)
  // Esto permite que la página de login se muestre correctamente
  if (!session) {
    return <>{children}</>
  }

  // Si hay sesión, mostrar el layout completo con Nav
  return (
    <div className="min-h-screen bg-gray-50 dashboard">
      <DashboardNav />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Toaster />
    </div>
  )
}

