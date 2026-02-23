export const dynamic = "force-dynamic";
import { getCategoryProductsController } from "@/features/product/product.controller";
import { NextResponse } from "next/server";

export async function GET(_: Request) {
  try {
    const data = await getCategoryProductsController();
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message, success: false }, { status: 500 });
  }
}
