import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: UserRole;
    department?: string;
  }

  interface Session {
    user: User & {
      role: UserRole;
      department?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    department?: string;
  }
} 
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: UserRole;
    department?: string;
  }

  interface Session {
    user: User & {
      role: UserRole;
      department?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    department?: string;
  }
} 