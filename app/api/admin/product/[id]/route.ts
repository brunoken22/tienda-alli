import {
  deleteProductController,
  editProductController,
} from "@/features/product/product.controller";
import { NextResponse } from "next/server";

type Params = {
  id: string;
};

export async function PATCH(req: Request, { params }: { params: Promise<Params> }) {
  try {
    const id = (await params).id;
    const formData = await req.formData();
    const data = await editProductController(id, formData);
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 404 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<Params> }) {
  try {
    const id = (await params).id;
    const data = await deleteProductController(id);
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 404 });
  }
}
