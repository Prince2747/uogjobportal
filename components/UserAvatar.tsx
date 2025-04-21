"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export function UserAvatar() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-indigo-100 rounded-full"
    >
      <span className="font-medium text-indigo-600">
        {getInitials(session.user.name || "")}
      </span>
    </motion.div>
  );
}

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export function UserAvatar() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-indigo-100 rounded-full"
    >
      <span className="font-medium text-indigo-600">
        {getInitials(session.user.name || "")}
      </span>
    </motion.div>
  );
}
