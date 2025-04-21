import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { user_role } from "@prisma/client";

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

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user || session.user.role !== user_role.ADMIN) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user || session.user.role !== user_role.ADMIN) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json() as UpdateUserRequest;
    const { userId, role, isActive } = body;

    if (!userId || !role) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
        isActive,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user || session.user.role !== user_role.ADMIN) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 