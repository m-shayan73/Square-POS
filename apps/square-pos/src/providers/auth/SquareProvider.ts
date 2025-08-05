import type { OAuthConfig } from 'next-auth/providers/oauth'

interface SquareProfile {
  id: string
  business_name?: string
  main_location_id?: string
}

const scope = 'MERCHANT_PROFILE_READ PAYMENTS_READ ITEMS_READ ITEMS_WRITE ORDERS_READ ORDERS_WRITE'
const baseUrl = process.env.SQUARE_BASE_URL
if (!baseUrl) {
  throw new Error('SQUARE_BASE_URL environment variable is not set.')
}
const apiVersion = process.env.SQUARE_API_VERSION
if (!apiVersion) {
  throw new Error('SQUARE_API_VERSION environment variable is not set.')
}

export default function SquareProvider(): OAuthConfig<SquareProfile> {
  return {
    id: 'square',
    name: 'Square',
    type: 'oauth',
    version: '2.0',
    clientId: process.env.AUTH_SQUARE_ID,
    clientSecret: process.env.AUTH_SQUARE_SECRET,

    authorization: {
      url: `${baseUrl}/oauth2/authorize`,
      params: {
        scope: scope,
      },
    },

    token: {
      url: `${baseUrl}/oauth2/token`,
      async request(context) {
        const { params, provider } = context

        // Ensure provider.token is an object and has a url property
        const tokenUrl =
          typeof provider.token === 'object' && 'url' in provider.token
            ? provider.token.url
            : typeof provider.token === 'string'
              ? provider.token
              : undefined

        if (!tokenUrl) {
          throw new Error('Invalid token endpoint configuration for Square provider.')
        }

        const redirectUri = `${
          process.env.NEXTAUTH_URL || 'http://localhost:3000'
        }/api/auth/callback/square`

        if (!provider.clientId) {
          throw new Error('Square client ID is not configured.')
        }
        if (!provider.clientSecret) {
          throw new Error('Square client secret is not configured.')
        }
        if (!params.code) {
          throw new Error('Authorization code is missing.')
        }

        const body = JSON.stringify({
          client_id: provider.clientId,
          client_secret: provider.clientSecret,
          code: params.code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        })

        const res = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Square-Version': apiVersion as string,
            'Content-Type': 'application/json',
          },
          body,
        })

        const tokens = await res.json()
        return { tokens }
      },
    },

    userinfo: {
      url: `${baseUrl}/v2/merchants/me`,
      async request(context) {
        const { tokens, provider } = context

        // Ensure provider.userinfo is an object and has a url property
        const userinfoUrl =
          typeof provider.userinfo === 'object' && 'url' in provider.userinfo
            ? provider.userinfo.url
            : typeof provider.userinfo === 'string'
              ? provider.userinfo
              : undefined

        if (!userinfoUrl) {
          throw new Error('Invalid userinfo endpoint configuration for Square provider.')
        }

        const res = await fetch(userinfoUrl, {
          headers: {
            'Square-Version': apiVersion as string,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens.access_token}`,
          },
        })

        if (!res.ok) {
          throw new Error('Failed to fetch userinfo')
        }

        const clonedRes = res.clone()
        const data = await clonedRes.json()
        return data.merchant
      },
    },

    profile(profile) {
      return {
        id: profile.id,
        name: profile.business_name || 'Square User',

        // Square does not return an email address and image
        email: null,
        image: null,
      }
    },
  }
}
