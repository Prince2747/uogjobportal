
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ApplicantNav } from "@/components/applicant/ApplicantNav";

export default async function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  if (session.user.role !== "APPLICANT") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ApplicantNav />
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
