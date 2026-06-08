import { getInventoryAnalyticsController } from "@/features/inventory/inventory.controller";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const range = searchParams.get("range") || "7d";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const response = await getInventoryAnalyticsController({
      range,
      startDate,
      endDate,
    });

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (e) {
    const error = e as Error;

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
      },
    );
  }
}
