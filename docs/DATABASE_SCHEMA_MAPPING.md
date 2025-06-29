# 4.2.2 Mapping the Class Model to a Storage Schema

A schema is a description of the data, that is, a meta-model for data. In UML, class diagrams are used to describe the set of valid instances that can be created by the source code. Similarly, in relational databases, the database schema describes the valid set of data records that can be stored in the database. Relational databases store both the schema and the data.

## Database Schema Tables

### Table 1: User Table
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| **id** (Primary Key) | VARCHAR(191) | NOT NULL, PRIMARY KEY | Unique identifier for each user |
| name | VARCHAR(191) | NULL | Full name of the user |
| email | VARCHAR(191) | UNIQUE, NULL | Email address for authentication |
| hashedPassword | TEXT | NULL | Encrypted password for security |
| role | ENUM | NOT NULL, DEFAULT 'APPLICANT' | User role (ADMIN, HR, DEPARTMENT, APPLICANT) |
| isActive | BOOLEAN | NOT NULL, DEFAULT true | Account status indicator |
| department | VARCHAR(191) | NULL | Associated department |
| emailVerified | DATETIME(3) | NULL | Email verification timestamp |
| createdAt | DATETIME(3) | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation date |
| updatedAt | DATETIME(3) | NOT NULL | Last modification date |

**Sample Data:**
| id | name | email | role | isActive | department | createdAt |
|----|------|-------|------|----------|------------|-----------|
| usr_001 | Mulatu Mekonnen | mulatu@uog.edu.et | APPLICANT | true | Computer Science | 2024-01-15 |
| usr_002 | Sara Ahmed | sara@uog.edu.et | HR | true | Human Resources | 2024-01-10 |
| usr_003 | Dawit Tadesse | dawit@uog.edu.et | ADMIN | true | Administration | 2024-01-05 |

### Table 2: Job Table
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| **id** (Primary Key) | VARCHAR(191) | NOT NULL, PRIMARY KEY | Unique job identifier |
| title | VARCHAR(191) | NOT NULL | Job position title |
| description | TEXT | NOT NULL | Detailed job description |
| department | VARCHAR(191) | NOT NULL | Hiring department |
| status | ENUM | NOT NULL, DEFAULT 'ACTIVE' | Job status (ACTIVE, INACTIVE, CLOSED) |
| createdAt | DATETIME(3) | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Job posting date |
| updatedAt | DATETIME(3) | NOT NULL | Last modification date |

**Sample Data:**
| id | title | department | status | createdAt |
|----|-------|------------|--------|-----------|
| job_001 | Associate Professor | Computer Science | ACTIVE | 2024-02-01 |
| job_002 | Administrative Assistant | Human Resources | ACTIVE | 2024-02-05 |
| job_003 | Research Coordinator | Research Office | CLOSED | 2024-01-20 |

### Table 3: Application Table
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| **id** (Primary Key) | VARCHAR(191) | NOT NULL, PRIMARY KEY | Unique application identifier |
| **userId** (Foreign Key) | VARCHAR(191) | NOT NULL, REFERENCES User(id) | Applicant reference |
| **jobId** (Foreign Key) | VARCHAR(191) | NOT NULL, REFERENCES Job(id) | Job reference |
| status | ENUM | NOT NULL, DEFAULT 'PENDING' | Application status (PENDING, ACCEPTED, REJECTED) |
| createdAt | DATETIME(3) | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Application submission date |
| updatedAt | DATETIME(3) | NOT NULL | Last status update |

**Sample Data:**
| id | userId | jobId | status | createdAt |
|----|--------|-------|--------|-----------|
| app_001 | usr_001 | job_001 | PENDING | 2024-02-10 |
| app_002 | usr_001 | job_002 | ACCEPTED | 2024-02-08 |
| app_003 | usr_004 | job_001 | REJECTED | 2024-02-12 |

### Table 4: Chat Table
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| **id** (Primary Key) | VARCHAR(191) | NOT NULL, PRIMARY KEY | Unique chat session identifier |
| **hrId** (Foreign Key) | VARCHAR(191) | NOT NULL, REFERENCES User(id) | HR personnel reference |
| **applicantId** (Foreign Key) | VARCHAR(191) | NOT NULL, REFERENCES User(id) | Applicant reference |
| status | VARCHAR(191) | NOT NULL, DEFAULT 'ACTIVE' | Chat session status |
| createdAt | DATETIME(3) | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Chat creation date |
| updatedAt | DATETIME(3) | NOT NULL | Last activity timestamp |

