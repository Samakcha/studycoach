"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Branding & Copyright */}
          <div className="flex items-center gap-2 select-none">
            <span className="font-heading text-base font-bold tracking-tight text-brand-text">
              StudyCoach
            </span>
            <span className="text-sm text-brand-muted">
              &copy; 2026
            </span>
          </div>

          {/* Right: Plain Text Links */}
          <div className="flex items-center gap-6">
            <Link
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-sm text-brand-muted hover:text-brand-text transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-sm text-brand-muted hover:text-brand-text transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
