import SquareProvider from '@/shared/providers/auth/SquareProvider'
import axios from 'axios'
import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [SquareProvider()],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expires_at = account.expires_at
      }

      if (profile && 'main_location_id' in profile) {
        token.locationId = profile.main_location_id as string
      }

      // Return previous token if it's still valid
      const tokenExpiresAt = new Date(token.expires_at as string)
      if (Date.now() < tokenExpiresAt.getTime()) {
        return token
      }

      // Access token expired, try to refresh
      async function refreshAccessToken() {
        const baseUrl = process.env.SQUARE_BASE_URL
        const body = JSON.stringify({
          client_id: process.env.AUTH_SQUARE_ID,
          client_secret: process.env.AUTH_SQUARE_SECRET,
          grant_type: 'refresh_token',
          refresh_token: token.refreshToken,
        })

        const res = await axios.post(`${baseUrl}/oauth2/token`, body, {
          headers: { 'Content-Type': 'application/json' },
        })

        if (res.status !== 200) {
          throw new Error('Failed to refresh access token')
        }

        const new_token = res.data
        if (profile && 'locationId' in profile) {
          new_token.locationId = profile.locationId as string
        }

        return new_token
      }

      return await refreshAccessToken()
    },
    async session({ session, token }) {
      // @ts-expect-error: accessToken is a custom property added to the session
      session.accessToken = token.accessToken
      // @ts-expect-error: locationId is a custom property added to the token and session
      session.locationId = token.locationId

      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
