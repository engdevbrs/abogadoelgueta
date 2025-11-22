import { PrismaClient } from '@prisma/client'

// Crear cliente Prisma con DATABASE_URL del entorno
// Si DATABASE_URL está configurado, usará esa base de datos (producción o desarrollo)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function main() {
  // Verificar que DATABASE_URL esté configurado
  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL no está configurado en las variables de entorno.')
    console.error('Por favor, configura DATABASE_URL antes de ejecutar este script.')
    process.exit(1)
  }

  const dbUrl = process.env.DATABASE_URL
  const isProduction = dbUrl.includes('vercel') || dbUrl.includes('neon') || dbUrl.includes('postgres')
  
  console.log(`🔗 Conectando a: ${isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'}`)
  console.log(`📊 Base de datos: ${dbUrl.substring(0, 20)}...`)
  console.log('')

  // Contar citas antes de eliminar
  const countBefore = await prisma.cita.count()
  console.log(`📊 Total de citas antes de limpiar: ${countBefore}`)

  if (countBefore === 0) {
    console.log('✅ La tabla de citas ya está vacía.')
    return
  }

  // Mostrar advertencia
  console.log('')
  console.log(`⚠️  ADVERTENCIA: Se eliminarán ${countBefore} citas de la base de datos.`)
  console.log(`⚠️  Ambiente: ${isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'}`)
  console.log('')
  
  // Eliminar todas las citas
  console.log('🗑️  Eliminando citas...')
  const result = await prisma.cita.deleteMany({})
  
  console.log('')
  console.log(`✅ ${result.count} citas eliminadas exitosamente.`)
  console.log('✅ La tabla de citas ha sido limpiada.')
}

main()
  .catch((e) => {
    console.error('')
    console.error('❌ Error limpiando la tabla de citas:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