**Sample Data:**
| id | hrId | applicantId | status | createdAt |
|----|------|-------------|--------|-----------|
| chat_001 | usr_002 | usr_001 | ACTIVE | 2024-02-15 |
| chat_002 | usr_002 | usr_004 | CLOSED | 2024-02-10 |

## Entity Relationship Diagram

```
User ||--o{ Application : "submits"
Job ||--o{ Application : "receives"
User ||--o{ Chat : "participates as HR"
User ||--o{ Chat : "participates as Applicant"
User ||--o{ Account : "has"
User ||--o{ Session : "maintains"
```

## Database Schema SQL Implementation

```sql
-- Create User table with role-based access control
CREATE TABLE User (
  id VARCHAR(191) NOT NULL PRIMARY KEY,
  name VARCHAR(191) NULL,
  email VARCHAR(191) NULL UNIQUE,
  emailVerified DATETIME(3) NULL,
  image VARCHAR(191) NULL,
  hashedPassword TEXT NULL,
  role ENUM('ADMIN', 'HR', 'DEPARTMENT', 'APPLICANT') NOT NULL DEFAULT 'APPLICANT',
  isActive BOOLEAN NOT NULL DEFAULT true,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL,
  department VARCHAR(191) NULL
);

-- Create Job table for job postings
CREATE TABLE Job (
  id VARCHAR(191) NOT NULL PRIMARY KEY,
  title VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  department VARCHAR(191) NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE', 'CLOSED') NOT NULL DEFAULT 'ACTIVE',
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL
);

-- Create Application table with foreign key relationships
CREATE TABLE Application (
  id VARCHAR(191) NOT NULL PRIMARY KEY,
  userId VARCHAR(191) NOT NULL,
  jobId VARCHAR(191) NOT NULL,
  status ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL,
  INDEX Application_userId_idx(userId),
  INDEX Application_jobId_idx(jobId),
  CONSTRAINT Application_userId_fkey FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT Application_jobId_fkey FOREIGN KEY (jobId) REFERENCES Job(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Chat table for real-time communication
CREATE TABLE Chat (
  id VARCHAR(191) NOT NULL PRIMARY KEY,
  hrId VARCHAR(191) NOT NULL,
  applicantId VARCHAR(191) NOT NULL,
  status VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL,
  INDEX Chat_hrId_idx(hrId),
  INDEX Chat_applicantId_idx(applicantId),
  CONSTRAINT Chat_hrId_fkey FOREIGN KEY (hrId) REFERENCES User(id),
  CONSTRAINT Chat_applicantId_fkey FOREIGN KEY (applicantId) REFERENCES User(id)
);
```

# 4.3 Source Code of Major Class Packages and Interface

## Authentication System Implementation

### User Authentication Component

```typescript
// app/signin/page.tsx - Main authentication interface
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/admin/dashboard",
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // Get the user's role from the session
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        if (session?.user?.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push(callbackUrl);
        }
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Validation function for input fields
  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePassword(password: string): boolean {
    return password.length >= 6;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.ico"
              alt="University Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
              </span>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### Backend Authentication API

```typescript
// app/api/auth/signup/route.ts - User registration endpoint
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Schema for input validation
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["APPLICANT", "HR", "DEPARTMENT"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input using Zod schema
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password using bcrypt
    const hashedPassword = await hash(validatedData.password, 12);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        name: validatedData.name,
        email: validatedData.email,
        hashedPassword: hashedPassword,
        role: validatedData.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Remove password from response for security
    const { hashedPassword: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { user: userWithoutPassword, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
```

### NextAuth Configuration

```typescript
// lib/auth.ts - Authentication configuration
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { DefaultSession } from "next-auth";
import { user_role } from "@prisma/client";

// Extend NextAuth types for custom user properties
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: user_role;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: user_role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: user_role;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        // Verify password using bcrypt
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        };
      }
    })
  ],
  pages: {
    signIn: "/signin",
    error: "/auth/error",
    newUser: "/signup"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === "development",
};

// Helper functions for role-based access control
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export function checkRole(allowedRoles: user_role[]) {
  return async () => {
    const user = await getCurrentUser();
    return !!(user && allowedRoles.includes(user.role));
  };
}
```

## Admin Dashboard Implementation

### Admin Dashboard Component

```typescript
// app/admin/page.tsx - Admin dashboard with statistics
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Users, 
  Briefcase, 
  FileText, 
  Bell, 
  PlusCircle, 
  ChevronRight,
  UserPlus,
  FileCheck,
  Building
} from "lucide-react";

