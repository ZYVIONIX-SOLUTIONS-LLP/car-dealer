import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vehicleDetailInclude } from "@/lib/data";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get("ids");
  if (!ids) return NextResponse.json({ vehicles: [] });

  const idList = ids.split(",").filter(Boolean).slice(0, 20);
  const vehicles = await db.vehicle.findMany({
    where: { id: { in: idList } },
    include: vehicleDetailInclude,
  });

  return NextResponse.json({ vehicles });
}
