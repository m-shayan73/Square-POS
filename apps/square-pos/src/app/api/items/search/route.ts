import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createPosService } from '@/shared/services/pos/pos-service-factory'
import type { IPosService } from '@/shared/services/pos/pos.interface'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'
import type { SearchParams } from '@/shared/types'

export function createSearchItemsRoute(
  createPosServiceFn: (token: string, locationId: string) => IPosService,
) {
  return async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }


    const searchParams = (await req.json()) as SearchParams || {}
    
    const posService = createPosServiceFn(
      session.accessToken as string,
      session.locationId as string,
    )

    const items = await posService.searchItems(searchParams)
    return NextResponse.json(items)
  }
}

export const POST = createSearchItemsRoute(createPosService)
