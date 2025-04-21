"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function JobSeekerDashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Job Seeker Dashboard
          </h1>
          <p className="text-gray-600">Manage your profile and applications</p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/dashboard/profile"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </Link>
          <Link
            href="/jobs"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Find Jobs
          </Link>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
            <p className="text-gray-600">Computer Science Graduate</p>
            <div className="mt-2 flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Profile Completion: 85%
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="w-4/5 h-full bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
          <p className="text-sm text-gray-600">Total applications submitted</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-900">Interviews</h3>
          <p className="text-3xl font-bold text-green-600">3</p>
          <p className="text-sm text-gray-600">Upcoming interviews</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-gray-900">Saved Jobs</h3>
          <p className="text-3xl font-bold text-purple-600">8</p>
          <p className="text-sm text-gray-600">Jobs to apply later</p>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Applications
          </h2>
          <Link
            href="/dashboard/applications"
            className="text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">
                Assistant Professor - Computer Science
              </h3>
              <p className="text-sm text-gray-600">University of Gondar</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                Under Review
              </span>
              <p className="text-sm text-gray-500 mt-1">Applied 2 days ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Research Fellow</h3>
              <p className="text-sm text-gray-600">University of Gondar</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 text-sm text-yellow-800 bg-yellow-100 rounded-full">
                Pending
              </span>
              <p className="text-sm text-gray-500 mt-1">Applied 5 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recommended Jobs
          </h2>
          <Link href="/jobs" className="text-blue-600 hover:text-blue-700">
            Browse All Jobs
          </Link>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">
              Lecturer - Software Engineering
            </h3>
            <p className="text-sm text-gray-600 mb-2">University of Gondar</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Full Time</span>
              <span>•</span>
              <span>Addis Ababa</span>
              <span>•</span>
              <span>Posted 3 days ago</span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Research Assistant</h3>
            <p className="text-sm text-gray-600 mb-2">University of Gondar</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Part Time</span>
              <span>•</span>
              <span>Remote</span>
              <span>•</span>
              <span>Posted 1 week ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function JobSeekerDashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Job Seeker Dashboard
          </h1>
          <p className="text-gray-600">Manage your profile and applications</p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/dashboard/profile"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </Link>
          <Link
            href="/jobs"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Find Jobs
          </Link>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
            <p className="text-gray-600">Computer Science Graduate</p>
            <div className="mt-2 flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Profile Completion: 85%
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="w-4/5 h-full bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
          <p className="text-sm text-gray-600">Total applications submitted</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-900">Interviews</h3>
          <p className="text-3xl font-bold text-green-600">3</p>
          <p className="text-sm text-gray-600">Upcoming interviews</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-gray-900">Saved Jobs</h3>
          <p className="text-3xl font-bold text-purple-600">8</p>
          <p className="text-sm text-gray-600">Jobs to apply later</p>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Applications
          </h2>
          <Link
            href="/dashboard/applications"
            className="text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">
                Assistant Professor - Computer Science
              </h3>
              <p className="text-sm text-gray-600">University of Gondar</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                Under Review
              </span>
              <p className="text-sm text-gray-500 mt-1">Applied 2 days ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Research Fellow</h3>
              <p className="text-sm text-gray-600">University of Gondar</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 text-sm text-yellow-800 bg-yellow-100 rounded-full">
                Pending
              </span>
              <p className="text-sm text-gray-500 mt-1">Applied 5 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recommended Jobs
          </h2>
          <Link href="/jobs" className="text-blue-600 hover:text-blue-700">
            Browse All Jobs
          </Link>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">
              Lecturer - Software Engineering
            </h3>
            <p className="text-sm text-gray-600 mb-2">University of Gondar</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Full Time</span>
              <span>•</span>
              <span>Addis Ababa</span>
              <span>•</span>
              <span>Posted 3 days ago</span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Research Assistant</h3>
            <p className="text-sm text-gray-600 mb-2">University of Gondar</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Part Time</span>
              <span>•</span>
              <span>Remote</span>
              <span>•</span>
              <span>Posted 1 week ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
