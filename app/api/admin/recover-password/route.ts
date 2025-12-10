import {
  recoverPasswordController,
  sendEmailPasswordController,
} from "@/features/admin/admin.controller";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const recoverController = await sendEmailPasswordController(email);
    return NextResponse.json(recoverController, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message }, { status: 404 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { email, code, password } = await req.json();
    const recoverController = await recoverPasswordController(email, code, password);
    return NextResponse.json(recoverController, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message }, { status: 404 });
  }
}
