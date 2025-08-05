import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { createPosService } from "@/services/pos/pos-service-factory";
import type { IPosService } from "@/services/pos/pos.interface";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

function createListDiscountsRoute(
  createPosServiceFn: (token: string, locationId: string) => IPosService
) {
  return async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const posService = createPosServiceFn(
      session.accessToken as string,
      session.locationId as string
    );

    const discounts = await posService.listDiscounts();
    return NextResponse.json(discounts);
  };
}

export const GET = createListDiscountsRoute(createPosService);
