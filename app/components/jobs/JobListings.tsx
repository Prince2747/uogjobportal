"use client";

import { useState } from "react";
import Link from "next/link";

// Sample job data - in a real app, this would come from an API
const sampleJobs = [
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
      "The College of Engineering is seeking an Associate Professor in Computer Science...",
    requirements: [
      "Ph.D. in Computer Science or related field",
      "At least 5 years of teaching experience",
      "Strong research background with publications",
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
      "The Human Resources Department is looking for an Administrative Assistant...",
    requirements: [
      "Bachelor's degree in Business Administration or related field",
      "At least 2 years of administrative experience",
      "Proficiency in Microsoft Office applications",
    ],
  },
];

const JobListings = () => {
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const jobsPerPage = 5;

  // Simulate loading state
  const toggleJobDetails = (jobId: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setExpandedJob(expandedJob === jobId ? null : jobId);
      setIsLoading(false);
    }, 300);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Calculate pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = sampleJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(sampleJobs.length / jobsPerPage);

  if (sampleJobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
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
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No jobs found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {currentJobs.map((job) => (
        <div
          key={job.id}
          className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {job.title}
                </h3>
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    {job.department}
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Posted: {formatDate(job.postedDate)}
                  </div>
                </div>
              </div>
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
            </div>

            <p className="text-gray-600 mb-4">{job.description}</p>

            <div className="flex justify-between items-center">
              <button
                onClick={() => toggleJobDetails(job.id)}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                disabled={isLoading}
              >
                {isLoading && expandedJob === job.id ? (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg
                    className={`h-4 w-4 mr-1 transform transition-transform ${
                      expandedJob === job.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
                {expandedJob === job.id ? "Hide Details" : "View Details"}
              </button>
              <Link
                href={`/jobs/${job.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View Full Posting
              </Link>
            </div>

            {expandedJob === job.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  Requirements:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default JobListings;
