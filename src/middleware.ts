import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
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

  // Check if user is already logged in and trying to access auth pages
  if (token && isAuthRoute) {
    // Validate session by checking with API
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/users/me`, {
        headers: {
          Cookie: `token=${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userRole = data.data?.role;

        // Admin users should not access regular app routes
        if (userRole === "admin" && isProtectedRoute) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }

        // Already logged in, redirect to home
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      // Session validation failed, allow access to auth pages
    }
  }

  // No token and trying to access protected route
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Has token but trying to access admin route - validate role
  if (token && isAdminRoute) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/users/me`, {
        headers: {
          Cookie: `token=${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userRole = data.data?.role;

        // Non-admin users cannot access admin routes
        if (userRole !== "admin") {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } else {
        // Invalid session, redirect to login
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch {
      // Validation failed, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
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
