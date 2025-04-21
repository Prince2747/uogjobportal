import Navbar from "../components/Navbar";
import JobFilters from "../components/jobs/JobFilters";
import JobSearch from "../components/jobs/JobSearch";
import JobListings from "../components/jobs/JobListings";

export const metadata = {
  title: "Jobs | University of Gondar",
  description: "Explore career opportunities at the University of Gondar",
};

export default function JobsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Search - Only visible on small screens */}
          <div className="block lg:hidden mb-6">
            <JobSearch />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters - Sticky on desktop */}
            <div className="hidden lg:block sticky top-20 h-fit">
              <JobFilters />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Desktop Search - Hidden on mobile */}
              <div className="hidden lg:block mb-6">
                <JobSearch />
              </div>

              {/* Job Listings */}
              <JobListings />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
