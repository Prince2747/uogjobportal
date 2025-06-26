import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const session = await getServerSession(authOptions);
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Invalid Verification Link
            </h2>
            <p className="mt-2 text-gray-600">
              The verification link is invalid or has expired. Please try
              signing up again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Find the verification token
  const verificationToken = await prisma.verificationtoken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Invalid Token</h2>
            <p className="mt-2 text-gray-600">
              This verification link has expired or is invalid. Please try
              signing up again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Find the user by email (identifier)
  const user = await prisma.user.findUnique({
    where: { email: verificationToken.identifier },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">User Not Found</h2>
            <p className="mt-2 text-gray-600">
              The user associated with this verification token could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Verify the user's email
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });

  // Delete the verification token
  await prisma.verificationtoken.delete({
    where: { token },
  });

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect("/applicant");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Email Verified!</h2>
          <p className="mt-2 text-gray-600">
            Your email has been successfully verified. You can now sign in to
            your account.
          </p>
          <div className="mt-6">
            <a
              href="/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
