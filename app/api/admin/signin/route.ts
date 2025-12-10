import { signinAdminController } from "@/features/admin/admin.controller";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const data = await signinAdminController(email, password);
    return NextResponse.json({ data, success: true });
  } catch (e) {
    const error = e as Error;
    console.error(error);
    return NextResponse.json({ message: error.message, success: false });
  }
}
