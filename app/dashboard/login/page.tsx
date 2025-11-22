'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Mail, Lock, Scale, Eye, EyeOff } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setIsLoading(false)
        toast({
          title: 'Error de autenticación',
          description: 'Email o contraseña incorrectos',
          variant: 'destructive',
        })
      } else {
        // Mantener loading activo mientras navega
        router.push('/dashboard')
        router.refresh()
        // No cambiar isLoading a false aquí para mantener el spinner durante la navegación
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: 'Error',
        description: 'Hubo un problema al iniciar sesión',
        variant: 'destructive',
      })
    }
  }

      return (
        <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 dashboard relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
          {/* Contenedor principal */}
          <div className="relative z-10 w-full max-w-md animate-fadeIn">
            <Card className="w-full border-0 shadow-2xl overflow-hidden">
              {/* Header con fondo azul marino */}
              <CardHeader className="text-center pb-5 sm:pb-6 pt-6 sm:pt-7 px-6 sm:px-8 bg-gradient-to-br from-primary via-primary to-primary-dark text-white">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm border-2 border-white/30 p-3 sm:p-3.5 rounded-full shadow-lg">
                      <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-serif text-white mb-1 tracking-tight leading-tight">
                  Abogado Adrián Elgueta
                </CardTitle>
                <div className="w-12 sm:w-14 h-px bg-white/40 mx-auto my-2 sm:my-2.5"></div>
                <CardDescription className="text-xs sm:text-sm text-white/85 font-normal">
                  Panel de Administración
                </CardDescription>
              </CardHeader>

              {/* Contenido con fondo blanco */}
              <CardContent className="px-6 sm:px-8 pb-8 sm:pb-10 pt-6 sm:pt-8 bg-white">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                      Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="adrianep@elguetabogado.cl"
                        className="pl-4 pr-4 py-5 sm:py-6 text-sm sm:text-base border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-gray-50 focus:bg-white"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs sm:text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        placeholder="••••••••"
                        className="pl-4 pr-12 py-5 sm:py-6 text-sm sm:text-base border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-gray-50 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors duration-200 p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs sm:text-sm text-destructive mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full mt-6 sm:mt-8 py-5 sm:py-6 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary-dark" 
                    size="lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        <span className="text-sm sm:text-base">Iniciando sesión...</span>
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </Button>
                </form>

                {/* Mensaje de seguridad */}
                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-100">
                  <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                    <Lock className="h-3 w-3 text-primary flex-shrink-0" />
                    <span>Acceso restringido. Solo personal autorizado.</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