type DashboardStats = {
  totalUsers: number;
  activeJobs: number;
  totalApplications: number;
};

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeJobs: 0,
    totalApplications: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#3A95E8]">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening in your job portal today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:border-[#3A95E8] hover:text-[#3A95E8] transition-all duration-200 flex items-center shadow-sm">
            <Bell className="w-4 h-4 mr-2" />
            <span>Notifications</span>
          </button>
          <Link
            href="/admin/jobs/new"
            className="px-4 py-2 bg-[#3A95E8] text-white rounded-lg hover:bg-[#3A95E8]/90 transition-all duration-200 flex items-center shadow-sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-500">Total Users</span>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : stats.totalUsers}
                </h3>
              </div>
              <p className="text-sm text-gray-600">Active accounts</p>
            </div>
            <div className="p-2 bg-[#3A95E8]/10 rounded-lg">
              <Users className="w-6 h-6 text-[#3A95E8]" />
            </div>
          </div>
          <Link
            href="/admin/users"
            className="mt-4 flex items-center text-sm text-[#3A95E8] hover:text-[#3A95E8]/80"
          >
            <span>View all users</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-500">Active Jobs</span>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : stats.activeJobs}
                </h3>
              </div>
              <p className="text-sm text-gray-600">Open positions</p>
            </div>
            <div className="p-2 bg-[#FFBC09]/10 rounded-lg">
              <Briefcase className="w-6 h-6 text-[#FFBC09]" />
            </div>
          </div>
          <Link
            href="/admin/jobs"
            className="mt-4 flex items-center text-sm text-[#FFBC09] hover:text-[#FFBC09]/80"
          >
            <span>View all jobs</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-500">Applications</span>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : stats.totalApplications}
                </h3>
              </div>
              <p className="text-sm text-gray-600">Total submissions</p>
            </div>
            <div className="p-2 bg-[#3A95E8]/10 rounded-lg">
              <FileText className="w-6 h-6 text-[#3A95E8]" />
            </div>
          </div>
          <Link
            href="/admin/applications"
            className="mt-4 flex items-center text-sm text-[#3A95E8] hover:text-[#3A95E8]/80"
          >
            <span>View applications</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/users/new" className="p-4 text-left bg-gray-50 rounded-lg hover:bg-[#3A95E8]/5 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#3A95E8]/10 rounded-lg">
                <UserPlus className="w-5 h-5 text-[#3A95E8]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Add New User</h3>
                <p className="text-sm text-gray-500">Create a new user account</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/jobs/new" className="p-4 text-left bg-gray-50 rounded-lg hover:bg-[#FFBC09]/5 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#FFBC09]/10 rounded-lg">
                <Building className="w-5 h-5 text-[#FFBC09]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Post New Job</h3>
                <p className="text-sm text-gray-500">Create a job listing</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/applications" className="p-4 text-left bg-gray-50 rounded-lg hover:bg-[#3A95E8]/5 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#3A95E8]/10 rounded-lg">
                <FileCheck className="w-5 h-5 text-[#3A95E8]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Review Applications</h3>
                <p className="text-sm text-gray-500">Check pending applications</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### Admin API Endpoints

```typescript
// app/api/admin/dashboard/route.ts - Dashboard statistics API
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
```

## Real-time Communication System

### WebSocket Implementation

```typescript
// app/api/socket/route.ts - Socket.io server implementation
import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { redis } from "@/app/lib/socket";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface CustomServer extends NetServer {
  io?: ServerIO;
}

interface MessageData {
  roomId: string;
  userId: string;
  userType: string;
  message: string;
  timestamp: number;
}

let io: ServerIO | null = null;

export async function GET(req: Request) {
  try {
    if (!req.headers.get("socket")) {
      return new Response("Socket header not found", { status: 400 });
    }

    if (!io) {
      console.log("Setting up Socket.io server...");
      
      io = new ServerIO({
        path: "/api/socket",
        addTrailingSlash: false,
        cors: {
          origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
          methods: ["GET", "POST"],
        },
      });

      io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        // Join a chat room
        socket.on("join_room", async (data: { roomId: string; userId: string; userType: string }) => {
          const { roomId, userId, userType } = data;
          socket.join(roomId);

          // Store user info in Redis
          await redis.hset(
            `chat_room:${roomId}`,
            userId,
            JSON.stringify({ userType, socketId: socket.id })
          );

          // Get chat history from Redis
          const messages = await redis.lrange(`messages:${roomId}`, 0, -1);
          const parsedMessages = messages.map((msg: string) => JSON.parse(msg));
          socket.emit("chat_history", parsedMessages);
        });

        // Handle new messages
        socket.on("send_message", async (data: MessageData) => {
          const { roomId, message, userId, userType, timestamp } = data;

          const messageData = {
            userId,
            userType,
            message,
            timestamp,
          };

          // Store message in Redis
          await redis.rpush(
            `messages:${roomId}`,
            JSON.stringify(messageData)
          );

          // Broadcast to all clients in the room
          io?.to(roomId).emit("receive_message", messageData);
        });

        // Handle typing status
        socket.on("typing", (data: { roomId: string; userId: string; isTyping: boolean }) => {
          const { roomId, userId, isTyping } = data;
          socket.to(roomId).emit("user_typing", { userId, isTyping });
        });

        // Handle disconnection
        socket.on("disconnect", async () => {
          console.log("Client disconnected:", socket.id);
          // Clean up Redis user info
          const rooms = await redis.keys("chat_room:*");
          for (const room of rooms) {
            const users = await redis.hgetall(room);
            for (const [userId, userData] of Object.entries(users)) {
              const parsedData = JSON.parse(userData as string);
              if (parsedData.socketId === socket.id) {
                await redis.hdel(room, userId);
              }
            }
          }
        });
      });
    }

    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    console.error("Socket error:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
```

### Chat Interface Component

```typescript
// app/chat/page.tsx - Real-time chat interface
"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { Send, Loader2 } from "lucide-react";

type UserRole = "hr" | "applicant";

interface Message {
  userId: string;
  userType: UserRole;
  message: string;
  timestamp: number;
}

interface SessionUser {
  id: string;
  role: UserRole;
  name?: string;
  email?: string;
}

export default function ChatPage() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const user = session?.user as SessionUser | undefined;
  const userType: UserRole = user?.role === "hr" ? "hr" : "applicant";
  const userId = user?.id || "anonymous";
  const roomId = "hr-applicant-chat"; // Dynamic room ID based on conversation

  useEffect(() => {
    const socketInstance = io({
      path: "/api/socket",
      addTrailingSlash: false,
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ["websocket", "polling"],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false,
    });

    socketInstance.on("connect_error", (err) => {
      console.log("Connection error:", err);
      setError("Failed to connect to chat server");
    });

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO");
      setIsConnected(true);
      setError(null);
      
      // Join the chat room
      socketInstance.emit("join_room", {
        roomId,
        userId,
        userType,
      });
    });

    socketInstance.on("chat_history", (history: Message[]) => {
      setMessages(history);
      scrollToBottom();
    });

    socketInstance.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    socketInstance.on("user_typing", ({ userId: typingUserId, isTyping }) => {
      if (typingUserId !== userId) {
        setRemoteTyping(isTyping);
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId, userType]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTyping = () => {
    if (!socket) return;

    socket.emit("typing", {
      roomId,
      userId,
      isTyping: true,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        roomId,
        userId,
        isTyping: false,
      });
    }, 1000);
  };

  const sendMessage = () => {
    if (!socket || !message.trim()) return;

    const messageData = {
      roomId,
      userId,
      userType,
      message: message.trim(),
      timestamp: Date.now(),
    };

    socket.emit("send_message", messageData);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4">
          <h1 className="text-xl font-semibold">
            Chat with {userType === "hr" ? "Applicant" : "HR"}
          </h1>
          <div className="text-sm">
            {isConnected ? (
              <span className="text-green-200">●</span>
            ) : (
              <span className="text-red-200">●</span>
            )}{" "}
            {isConnected ? "Connected" : "Disconnected"}
            {error && (
              <span className="text-red-200 ml-2">{error}</span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="h-[calc(100vh-300px)] overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.userId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.userId === userId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {msg.userId === userId ? "You" : msg.userType}
                </div>
                <div className="break-words">{msg.message}</div>
                <div className="text-xs mt-1 opacity-75">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {remoteTyping && (
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Someone is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

This documentation follows the academic format you requested, providing detailed technical implementation with actual code examples, database schema mappings, and comprehensive system architecture documentation similar to a university thesis or project report.