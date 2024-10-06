import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async (req) => {
    const token: any = await getToken({ req });
    
    if (!token || Date.now() > token.exp * 1000 || !token.user) {
      // Redirigir al usuario a la página de login
      const requestedPath = req.nextUrl.pathname;
      if (requestedPath.startsWith("/checkout") || requestedPath.startsWith("/admin")) {
        return NextResponse.redirect(new URL(`/auth/login?p=${requestedPath}`, req.url));
      }
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Verificar si `token.user` existe antes de acceder a `roles`
    if (req.nextUrl.pathname.startsWith("/admin") && (!token.user || !token.user.roles?.includes('admin'))) {
      return NextResponse.redirect(new URL('/', req.url)); // Redirige a la página de inicio si no es admin
    }

    return NextResponse.next(); // Permite el acceso si está autenticado y/o es admin
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Asegúrate de que el usuario esté autenticado
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*"], // Aplica este middleware a todas las rutas /admin/*
};