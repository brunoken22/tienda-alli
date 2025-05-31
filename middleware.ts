// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Si es una ruta de admin, verifica autenticación
  const authToken = request.cookies.get('auth_token')?.value;

  if (!authToken) {
    // Si no hay token, redirige al login
    if (path === '/admin') return NextResponse.next();

    const loginUrl = new URL('/admin', request.url);
    return NextResponse.redirect(loginUrl);
  }
  if (path === '/admin/dashboard') return NextResponse.next();

  const dashboardUrl = new URL('/admin/dashboard', request.url);

  return NextResponse.redirect(dashboardUrl);
}

// Configuración para qué rutas aplicar el middleware
export const config = {
  matcher: ['/admin', '/admin/dashboard'],
};
