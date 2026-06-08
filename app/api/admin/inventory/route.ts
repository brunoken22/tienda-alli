import {
  createInventoryMovementController,
  getInventoryMovementsController,
} from "@/features/inventory/inventory.controller";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const response = await createInventoryMovementController(formData);
    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message, success: false }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;

    const response = await getInventoryMovementsController({
      page,
      limit,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    const error = e as Error;

    return NextResponse.json(
      {
        message: error.message,
        success: false,
      },
      { status: 400 },
    );
  }
}
