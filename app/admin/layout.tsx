"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Uncomment this for production use
  /*
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (session?.user?.role !== UserRole.ADMIN) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session || session.user.role !== UserRole.ADMIN) {
    return null;
  }
  */

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md h-screen fixed">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Demo Mode</p>
          </div>
          <nav className="mt-4 flex flex-col h-[calc(100vh-6rem)] justify-between">
            <div>
              <Link
                href="/admin"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                User Management
              </Link>
              <Link
                href="/admin/jobs"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Job Management
              </Link>
              <Link
                href="/admin/settings"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Settings
              </Link>
            </div>

            <div className="mb-8">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-8">{children}</div>
      </div>
    </div>
  );
}
