"use client";

import { useState } from "react";

const JobFilters = () => {
  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    department: true,
    employmentType: true,
    experienceLevel: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      {/* Job Type Filter */}
      <div className="mb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium"
          onClick={() => toggleSection("jobType")}
        >
          <span>Job Type</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              expandedSections.jobType ? "rotate-180" : ""
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
        </button>
        {expandedSections.jobType && (
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Academic
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Administrative
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Research
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Technical
            </label>
          </div>
        )}
      </div>

      {/* Department Filter */}
      <div className="mb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium"
          onClick={() => toggleSection("department")}
        >
          <span>Department</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              expandedSections.department ? "rotate-180" : ""
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
        </button>
        {expandedSections.department && (
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              College of Engineering
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              College of Medicine
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              College of Business
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              College of Social Sciences
            </label>
          </div>
        )}
      </div>

      {/* Employment Type Filter */}
      <div className="mb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium"
          onClick={() => toggleSection("employmentType")}
        >
          <span>Employment Type</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              expandedSections.employmentType ? "rotate-180" : ""
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
        </button>
        {expandedSections.employmentType && (
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Full-time
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Part-time
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Contract
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Temporary
            </label>
          </div>
        )}
      </div>

      {/* Experience Level Filter */}
      <div className="mb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium"
          onClick={() => toggleSection("experienceLevel")}
        >
          <span>Experience Level</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              expandedSections.experienceLevel ? "rotate-180" : ""
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
        </button>
        {expandedSections.experienceLevel && (
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Entry Level
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Mid Level
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Senior Level
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Expert Level
            </label>
          </div>
        )}
      </div>

      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
        Apply Filters
      </button>
    </div>
  );
};

export default JobFilters;

import { useState } from "react";

const JobFilters = () => {
  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    department: true,
    employmentType: true,
    experienceLevel: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      {/* Job Type Filter */}
      <div className="mb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium"
          onClick={() => toggleSection("jobType")}
        >
          <span>Job Type</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              expandedSections.jobType ? "rotate-180" : ""
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
        </button>
        {expandedSections.jobType && (
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Academic
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Administrative
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Research
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Technical
            </label>
          </div>
        )}
      </div>

      {/* Department Filter */}
      <div className="mb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium"
          onClick={() => toggleSection("department")}
        >
          <span>Department</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              expandedSections.department ? "rotate-180" : ""
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
        </button>
        {expandedSections.department && (
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              College of Engineering
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              College of Medicine
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              College of Business
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              College of Social Sciences
            </label>
          </div>
        )}
      </div>

      {/* Employment Type Filter */}
      <div className="mb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium"
          onClick={() => toggleSection("employmentType")}
        >
          <span>Employment Type</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              expandedSections.employmentType ? "rotate-180" : ""
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
        </button>
        {expandedSections.employmentType && (
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Full-time
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Part-time
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Contract
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Temporary
            </label>
          </div>
        )}
      </div>

      {/* Experience Level Filter */}
      <div className="mb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium"
          onClick={() => toggleSection("experienceLevel")}
        >
          <span>Experience Level</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              expandedSections.experienceLevel ? "rotate-180" : ""
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
        </button>
        {expandedSections.experienceLevel && (
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Entry Level
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Mid Level
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Senior Level
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Expert Level
            </label>
          </div>
        )}
      </div>

      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
        Apply Filters
      </button>
    </div>
  );
};

export default JobFilters;

 