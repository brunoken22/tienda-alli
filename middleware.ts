// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const routingAdmin = [
  "/admin/dashboard",
  "/admin/dashboard/productos",
  "/admin/dashboard/cambiar-contrasena",

  // "/admin/dashboard/orders",
  // "/admin/dashboard/information",
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const authToken = request.cookies.get("token_admin")?.value;
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
  matcher: ["/admin/:path*"],
};
