import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { user_role } from "@prisma/client";

interface SessionUser {
  id: string;
  role: user_role;
  name?: string;
  email?: string;
}

export async function GET() {
  try {
    // Check authentication and HR role
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser | undefined;

    if (!session || user?.role !== "HR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get total applicants (users with role "applicant")
    const totalApplicants = await prisma.user.count({
      where: {
        role: "APPLICANT"
      }
    });

    // Get active jobs count
    const activeJobs = await prisma.job.count({
      where: {
        status: "ACTIVE"
      }
    });

    // Get pending applications
    const pendingApplications = await prisma.application.count({
      where: {
        status: "PENDING"
      }
    });

    // Get total active chats for this HR
    const totalChats = await prisma.chat.count({
      where: {
        status: "ACTIVE",
        hrId: user.id
      }
    });

    return NextResponse.json({
      totalApplicants,
      activeJobs,
      pendingApplications,
      totalChats
    });
  } catch (error) {
    console.error("Error fetching HR stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
