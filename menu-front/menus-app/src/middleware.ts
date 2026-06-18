import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || 'menumaster_access_secret_key_2025_very_secure_32chars'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login', '/registro', '/landing'];
  
  // Verificar si es una ruta pública
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Obtener token de cookie
  const accessToken = request.cookies.get('access_token')?.value;

  // Si no hay token y no es ruta pública, redirigir a login
  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verificar JWT en el edge (sin llamar al backend)
    const { payload } = await jwtVerify(accessToken, JWT_SECRET);

    // Token válido - crear response y agregar headers con datos del usuario
    const response = NextResponse.next();
    response.headers.set('x-user-id', String(payload.userId));
    response.headers.set('x-user-email', String(payload.email));
    response.headers.set('x-user-plan', String(payload.plan));

    return response;

  } catch (error) {
    // Token expirado o inválido - redirigir a login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - landing page (pública)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|landing).*)',
  ],
};