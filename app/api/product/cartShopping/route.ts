export const dynamic = "force-dynamic";
import { getShoppingCartController } from "@/features/product/product.controller";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const shoppingCart = await req.json();
    const data = await getShoppingCartController(shoppingCart);
    return NextResponse.json(data);
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message, success: false }, { status: 500 });
  }
}
