'use client'

import Login from '@/components/composites/login'
import { useSession } from 'next-auth/react'
import CenterSpinner from '@/components/primitive/derived/CenterSpinner'
import { Box } from '@styled-system/jsx/box'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Box width="screen" height="screen">
        <CenterSpinner />
      </Box>
    )
  }

  return <Login />
}
