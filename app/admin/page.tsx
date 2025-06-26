"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Users, 
  Briefcase, 
  FileText, 
  Bell, 
  PlusCircle, 
  ChevronRight,
  UserPlus,
  FileCheck,
  Building
} from "lucide-react";

type DashboardStats = {
  totalUsers: number;
  activeJobs: number;
  totalApplications: number;
};

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeJobs: 0,
    totalApplications: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#3A95E8]">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening in your job portal today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:border-[#3A95E8] hover:text-[#3A95E8] transition-all duration-200 flex items-center shadow-sm">
            <Bell className="w-4 h-4 mr-2" />
            <span>Notifications</span>
          </button>
          <Link
            href="/admin/jobs/new"
            className="px-4 py-2 bg-[#3A95E8] text-white rounded-lg hover:bg-[#3A95E8]/90 transition-all duration-200 flex items-center shadow-sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-500">Total Users</span>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : stats.totalUsers}
                </h3>
              </div>
              <p className="text-sm text-gray-600">Active accounts</p>
            </div>
            <div className="p-2 bg-[#3A95E8]/10 rounded-lg">
              <Users className="w-6 h-6 text-[#3A95E8]" />
            </div>
          </div>
          <Link
            href="/admin/users"
            className="mt-4 flex items-center text-sm text-[#3A95E8] hover:text-[#3A95E8]/80"
          >
            <span>View all users</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-500">Active Jobs</span>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : stats.activeJobs}
                </h3>
              </div>
              <p className="text-sm text-gray-600">Open positions</p>
            </div>
            <div className="p-2 bg-[#FFBC09]/10 rounded-lg">
              <Briefcase className="w-6 h-6 text-[#FFBC09]" />
            </div>
          </div>
          <Link
            href="/admin/jobs"
            className="mt-4 flex items-center text-sm text-[#FFBC09] hover:text-[#FFBC09]/80"
          >
            <span>View all jobs</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-500">Applications</span>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : stats.totalApplications}
                </h3>
              </div>
              <p className="text-sm text-gray-600">Total submissions</p>
            </div>
            <div className="p-2 bg-[#3A95E8]/10 rounded-lg">
              <FileText className="w-6 h-6 text-[#3A95E8]" />
            </div>
          </div>
          <Link
            href="/admin/applications"
            className="mt-4 flex items-center text-sm text-[#3A95E8] hover:text-[#3A95E8]/80"
          >
            <span>View applications</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/users/new" className="p-4 text-left bg-gray-50 rounded-lg hover:bg-[#3A95E8]/5 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#3A95E8]/10 rounded-lg">
                <UserPlus className="w-5 h-5 text-[#3A95E8]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Add New User</h3>
                <p className="text-sm text-gray-500">Create a new user account</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/jobs/new" className="p-4 text-left bg-gray-50 rounded-lg hover:bg-[#FFBC09]/5 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#FFBC09]/10 rounded-lg">
                <Building className="w-5 h-5 text-[#FFBC09]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Post New Job</h3>
                <p className="text-sm text-gray-500">Create a job listing</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/applications" className="p-4 text-left bg-gray-50 rounded-lg hover:bg-[#3A95E8]/5 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#3A95E8]/10 rounded-lg">
                <FileCheck className="w-5 h-5 text-[#3A95E8]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Review Applications</h3>
                <p className="text-sm text-gray-500">Check pending applications</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
