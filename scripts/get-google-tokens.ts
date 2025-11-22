/**
 * Script para obtener tokens de Google Calendar API
 * 
 * Ejecutar con: npx tsx scripts/get-google-tokens.ts
 */

import { google } from 'googleapis'
import * as readline from 'readline'
import * as url from 'url'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('\n🔐 Configuración de Google Calendar API Tokens\n')
  
  // Leer credenciales
  const clientId = await question('Ingresa tu Client ID: ')
  const clientSecret = await question('Ingresa tu Client Secret: ')
  const redirectUri = await question('Ingresa tu Redirect URI (http://localhost:3000/api/auth/callback/google): ') || 'http://localhost:3000/api/auth/callback/google'

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

  // Generar URL de autorización
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    prompt: 'consent', // Forzar consentimiento para obtener refresh token
  })

  console.log('\n📋 Sigue estos pasos:\n')
  console.log('1. Abre esta URL en tu navegador:')
  console.log(`\n${authUrl}\n`)
  console.log('2. Autoriza la aplicación')
  console.log('3. Serás redirigido a una URL. Copia toda la URL completa del navegador')
  console.log('4. Pega la URL aquí abajo\n')

  const redirectUrl = await question('Pega la URL de redirección completa aquí: ')

  // Extraer el código de autorización de la URL
  const urlObj = new URL(redirectUrl)
  const code = urlObj.searchParams.get('code')

  if (!code) {
    console.error('\n❌ Error: No se encontró el código de autorización en la URL')
    console.log('Asegúrate de copiar toda la URL después de la redirección')
    rl.close()
    process.exit(1)
  }

  try {
    // Intercambiar código por tokens
    console.log('\n⏳ Obteniendo tokens...\n')
    const { tokens } = await oauth2Client.getToken(code)

    console.log('✅ ¡Tokens obtenidos exitosamente!\n')
    console.log('📝 Agrega estas líneas a tu archivo .env:\n')
    console.log('=' .repeat(60))
    console.log('GOOGLE_ACCESS_TOKEN="' + tokens.access_token + '"')
    console.log('GOOGLE_REFRESH_TOKEN="' + tokens.refresh_token + '"')
    console.log('=' .repeat(60))
    console.log('\n⚠️  IMPORTANTE: Guarda estos tokens de forma segura!')
    console.log('⚠️  El refresh token solo se muestra una vez\n')

  } catch (error) {
    console.error('\n❌ Error obteniendo tokens:', error)
    if (error instanceof Error) {
      console.error('Detalle:', error.message)
    }
  }

  rl.close()
}

main().catch(console.error)

