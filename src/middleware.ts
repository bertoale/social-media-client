import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRoleFromToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ["/", "/explore", "/create", "/profile", "/post"];
  const authRoutes = ["/login", "/register"];
  const adminRoutes = ["/admin"];

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 🚫 belum login → protected
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    const role = getRoleFromToken(token);

    // 🚫 admin masuk app
    if (role === "admin" && isProtectedRoute) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // 🚫 user masuk admin
    if (role === "user" && isAdminRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 🚫 sudah login → auth pages
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/explore/:path*",
    "/create/:path*",
    "/profile/:path*",
    "/post/:path*",
    "/login",
    "/register",
  ],
};
