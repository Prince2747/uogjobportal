import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { job_status } from "@prisma/client";

export async function GET() {
  try {
    // Get total users count
    const totalUsers = await prisma.user.count();

    // Get active jobs count
    const activeJobs = await prisma.job.count({
      where: {
        status: job_status.ACTIVE,
      },
    });

    // Get total applications count
    const totalApplications = await prisma.application.count();

    return NextResponse.json({
      totalUsers,
      activeJobs,
      totalApplications,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
