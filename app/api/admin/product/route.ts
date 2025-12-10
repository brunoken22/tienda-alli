import {
  createProductController,
  getProductsController,
} from "@/features/product/product.controller";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  try {
    const products = await getProductsController();
    return NextResponse.json(products, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data = await createProductController(formData);
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 404 });
  }
}
