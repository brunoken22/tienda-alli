import { AuthService } from "@/lib/jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function verifyTokenMiddleware(req: Request) {
  const authHeader = (await cookies()).get("token_admin");

  if (!authHeader || !authHeader.value) {
    return NextResponse.json({ error: "Token no proporcionado" }, { status: 401 });
  }

  const token = authHeader.value;

  try {
    const decoded = AuthService.verifyToken(token);
    (req as any).user = decoded; // Agregar usuario al request
    return NextResponse.next();
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
