import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define role types explicitly since we can't import from @prisma/client in middleware
type UserRole = "ADMIN" | "HR" | "DEPARTMENT" | "APPLICANT";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/signin") || 
                      req.nextUrl.pathname.startsWith("/signup");

    // Redirect authenticated users away from auth pages
    if (isAuthPage) {
      if (isAuth) {
        const userRole = token?.role as UserRole;
        // Redirect to appropriate dashboard based on role
        switch (userRole) {
          case "ADMIN":
            return NextResponse.redirect(new URL("/admin", req.url));
          case "HR":
            return NextResponse.redirect(new URL("/hr", req.url));
          case "DEPARTMENT":
            return NextResponse.redirect(new URL("/department", req.url));
          case "APPLICANT":
            return NextResponse.redirect(new URL("/applicant", req.url));
          default:
            return NextResponse.redirect(new URL("/", req.url));
        }
      }
      return null;
    }

    // Handle role-based access
    if (isAuth) {
      const userRole = token?.role as UserRole;
      const path = req.nextUrl.pathname;

      // Define role access rules
      const roleAccess: Record<UserRole, string[]> = {
        ADMIN: ["/admin", "/hr", "/department", "/jobs", "/applicant"],
        HR: ["/hr", "/jobs", "/applicant"],
        DEPARTMENT: ["/department", "/jobs"],
        APPLICANT: ["/applicant", "/jobs"],
      };

      // Check if user has access to the requested path
      const hasAccess = roleAccess[userRole]?.some(route => path.startsWith(route));
      
      if (!hasAccess) {
        // Redirect to appropriate dashboard based on role
        const redirectPath = roleAccess[userRole]?.[0] || "/";
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true; // Let the middleware handle the auth check
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/hr/:path*",
    "/department/:path*",
    "/jobs/:path*",
    "/applicant/:path*",
    "/signin",
    "/signup",
  ],
};