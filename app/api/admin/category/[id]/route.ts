import {
  deleteCategoryController,
  updateCategoryController,
} from "@/features/category/category.controller";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Falta el id de la categoria" }, { status: 400 });
    }

    const formData = await req.formData();
    const data = await updateCategoryController(id, formData);
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    console.error("Error in PATCH /api/admin/product/[id]:", e);
    return NextResponse.json(
      { error: e.message || "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Falta el id de la categoria" }, { status: 400 });
    }

    const data = await deleteCategoryController(id);
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    const error = e as Error;
    console.error("Error in DELETE /api/admin/category/[id]:", e);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
