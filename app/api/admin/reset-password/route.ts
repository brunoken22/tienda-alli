import { resetPasswordController } from "@/features/admin/admin.controller";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const { id, password, newPassword } = await req.json();
    const responseController = await resetPasswordController(id, password, newPassword);
    return NextResponse.json(responseController, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json(
      {
        message: error.message,
        success: false,
      },
      { status: 400 }
    );
  }
}
