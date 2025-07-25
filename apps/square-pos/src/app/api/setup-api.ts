import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'

export default async function setupAPI() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const baseUrl = process.env.SQUARE_BASE_URL as string
  const apiVersion = process.env.SQUARE_API_VERSION as string
  const accessToken = session?.accessToken

  return {
    baseUrl,
    apiVersion,
    accessToken,
  }
}
