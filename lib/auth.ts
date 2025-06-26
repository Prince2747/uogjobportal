import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { DefaultSession } from "next-auth";
import { RateLimiter } from 'limiter';
import { user_role } from "@prisma/client";

// Initialize rate limiter with memory-efficient settings
const limiter = new RateLimiter({
  tokensPerInterval: 5,
  interval: 15 * 60 * 1000, // 15 minutes
  fireImmediately: true
});

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

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid credentials');
        }

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

export function isAdmin() {
  return checkRole([user_role.ADMIN]);
}

export function isHR() {
  return checkRole([user_role.HR]);
}

export function isDepartment() {
  return checkRole([user_role.DEPARTMENT]);
}

export function isApplicant() {
  return checkRole([user_role.APPLICANT]);
}

export function hasAccess(requiredRole: user_role) {
  return checkRole([requiredRole]);
}