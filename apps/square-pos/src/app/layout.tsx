import { ReactScan } from '@/containers/ReactScan'
import { AuthSessionProvider } from '@/shared/providers'
import QueryProvider from '@/shared/providers/TanStackQueryProvider'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Square POS Application',
  description: 'Square POS Application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/react-scan/dist/auto.global.js" />
      </head>
      <ReactScan />
      <body>
        <AuthSessionProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
