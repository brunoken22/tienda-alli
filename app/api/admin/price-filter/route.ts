import { getPriceFilterController } from "@/features/product/product.controller";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await getPriceFilterController();
    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message, success: false }, { status: 500 });
  }
}
