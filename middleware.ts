import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define role access rules
const roleAccess = {
  ADMIN: ["/admin", "/hr", "/department", "/jobs", "/applicant"],
  HR: ["/hr", "/jobs", "/applicant"],
  DEPARTMENT: ["/department", "/jobs"],
  APPLICANT: ["/applicant", "/jobs"],
} as const;

// Public routes that don't require authentication
const publicRoutes = ["/", "/signin", "/signup", "/forgot-password", "/reset-password"];

// Temporarily disable auth for development
export default function middleware(req: NextRequest) {
  // Allow all requests during development
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/hr/:path*",
    "/department/:path*",
    "/jobs/:path*",
    "/applicant/:path*",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],
};