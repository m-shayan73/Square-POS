import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { createPosService } from "@/services/pos/pos-service-factory";
import type { IPosService } from "@/services/pos/pos.interface";
import type { SearchFilters } from "@/types";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

function createSearchItemsRoute(
  createPosServiceFn: (token: string, locationId: string) => IPosService
) {
  return async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let searchParams: SearchFilters = {};
    try {
      const text = await req.text();
      if (text) {
        searchParams = JSON.parse(text) as SearchFilters;
      }
    } catch (error) {
      console.error("Error parsing request JSON:", error);
    }

    const posService = createPosServiceFn(
      session.accessToken as string,
      session.locationId as string
    );

    const items = await posService.searchItems(searchParams);
    return NextResponse.json(items);
  };
}

export const POST = createSearchItemsRoute(createPosService);
