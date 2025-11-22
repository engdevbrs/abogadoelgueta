import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CitasList } from '@/components/dashboard/CitasList'
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/dashboard/login')
  }

  // Obtener estadísticas
  const [
    totalPendientes,
    totalPagoPendiente,
    totalAprobadas,
    totalRechazadas,
    totalCompletadas,
  ] = await Promise.all([
    prisma.cita.count({ where: { estado: 'PENDIENTE' } }),
    prisma.cita.count({ where: { estado: 'PAGO_PENDIENTE' } }),
    prisma.cita.count({ where: { estado: 'APROBADA' } }),
    prisma.cita.count({ where: { estado: 'RECHAZADA' } }),
    prisma.cita.count({ where: { estado: 'COMPLETADA' } }),
  ])

  const stats = [
    {
      title: 'Pendientes',
      value: totalPendientes,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Pago Pendiente',
      value: totalPagoPendiente,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Aprobadas',
      value: totalAprobadas,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Rechazadas',
      value: totalRechazadas,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Completadas',
      value: totalCompletadas,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-primary tracking-tight">Dashboard</h1>
        <p className="text-gray-600 mt-2 font-normal">Bienvenido/a, {session.user.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 tracking-normal">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">Solicitudes de Citas</CardTitle>
        </CardHeader>
        <CardContent>
          <CitasList />
        </CardContent>
      </Card>
    </div>
  )
}

