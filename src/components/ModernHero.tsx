"use client";

import React from "react";

export default function ModernHero() {
  return (
    <section className="relative w-full border-b border-brand-border select-none bg-brand-bg">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[85vh]">
          
          {/* Cols 1-3: Sidebar Label (Right Border on desktop) */}
          <div className="col-span-12 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-brand-border p-6 sm:p-8 flex lg:flex-col lg:justify-between lg:items-start items-center justify-between">
            <span className="font-mono text-xs font-bold text-brand-muted uppercase tracking-[0.2em] lg:sticky lg:top-[112px]">
              Manifesto // 001
            </span>
            <div className="h-4 w-4 bg-brand-black shrink-0" aria-hidden="true" />
          </div>

          {/* Cols 4-12: Massive Typography & Action items */}
          <div className="col-span-12 lg:col-span-9 p-6 sm:p-8 lg:py-16 lg:px-12 flex flex-col justify-between">
            
            {/* Massive Heading */}
            <div className="w-full">
              <h1 className="font-sans text-6xl sm:text-8xl md:text-[7.5rem] lg:text-[8.5rem] font-black uppercase tracking-tighter text-brand-black leading-[0.8] mb-12">
                Study
                <br />
                <span className="text-brand-blue">Smarter</span>
                <br />
                Not Harder.
              </h1>
            </div>

            {/* Bottom Section: 2-Column internal layout on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-8 border-t border-brand-border">
              {/* Left Column: 400px wide paragraph */}
              <div className="max-w-[400px]">
                <p className="font-sans text-base sm:text-lg font-normal text-brand-gray leading-relaxed">
                  A structured study assistant for students. Upload your syllabus, schedule paced daily sessions, run active recall quizzes, and isolate exam weaknesses automatically. No vanity statistics. Only results.
                </p>
              </div>

              {/* Right Column: CTA Group */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 select-none font-sans font-bold text-sm uppercase tracking-widest">
                <button className="bg-brand-blue text-brand-bg px-8 py-4 hover:bg-brand-black transition-colors duration-300 text-center cursor-pointer">
                  Get Started
                </button>
                <a
                  href="#system"
                  className="inline-block text-brand-black hover:text-brand-blue transition-colors duration-300 border-b-2 border-brand-black hover:border-brand-blue py-1 text-center"
                >
                  See the system
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
