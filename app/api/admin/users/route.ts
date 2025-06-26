import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { user_role, Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";

// Define types for request and response
type UpdateUserRequest = {
  userId: string;
  role: user_role;
  isActive: boolean;
};

type UserResponse = {
  id: string;
  name: string | null;
  email: string | null;
  role: user_role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function GET(request: Request) {
  try {
    // Authentication temporarily disabled for development
    /*
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session?.user) {
      console.log("No session or user found");
      return new NextResponse("Unauthorized - No session", { status: 401 });
    }

    if (session.user.role !== user_role.ADMIN) {
      console.log("User is not admin:", session.user.role);
      return new NextResponse("Unauthorized - Not admin", { status: 401 });
    }
    */

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const role = searchParams.get("role") as user_role | null;
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    console.log("Search params:", { search, page, limit, role, status });

    // Create the where clause for search and filters
    const whereClause: Prisma.UserWhereInput = {
      AND: [
        // Search condition
        search ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        } : {},
        // Role filter
        role ? { role } : {},
        // Status filter
        status ? { isActive: status === 'active' } : {},
      ],
    };

    console.log("Where clause:", JSON.stringify(whereClause, null, 2));

    // Get total count for pagination
    const totalUsers = await prisma.user.count({
      where: whereClause,
    });

    console.log("Total users found:", totalUsers);

    // Get users with search and pagination
    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log("Users found:", users.length);

    return NextResponse.json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      totalUsers,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/users:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // Get session and check authentication
    const session = await getServerSession(authOptions);
    console.log("Session:", session); // Debug log

    if (!session?.user) {
      console.log("No session or user found"); // Debug log
      return new NextResponse("Unauthorized - No session", { status: 401 });
    }

    if (session.user.role !== user_role.ADMIN) {
      console.log("User is not admin:", session.user.role); // Debug log
      return new NextResponse("Unauthorized - Not admin", { status: 401 });
    }

    // Parse request body
    const data: UpdateUserRequest = await request.json();
    const { userId, role, isActive } = data;

    console.log("Update user data:", { userId, role, isActive }); // Debug log

    if (!userId || !role) {
      console.log("Missing required fields"); // Debug log
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role, isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log("Updated user:", updatedUser); // Debug log

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error in PATCH /api/admin/users:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Get session and check authentication
    const session = await getServerSession(authOptions);
    console.log("Session:", session); // Debug log

    if (!session?.user) {
      console.log("No session or user found"); // Debug log
      return new NextResponse("Unauthorized - No session", { status: 401 });
    }

    if (session.user.role !== user_role.ADMIN) {
      console.log("User is not admin:", session.user.role); // Debug log
      return new NextResponse("Unauthorized - Not admin", { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    console.log("Delete user ID:", userId); // Debug log

    if (!userId) {
      console.log("User ID is required"); // Debug log
      return new NextResponse("User ID is required", { status: 400 });
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    console.log("User deleted successfully"); // Debug log

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/admin/users:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}