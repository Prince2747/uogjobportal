import React from "react";
import Navbar from "../components/Navbar";

const FAQ = () => {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 mt-16"> {/* Added mt-16 for gap from navbar */}
  <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
    <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">
      Frequently Asked Questions
    </h1>

    <div className="space-y-6">
      <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border">
        <div className="collapse-title font-semibold">Q: What is the University of Gondar Job Portal?</div>
        <div className="collapse-content text-sm">
          <p>A: It is an online platform connecting job seekers with opportunities provided by the University of Gondar.</p>
        </div>
      </div>

      <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border">
        <div className="collapse-title font-semibold">Q: How do I apply for a job?</div>
        <div className="collapse-content text-sm">
          <p>A: You can apply for a job by creating an account on the portal, browsing job listings, and submitting your application directly through the site.</p>
        </div>
      </div>

      <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border">
        <div className="collapse-title font-semibold">Q: Do I need to create an account to apply for jobs?</div>
        <div className="collapse-content text-sm">
          <p>A: Yes, creating an account allows you to manage your applications and track the status of your job applications.</p>
        </div>
      </div>

      <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border">
        <div className="collapse-title font-semibold">Q: How do I reset my password?</div>
        <div className="collapse-content text-sm">
          <p>A: If you've forgotten your password, you can reset it by clicking the "Forgot Password" link on the sign-in page and following the instructions.</p>
        </div>
      </div>

      <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border">
        <div className="collapse-title font-semibold">Q: Can I apply for multiple jobs at once?</div>
        <div className="collapse-content text-sm">
          <p>A: Yes, you can apply for as many jobs as you like. Just ensure your resume and cover letter are tailored to each specific job.</p>
        </div>
      </div>

      <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border">
        <div className="collapse-title font-semibold">Q: How do I create an account?</div>
        <div className="collapse-content text-sm">
          <p>A: Click the "Sign Up" button in the top right corner and follow the registration process.</p>
        </div>
      </div>
    </div>
  </div>
</div>
</>
  );
};

export default FAQ;
