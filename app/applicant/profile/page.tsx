import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { motion } from "framer-motion";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
    },
  });

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-900">
            Profile Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and profile information
          </p>
        </div>
      </motion.div>

      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Basic Information
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1 text-sm text-gray-900">{user?.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            {user?.profile && (
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Profile Details
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {user.profile.phone || "Not provided"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {user.profile.address || "Not provided"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Education
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {user.profile.education || "Not provided"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Experience
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {user.profile.experience || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents */}
            <div>
              <h2 className="text-lg font-medium text-gray-900">Documents</h2>
              <div className="mt-4">
                {user?.profile?.documents ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {user.profile.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">📄</span>
                          <span className="text-sm font-medium text-gray-900">
                            {doc}
                          </span>
                        </div>
                        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No documents uploaded yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-end"
      >
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Edit Profile
        </button>
      </motion.div>
    </div>
  );
}
