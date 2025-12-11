import {
  deleteProductController,
  editProductController,
} from "@/features/product/product.controller";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const formData = await req.formData();
    const data = await editProductController(id, formData);
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    console.error("Error in PATCH /api/admin/product/[id]:", e);
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const data = await deleteProductController(id);
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    console.error("Error in DELETE /api/admin/product/[id]:", e);
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}
