import { verifyPasswordController } from "@/features/admin/admin.controller";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    const verifyController = await verifyPasswordController(email, code);

    return NextResponse.json(verifyController, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message, success: false }, { status: 404 });
  }
}
