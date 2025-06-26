import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Calendar, Clock, FileText, User } from "lucide-react";

export default async function ApplicantDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  if (session.user.role !== "APPLICANT") {
    redirect("/");
  }

  try {
    // Fetch recent applications
    const applications = await prisma.application.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        job: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // Fetch total applications
    const totalApplications = await prisma.application.count({
      where: {
        userId: session.user.id,
      },
    });

    // Fetch pending applications
    const pendingApplications = await prisma.application.count({
      where: {
        userId: session.user.id,
        status: "PENDING",
      },
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">{session.user.name}</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Applications Card */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                Total Applications
              </h3>
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-gray-500">All your job applications</p>
            </div>
          </div>

          {/* Pending Applications Card */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                Pending Applications
              </h3>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{pendingApplications}</div>
              <p className="text-xs text-gray-500">Applications under review</p>
            </div>
          </div>
        </div>

        {/* Recent Applications Section */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-lg font-semibold">Recent Applications</h2>
          </div>
          <div className="p-6">
            {applications.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No applications yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium">{application.job.title}</h3>
                      <p className="text-sm text-gray-500">
                        {application.job.department}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1 h-4 w-4" />
                        Applied on{" "}
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        application.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : application.status === "ACCEPTED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching applications:", error);
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-red-600">Error</h2>
          <p className="mt-2 text-red-500">
            Error loading applications. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
