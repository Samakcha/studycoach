"use client";

import React from "react";
import Link from "next/link";

export default function SoftNavbar() {
  return (
    <nav className="fixed top-4 left-4 right-4 max-w-md md:max-w-lg mx-auto z-40 bg-white/70 border border-stone-200/40 rounded-full py-2.5 px-4.5 backdrop-blur-[20px] flex items-center justify-between shadow-soft-md select-none">
      
      {/* Left: Circular Coral Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="h-6 w-6 rounded-full bg-soft-coral flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <div className="h-2 w-2 rounded-full bg-white" />
        </div>
        <span className="font-sans font-bold text-sm text-soft-dark tracking-tight">
          bloom
        </span>
      </Link>

      {/* Center: Outfit Medium Links */}
      <div className="flex items-center gap-4.5 text-xs sm:text-sm font-medium text-soft-muted">
        <a href="#features" className="hover:text-soft-dark transition-colors">
          Features
        </a>
        <a href="#cycle" className="hover:text-soft-dark transition-colors">
          Method
        </a>
        <a href="#access" className="hover:text-soft-dark transition-colors">
          Join
        </a>
      </div>

      {/* Right: Dark Stone Pill Button */}
      <button className="bg-soft-dark text-soft-bg text-xs font-semibold px-4.5 py-2 rounded-full hover:bg-soft-dark/95 active:scale-95 transition-all cursor-pointer">
        Try Free
      </button>

    </nav>
  );
}
