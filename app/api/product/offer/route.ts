export const dynamic = "force-dynamic";

import { getOfferProductsController } from "@/features/product/product.controller";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const productsOffer = await getOfferProductsController();
    return NextResponse.json(productsOffer, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message, success: false });
  }
}
