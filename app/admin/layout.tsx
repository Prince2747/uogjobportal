"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { user_role } from "@prisma/client";
import { LogOut, LayoutDashboard, Users, Briefcase, Settings } from "lucide-react";

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
    } else if (session?.user?.role !== user_role.ADMIN) {
      router.push("/");
    }
  }, [session, status, router]);
  */

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#F8F9FA]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3A95E8]"></div>
      </div>
    );
  }

  /*
  if (!session || session.user.role !== user_role.ADMIN) {
    return null;
  }
  */

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F8F9FA]">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen fixed border-r border-gray-100">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#3A95E8] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#3A95E8]">Admin Portal</h1>
                <p className="text-sm text-gray-500 mt-0.5">Demo Mode</p>
              </div>
            </div>
          </div>
          <nav className="mt-6 flex flex-col h-[calc(100vh-8rem)] justify-between">
            <div className="px-3 space-y-1">
              <Link
                href="/admin"
                className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-[#3A95E8]/5 rounded-lg transition-all duration-200 group"
              >
                <LayoutDashboard className="h-5 w-5 mr-3 text-gray-400 group-hover:text-[#3A95E8]" />
                <span className="group-hover:text-[#3A95E8]">Dashboard</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-[#3A95E8]/5 rounded-lg transition-all duration-200 group"
              >
                <Users className="h-5 w-5 mr-3 text-gray-400 group-hover:text-[#3A95E8]" />
                <span className="group-hover:text-[#3A95E8]">Users</span>
              </Link>
              <Link
                href="/admin/jobs"
                className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-[#3A95E8]/5 rounded-lg transition-all duration-200 group"
              >
                <Briefcase className="h-5 w-5 mr-3 text-gray-400 group-hover:text-[#3A95E8]" />
                <span className="group-hover:text-[#3A95E8]">Jobs</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-[#3A95E8]/5 rounded-lg transition-all duration-200 group"
              >
                <Settings className="h-5 w-5 mr-3 text-gray-400 group-hover:text-[#3A95E8]" />
                <span className="group-hover:text-[#3A95E8]">Settings</span>
              </Link>
            </div>

            <div className="p-3">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-3 py-2.5 text-gray-700 hover:bg-red-50 rounded-lg transition-all duration-200 group"
              >
                <LogOut className="h-5 w-5 mr-3 text-gray-400 group-hover:text-red-600" />
                <span className="group-hover:text-red-600">Sign Out</span>
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
