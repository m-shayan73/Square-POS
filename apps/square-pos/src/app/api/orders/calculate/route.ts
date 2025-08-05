import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { createPosService } from "@/services/pos/pos-service-factory";
import type { IPosService } from "@/services/pos/pos.interface";
import type { CalculateOrderParams } from "@/types";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

function createCalculateOrderRoute(
  createPosServiceFn: (token: string, locationId: string) => IPosService
) {
  return async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let calculateParams: CalculateOrderParams = { items: [] };

    try {
      const text = await req.text();
      if (text) {
        calculateParams = JSON.parse(text) as CalculateOrderParams;
      }
    } catch (error) {
      console.error("Error parsing calculateParams JSON:", error);
    }

    const ordersService = createPosServiceFn(
      session.accessToken as string,
      session.locationId as string
    );

    const result = await ordersService.calculateOrder(calculateParams);
    return NextResponse.json(result);
  };
}

export const POST = createCalculateOrderRoute(createPosService);
