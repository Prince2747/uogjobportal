import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { user_role } from "@prisma/client";
import type { user_role as UserRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      httpOptions: {
        timeout: 10000, // 10 seconds timeout
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Create new user with Google profile data
          await prisma.user.create({
            data: {
              id: crypto.randomUUID(),
              email: user.email!,
              name: user.name || "",
              image: user.image,
              role: user_role.APPLICANT,
              isActive: true,
              emailVerified: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Handle sign-in redirects
      if (url.includes('/signin')) {
        const session = await getServerSession(authOptions);
        if (session?.user?.role) {
          switch (session.user.role) {
            case user_role.ADMIN:
              return `${baseUrl}/admin`;
            case user_role.HR:
              return `${baseUrl}/hr`;
            case user_role.DEPARTMENT:
              return `${baseUrl}/department`;
            case user_role.APPLICANT:
              return `${baseUrl}/applicant`;
            default:
              return baseUrl;
          }
        }
      }
      // Handle relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Handle same origin URLs
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  events: {
    async signOut({ session, token }) {
      // Clear session-related data
      if (token) {
        await prisma.session.deleteMany({
          where: { userId: token.id as string },
        });
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true // Enable debug mode
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user as { id: string; email: string; name: string; role: UserRole; } | null;
}

export async function checkRole(allowedRoles: user_role[]) {
  const user = await getCurrentUser();
  return user && allowedRoles.includes(user.role);
}

export async function isAdmin() {
  return checkRole([user_role.ADMIN]);
}

export async function isHR() {
  return checkRole([user_role.HR]);
}

export async function isDepartment() {
  return checkRole([user_role.DEPARTMENT]);
}

export async function isApplicant() {
  return checkRole([user_role.APPLICANT]);
}

export async function hasAccess(requiredRole: user_role) {
  const user = await getCurrentUser();
  if (!user) return false;

  // Admin has access to everything
  if (user.role === user_role.ADMIN) return true;

  // HR has access to HR and APPLICANT routes
  if (user.role === user_role.HR && 
    (requiredRole === user_role.HR || requiredRole === user_role.APPLICANT)) {
    return true;
  }

  // Department has access to DEPARTMENT routes
  if (user.role === user_role.DEPARTMENT && requiredRole === user_role.DEPARTMENT) {
    return true;
  }

  // APPLICANT has access to APPLICANT routes
  if (user.role === user_role.APPLICANT && requiredRole === user_role.APPLICANT) {
    return true;
  }

  return false;
}