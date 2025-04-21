import Link from "next/link";

// Sample job data - in a real app, this would come from an API or database
const getJobById = (id: string) => {
  const jobs = [
    {
      id: 1,
      title: "Associate Professor of Computer Science",
      department: "College of Engineering",
      location: "Gondar, Ethiopia",
      type: "Academic",
      employmentType: "Full-time",
      postedDate: "2023-06-15",
      deadline: "2023-07-15",
      description:
        "The College of Engineering is seeking an Associate Professor in Computer Science to join our faculty. The successful candidate will be responsible for teaching undergraduate and graduate courses, conducting research, and contributing to the department's academic programs.",
      requirements: [
        "Ph.D. in Computer Science or related field",
        "At least 5 years of teaching experience",
        "Strong research background with publications",
        "Experience in curriculum development",
      ],
      responsibilities: [
        "Teach undergraduate and graduate courses in Computer Science",
        "Develop and update course materials",
        "Conduct research and publish findings in peer-reviewed journals",
        "Supervise student research projects",
        "Participate in department and university committees",
        "Mentor junior faculty members",
      ],
      benefits: [
        "Competitive salary based on qualifications and experience",
        "Health insurance coverage",
        "Housing allowance",
        "Research funding opportunities",
        "Professional development support",
        "Access to university facilities and resources",
      ],
      applicationProcess: [
        "Submit a cover letter detailing your interest and qualifications",
        "Provide a comprehensive CV",
        "Include a statement of teaching philosophy",
        "Submit a research proposal",
        "Provide contact information for three professional references",
      ],
    },
    {
      id: 2,
      title: "Administrative Assistant",
      department: "Human Resources",
      location: "Gondar, Ethiopia",
      type: "Administrative",
      employmentType: "Full-time",
      postedDate: "2023-06-10",
      deadline: "2023-07-10",
      description:
        "The Human Resources Department is looking for an Administrative Assistant to support daily operations. The ideal candidate will assist with recruitment processes, maintain employee records, and help with administrative tasks.",
      requirements: [
        "Bachelor's degree in Business Administration or related field",
        "At least 2 years of administrative experience",
        "Proficiency in Microsoft Office applications",
        "Strong organizational and communication skills",
      ],
      responsibilities: [
        "Assist with recruitment and onboarding processes",
        "Maintain employee records and documentation",
        "Schedule interviews and meetings",
        "Prepare reports and presentations",
        "Handle correspondence and communications",
        "Support HR staff with administrative tasks",
      ],
      benefits: [
        "Competitive salary",
        "Health insurance coverage",
        "Paid time off",
        "Professional development opportunities",
        "Work-life balance",
      ],
      applicationProcess: [
        "Submit a cover letter and CV",
        "Complete the online application form",
        "Provide contact information for two references",
      ],
    },
    // Add more jobs as needed
  ];

  return jobs.find((job) => job.id === parseInt(id)) || null;
};

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = getJobById(params.id);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Job Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The job listing you're looking for doesn't exist or has been
            removed.
          </p>
          <Link
            href="/jobs"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Return to Job Listings
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/jobs"
            className="inline-flex items-center text-blue-100 hover:text-white mb-4"
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Job Listings
          </Link>
          <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
          <p className="text-xl text-blue-100">{job.department}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Job Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-1 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {job.location}
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-1 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {job.employmentType}
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-1 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                {job.type}
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-1 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Posted: {formatDate(job.postedDate)}
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-1 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14v7"
                  />
                </svg>
                Deadline: {formatDate(job.deadline)}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.type === "Academic"
                    ? "bg-blue-100 text-blue-800"
                    : job.type === "Administrative"
                      ? "bg-green-100 text-green-800"
                      : job.type === "Research"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {job.type}
              </span>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                Apply Now
              </button>
            </div>
          </div>

          {/* Job Content */}
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Job Description</h2>
              <p className="text-gray-700">{job.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {job.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Benefits</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {job.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">
                Application Process
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {job.applicationProcess.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-semibold text-blue-800 mb-2">How to Apply</h3>
              <p className="text-gray-700 mb-4">
                To apply for this position, please submit your application
                through our online portal by the deadline of{" "}
                {formatDate(job.deadline)}.
              </p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
