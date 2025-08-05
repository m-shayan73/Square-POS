import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { createPosService } from "@/services/pos/pos-service-factory";
import type { IPosService } from "@/services/pos/pos.interface";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

function createListItemsRoute(
  createPosServiceFn: (token: string, locationId: string) => IPosService
) {
  return async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const itemsService = createPosServiceFn(
      session.accessToken as string,
      session.locationId as string
    );

    const items = await itemsService.listItems();
    return NextResponse.json(items);
  };
}

export const GET = createListItemsRoute(createPosService);
