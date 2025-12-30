import { getProductIDController } from "@/features/product/product.controller";
import { NextResponse } from "next/server";

type Params = {
  id: string;
};

export async function GET(_: Request, { params }: { params: Promise<Params> }) {
  try {
    const { id } = await params;
    const response = await getProductIDController(id);
    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message, success: false });
  }
}
