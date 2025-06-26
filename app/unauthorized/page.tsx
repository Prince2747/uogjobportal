"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#3A95E8] mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-8">
          You do not have permission to access this page.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-[#3A95E8] text-white rounded-lg hover:bg-[#3A95E8]/90 transition-all duration-200"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
