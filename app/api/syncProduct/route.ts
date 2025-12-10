export const dynamic = "force-dynamic";
import { getProducts } from "@/lib/products";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getProducts();
    return NextResponse.json(data.length);
  } catch (e: any) {
    return NextResponse.json(e.message);
  }
}
