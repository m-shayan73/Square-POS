import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createPosService } from '@/shared/services/pos/pos-service-factory'
import type { IPosService } from '@/shared/services/pos/pos.interface'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export function createListTaxesRoute(
  createPosServiceFn: (token: string, locationId: string) => IPosService,
) {
  return async function GET() {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const posService = createPosServiceFn(
      session.accessToken as string,
      session.locationId as string,
    )

    const taxes = await posService.listTaxes()
    return NextResponse.json(taxes)
  }
}

export const GET = createListTaxesRoute(createPosService)
