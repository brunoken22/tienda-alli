import {
  deleteBannerController,
  updateBannerController,
} from "@/features/banner/banner.controller";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Falta el id del banner" }, { status: 400 });
    }

    const formData = await req.formData();
    const data = await updateBannerController(id, formData);
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    console.error("Error in PATCH /api/admin/banner/[id]:", e);
    return NextResponse.json(
      { error: e.message || "Internal server error", success: false },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Falta el id del banner" }, { status: 400 });
    }

    const data = await deleteBannerController(id);
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    const error = e as Error;
    console.error("Error in DELETE /api/admin/banner/[id]:", e);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
