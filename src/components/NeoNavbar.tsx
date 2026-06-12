"use client";

import React from "react";
import Link from "next/link";

export default function NeoNavbar() {
  return (
    <header className="sticky top-0 z-50 h-20 w-full bg-brand-yellow border-b-2 border-brand-black flex items-center select-none">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center bg-brand-black border-2 border-brand-black rounded-md transition-transform duration-200 group-hover:-rotate-3">
                {/* Bolt Icon in Yellow */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6 text-brand-yellow"
                >
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-heading text-2xl font-extrabold tracking-tighter text-brand-black">
                StudyCoach
              </span>
            </Link>
          </div>

          {/* Center: Satoshi Bold Links */}
          <nav className="hidden md:flex items-center gap-8 font-sans font-bold text-brand-black">
            <a
              href="#features"
              className="text-base hover:underline underline-offset-4 decoration-2 transition-all"
            >
              Features
            </a>
            <a
              href="#cycle"
              className="text-base hover:underline underline-offset-4 decoration-2 transition-all"
            >
              Method
            </a>
            <a
              href="#counsels"
              className="text-base hover:underline underline-offset-4 decoration-2 transition-all"
            >
              Counsels
            </a>
            <a
              href="#access"
              className="text-base hover:underline underline-offset-4 decoration-2 transition-all"
            >
              Join
            </a>
          </nav>

          {/* Right: Start Free Trial Button */}
          <div className="flex items-center">
            <button className="relative bg-brand-black text-brand-white px-5 py-2.5 border-2 border-brand-black rounded-lg font-sans font-bold text-sm shadow-neo-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 cursor-pointer">
              Start Free Trial
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
