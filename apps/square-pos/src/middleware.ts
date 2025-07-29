import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/', // Redirect unauthenticated users to the root (login) page
    },
  },
)

export const config = {
  matcher: [
    // Protect everything except for the auth api route and public assets
    '/((?!api/auth|favicon.ico|square-logo-black.svg|square-logo-white.svg).*)',
  ],
}
