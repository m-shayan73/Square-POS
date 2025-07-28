import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createPosService } from '@/shared/services/pos/pos-service-factory'
import type { IPosService } from '@/shared/services/pos/pos.interface'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'
import type { CalculateOrderParams } from '@/shared/types'

export function createCalculateOrderRoute(
  createPosServiceFn: (token: string, locationId: string) => IPosService,
) {
  return async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const calculateParams = (await req.json()) as CalculateOrderParams || {}

    const ordersService = createPosServiceFn(
      session.accessToken as string,
      session.locationId as string,
    )

    const result = await ordersService.calculateOrder(calculateParams)
    return NextResponse.json(result)
  }
}

export const POST = createCalculateOrderRoute(createPosService)
