import { NextResponse } from 'next/server'; 
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { user_role } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const { name, email, password, department } = await req.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        department,
        role: user_role.APPLICANT,
        isActive: true,
        emailVerified: new Date(),
      },
    });

    // Remove sensitive data from response
    const { hashedPassword: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "User created successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}