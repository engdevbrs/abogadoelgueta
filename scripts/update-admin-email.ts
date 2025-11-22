import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const oldEmail = 'admin@abogadoelgueta.cl'
  const newEmail = process.env.ADMIN_EMAIL || 'adrianep@elguetabogado.cl'

  console.log('Buscando usuario con email antiguo...')
  
  // Buscar usuario con email antiguo
  const oldUser = await prisma.user.findUnique({
    where: { email: oldEmail },
  })

  if (!oldUser) {
    console.log('❌ No se encontró usuario con el email antiguo:', oldEmail)
    console.log('ℹ️  Si el usuario ya tiene el email correcto, no es necesario actualizar.')
    return
  }

  // Verificar si ya existe un usuario con el nuevo email
  const existingUser = await prisma.user.findUnique({
    where: { email: newEmail },
  })

  if (existingUser) {
    console.log('⚠️  Ya existe un usuario con el nuevo email:', newEmail)
    console.log('ℹ️  Si quieres usar el nuevo email, elimina primero el usuario antiguo.')
    return
  }

  // Actualizar email del usuario
  console.log(`Actualizando email de ${oldEmail} a ${newEmail}...`)
  
  const updatedUser = await prisma.user.update({
    where: { email: oldEmail },
    data: { email: newEmail },
  })

  console.log('✅ Usuario actualizado exitosamente:')
  console.log('   Email anterior:', oldEmail)
  console.log('   Email nuevo:', updatedUser.email)
  console.log('   Nombre:', updatedUser.name)
  console.log('   Role:', updatedUser.role)
  console.log('\n📝 Ahora puedes iniciar sesión con el nuevo email:', newEmail)
}

main()
  .catch((e) => {
    console.error('❌ Error actualizando email del usuario:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

