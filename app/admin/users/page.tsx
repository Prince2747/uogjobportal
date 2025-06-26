"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Define UserRole enum since it's not exported from @prisma/client
enum UserRole {
  ADMIN = "ADMIN",
  HR = "HR",
  DEPARTMENT = "DEPARTMENT",
  APPLICANT = "APPLICANT"
}

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
};

type UsersResponse = {
  users: User[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
};

export default function UserManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  // Authentication temporarily disabled for development
  /*
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (session?.user?.role !== UserRole.ADMIN) {
      router.push("/unauthorized");
    }
  }, [session, status, router]);
  */

  // Fetch users with current filters
  const fetchUsers = async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        search: searchTerm,
        page: currentPage.toString(),
        limit: "10",
        ...(selectedRole && { role: selectedRole }),
        ...(selectedStatus && { status: selectedStatus }),
      });

      const response = await fetch(`/api/admin/users?${queryParams}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to fetch users");
      }

      const data: UsersResponse = await response.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotalUsers(data.totalUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading users. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page
    fetchUsers(search);
  };

  // Handle filter changes
  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page
    fetchUsers(search);
  };

  // Fetch users when page changes
  useEffect(() => {
    fetchUsers(search);
  }, [currentPage]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role: newRole,
          isActive: user.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      const updatedUser = await response.json();
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
    } catch (err) {
      setError("Error updating user role. Please try again.");
      console.error(err);
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role: user.role,
          isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      const updatedUser = await response.json();
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
    } catch (err) {
      setError("Error updating user status. Please try again.");
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      setError("Error deleting user. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#3A95E8]">User Management</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:border-[#3A95E8] hover:text-[#3A95E8] transition-all duration-200 flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            <span>Filters</span>
          </button>
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="w-64 px-3 py-2 pr-10 bg-white rounded-l-lg border border-r-0 border-gray-200 focus:outline-none focus:border-[#3A95E8]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 top-0 h-full px-3 flex items-center text-gray-400 hover:text-[#3A95E8]"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#3A95E8] text-white rounded-r-lg hover:bg-[#3A95E8]/90 transition-all duration-200"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {isFiltersVisible && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                handleFilterChange();
              }}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#3A95E8]"
            >
              <option value="">All Roles</option>
              {Object.values(UserRole).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                handleFilterChange();
              }}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#3A95E8]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedRole("");
                setSelectedStatus("");
                handleFilterChange();
              }}
              className="px-4 py-2 text-gray-600 hover:text-[#3A95E8]"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Role</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#3A95E8]"></div>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    {search || selectedRole || selectedStatus
                      ? "No users found matching your criteria."
                      : "No users available."}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4">{user.name || "N/A"}</td>
                    <td className="p-4">{user.email || "N/A"}</td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value as UserRole)
                        }
                        className="bg-white border border-gray-200 rounded px-2 py-1 text-sm"
                      >
                        {Object.values(UserRole).map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleStatusChange(user.id, !user.isActive)}
                        className={`px-2 py-1 rounded text-sm ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleStatusChange(user.id, !user.isActive)}
                        className="text-sm text-[#3A95E8] hover:text-[#3A95E8]/80"
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-sm text-red-600 hover:text-red-600/80 ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && users.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Showing {users.length} of {totalUsers} users
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
