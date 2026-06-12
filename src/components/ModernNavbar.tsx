"use client";

import React from "react";
import Link from "next/link";

export default function ModernNavbar() {
  return (
    <header className="sticky top-0 z-50 h-[80px] w-full bg-brand-bg/95 backdrop-blur-md border-b border-brand-border select-none">
      <div className="mx-auto max-w-7xl h-full w-full">
        <div className="grid grid-cols-12 h-full w-full items-center">
          
          {/* Cols 1-3: Logo (Border-r on desktop) */}
          <div className="col-span-4 lg:col-span-3 h-full flex items-center border-r border-brand-border px-4 sm:px-6 lg:px-8">
            <Link href="/" className="font-sans text-xl font-black uppercase tracking-tighter text-brand-black">
              StudyCoach
            </Link>
          </div>

          {/* Cols 4-9: Status Indicators (Hidden on mobile) */}
          <div className="hidden lg:flex lg:col-span-6 h-full items-center px-8 border-r border-brand-border">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 bg-brand-blue" />
              <span className="font-mono text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">
                System Status: Active // V2.4_Stable
              </span>
            </div>
          </div>

          {/* Cols 10-12: Right-aligned links */}
          <div className="col-span-8 lg:col-span-3 h-full flex items-center justify-end px-4 sm:px-6 lg:px-8 gap-6 font-sans">
            <a
              href="#features"
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-gray hover:text-brand-blue transition-colors duration-150"
            >
              Features
            </a>
            <a
              href="#cycle"
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-gray hover:text-brand-blue transition-colors duration-150"
            >
              Method
            </a>
            <a
              href="#access"
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-gray hover:text-brand-blue transition-colors duration-150"
            >
              Join
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
