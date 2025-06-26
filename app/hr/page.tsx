"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageSquare, Users, BriefcaseIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { user_role } from "@prisma/client";

type UserRole = "admin" | "hr" | "applicant";

interface SessionUser {
  id: string;
  role: user_role;
  name?: string;
  email?: string;
}

interface DashboardStat {
  totalApplicants: number;
  activeJobs: number;
  pendingApplications: number;
  totalChats: number;
}

export default function HRDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStat>({
    totalApplicants: 0,
    activeJobs: 0,
    pendingApplications: 0,
    totalChats: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else {
      const user = session?.user as SessionUser | undefined;
      if (user?.role !== "HR") {
        router.push("/unauthorized");
      }
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/hr/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching HR stats:", error);
      }
    };

    fetchStats();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session?.user?.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplicants}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
              <BriefcaseIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
              <BriefcaseIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Chats</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalChats}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/hr/applicants" 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <Users className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Applicants</h3>
                <p className="text-gray-600">View and manage job applicants</p>
              </div>
            </div>
          </Link>

          <Link href="/chat" 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-6 w-6 text-purple-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Chat Center</h3>
                <p className="text-gray-600">Communicate with applicants</p>
              </div>
            </div>
          </Link>

          <Link href="/videocall" 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <VideoIcon className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Video Interviews</h3>
                <p className="text-gray-600">Conduct video interviews</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
