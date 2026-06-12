"use client";

import React from "react";
import Link from "next/link";

export default function ModernFooter() {
  return (
    <footer className="w-full bg-brand-bg select-none border-t border-brand-border">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* Cols 1-3: Logo & Copyright */}
          <div className="col-span-12 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-brand-border p-6 sm:p-8 flex flex-col justify-between items-start gap-4">
            <span className="font-sans text-lg font-black uppercase tracking-tighter text-brand-black">
              StudyCoach
            </span>
            <span className="font-mono text-[10px] font-bold text-brand-muted uppercase tracking-widest">
              &copy; 2026 // STUDYCOACH INC.
            </span>
          </div>

          {/* Cols 4-6: Product Links */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 border-b md:border-b-0 md:border-r border-brand-border p-6 sm:p-8 text-left">
            <h4 className="font-sans text-xs font-bold text-brand-muted uppercase tracking-[0.2em] mb-4">
              System Mappings
            </h4>
            <ul className="space-y-2 font-sans text-sm font-semibold uppercase tracking-wider">
              <li>
                <a href="#features" className="text-brand-gray hover:text-brand-blue transition-colors duration-150">
                  Features
                </a>
              </li>
              <li>
                <a href="#cycle" className="text-brand-gray hover:text-brand-blue transition-colors duration-150">
                  Method
                </a>
              </li>
              <li>
                <a href="#access" className="text-brand-gray hover:text-brand-blue transition-colors duration-150">
                  Join
                </a>
              </li>
            </ul>
          </div>

          {/* Cols 7-9: Resources */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 border-b md:border-b-0 md:border-r border-brand-border p-6 sm:p-8 text-left">
            <h4 className="font-sans text-xs font-bold text-brand-muted uppercase tracking-[0.2em] mb-4">
              Resources // DB
            </h4>
            <ul className="space-y-2 font-sans text-sm font-semibold uppercase tracking-wider">
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-brand-gray hover:text-brand-blue transition-colors duration-150">
                  Syllabus Database
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-brand-gray hover:text-brand-blue transition-colors duration-150">
                  Study Guidelines
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-brand-gray hover:text-brand-blue transition-colors duration-150">
                  System API Logs
                </a>
              </li>
            </ul>
          </div>

          {/* Cols 10-12: Company / Legal */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 p-6 sm:p-8 text-left">
            <h4 className="font-sans text-xs font-bold text-brand-muted uppercase tracking-[0.2em] mb-4">
              Company // Legal
            </h4>
            <ul className="space-y-2 font-sans text-sm font-semibold uppercase tracking-wider">
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-brand-gray hover:text-brand-blue transition-colors duration-150">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-brand-gray hover:text-brand-blue transition-colors duration-150">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-brand-gray hover:text-brand-blue transition-colors duration-150">
                  System Security
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
