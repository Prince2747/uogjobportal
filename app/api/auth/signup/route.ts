import { NextResponse } from 'next/server'; 
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';
import { sendVerificationEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
    });

    // Generate verification token
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create verification token
    await prisma.verificationToken.create({
      data: {
        token,
        expires,
        userId: user.id,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, token);

    return NextResponse.json(
      {
        message: 'User created successfully. Please check your email to verify your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 