export const dynamic = "force-dynamic";

import { getMetricsController } from "@/features/product/product.controller";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const productsOffer = await getMetricsController();
    return NextResponse.json(productsOffer, { status: 200 });
  } catch (e) {
    const error = e as Error;
    console.error(error);
    return NextResponse.json({ message: error.message, success: false });
  }
}
