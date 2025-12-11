export const dynamic = "force-dynamic";
import { searchProduct } from "@/lib/controllers/product";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const data = await searchProduct(req);
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 404 });
  }
}
