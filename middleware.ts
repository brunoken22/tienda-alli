// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const routingAdmin = [
  "/admin/dashboard",
  "/admin/dashboard/productos",
  "/admin/dashboard/categorias",
  "/admin/dashboard/banners",
  "/admin/dashboard/cambiar-contrasena",
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;
  const authToken = request.cookies.get("token_admin")?.value;
  if (path.includes("/api/admin")) {
    if (method === "POST" || method === "PATCH" || method === "DELETE") {
      if (authToken) {
        return NextResponse.next();
      } else {
        return NextResponse.json({ message: "No autorizado", success: false }, { status: 401 });
      }
    }
    return NextResponse.next();
  }

  if (!authToken) {
    if (path === "/admin/login") return NextResponse.next();
    if (path === "/admin/recuperar-cuenta") return NextResponse.next();

    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const dashboardUrl = new URL("/admin/dashboard", request.url);

  if (!routingAdmin.includes(path)) return NextResponse.redirect(dashboardUrl);

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/category/:path*",
    "/api/admin/product/:path*",
    "/api/admin/reset-password",
  ],
};
