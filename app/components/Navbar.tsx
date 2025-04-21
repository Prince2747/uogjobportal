"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import logo from "@/public/logo.ico";
import clos from "@/public/close.svg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div>
      <div
        className={`fixed top-0 left-0 w-full bg-base-100 z-50 transition-shadow ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="navbar container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center text-xl font-semibold">
            <Image
              src={logo}
              alt="Gondar University logo"
              width={50}
              height={50}
            />
            <span className="ml-2">University of Gondar Job Portal</span>
          </Link>

          <div className="lg:hidden">
            <button
              className="btn btn-ghost text-xl"
              onClick={toggleMobileMenu}
            >
              ☰
            </button>
          </div>

          <div className="hidden lg:flex space-x-6">
            <Link href="/jobs" className="text-xl hover:text-blue-500">
              Jobs
            </Link>
            <Link href="/faq" className="text-xl hover:text-blue-500">
              FAQ
            </Link>
            <Link
              href="/signin"
              className="text-xl bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-sky-800"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg">
            <div className="flex justify-end p-4">
              <button className="btn btn-ghost" onClick={toggleMobileMenu}>
                <Image src={clos} alt="Close" width={24} height={24} />
          </button>
        </div>
            <div className="px-4 space-y-4">
              <Link
                href="/jobs"
                className="block text-xl hover:text-blue-500"
                onClick={toggleMobileMenu}
              >
              Jobs
            </Link>
              <Link
                href="/faq"
                className="block text-xl hover:text-blue-500"
                onClick={toggleMobileMenu}
              >
             FAQ
            </Link>
              <Link
                href="/signin"
                className="block text-xl bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-sky-800"
                onClick={toggleMobileMenu}
              >
                Sign in
            </Link>
            </div>
          </div>
      </div>
      )}
    </div>
  );
};

export default Navbar;

         