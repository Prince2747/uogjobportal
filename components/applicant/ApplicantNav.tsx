"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { UserAvatar } from "../UserAvatar";

const navigation = [
  { name: "Dashboard", href: "/applicant", icon: "🏠" },
  { name: "Applications", href: "/applicant/applications", icon: "📝" },
  { name: "Profile", href: "/applicant/profile", icon: "👤" },
];

export function ApplicantNav() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link
              href="/applicant"
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors"
            >
              <span className="text-2xl">🎓</span>
              <span>UoG Job Portal</span>
            </Link>
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-indigo-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                  {pathname === item.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <span className="mr-2">🚪</span>
              Sign out
            </motion.button>
            <div className="ml-4">
              <UserAvatar />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { UserAvatar } from "../UserAvatar";

const navigation = [
  { name: "Dashboard", href: "/applicant", icon: "🏠" },
  { name: "Applications", href: "/applicant/applications", icon: "📝" },
  { name: "Profile", href: "/applicant/profile", icon: "👤" },
];

export function ApplicantNav() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link
              href="/applicant"
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors"
            >
              <span className="text-2xl">🎓</span>
              <span>UoG Job Portal</span>
            </Link>
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-indigo-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                  {pathname === item.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <span className="mr-2">🚪</span>
              Sign out
            </motion.button>
            <div className="ml-4">
              <UserAvatar />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
