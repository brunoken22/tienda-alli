import {
  createCategoryController,
  getCategoriesController,
} from "@/features/category/category.controller";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await getCategoriesController();
    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message, success: false }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const response = await createCategoryController(formData);
    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message, success: false }, { status: 400 });
  }
}
