import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'adrianep@elguetabogado.cl'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = process.env.ADMIN_NAME || 'Administrador'

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10)

  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log('El usuario administrador ya existe.')
    return
  }

  // Crear usuario administrador
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'ADMIN',
    },
  })

  console.log('Usuario administrador creado exitosamente:')
  console.log('Email:', user.email)
  console.log('Nombre:', user.name)
  console.log('Role:', user.role)
  console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión.')
}

main()
  .catch((e) => {
    console.error('Error creando usuario administrador:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

