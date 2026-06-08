import { getInventoryAnalyticsController } from "@/features/inventory/inventory.controller";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await getInventoryAnalyticsController();

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
