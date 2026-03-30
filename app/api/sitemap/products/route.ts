import { getProductsSitemapController } from "@/features/product/product.controller";
import { NextResponse } from "next/server";

export async function GET(_: Request) {
  try {
    const products = await getProductsSitemapController();
    return NextResponse.json(products, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
