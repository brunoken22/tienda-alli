import { getAdminController } from "@/features/admin/admin.controller";
import Admin from "@/features/admin/admin.model";
import { NextResponse } from "next/server";

export async function GET(_: Request) {
  try {
    const admin = await getAdminController();
    return NextResponse.json(admin, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message, success: false }, { status: 404 });
  }
}

export async function POST() {
  try {
    const newAdmin = await Admin.create({
      name: "Tienda Alli", // Debes proporcionar un nombre
      email: "bruno_am_22@hotmail.com",
      password: "123456789", // El hook beforeCreate la hasheará automáticamente
      role: "admin",
    });

    return NextResponse.json(newAdmin);
  } catch (e) {
    const error = e as Error;
    return NextResponse.json(error.message);
  }
}
