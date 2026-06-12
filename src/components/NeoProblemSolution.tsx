"use client";

import React from "react";

export default function NeoProblemSolution() {
  return (
    <section id="solution" className="bg-brand-white py-20 sm:py-28 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-brand-sage text-brand-black border-2 border-brand-black px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-neo-sm">
            Methodology
          </span>
          <h2 className="mt-4 font-heading text-4xl sm:text-5xl font-black text-brand-black tracking-tight leading-none">
            Break the cycle of passive studying
          </h2>
        </div>

        {/* 2-Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Card A: Problem */}
          <div className="rounded-3xl border-2 border-dashed border-gray-400 bg-gray-100 p-8 sm:p-10 opacity-70 flex flex-col justify-between">
            <div>
              <div className="inline-block bg-gray-200 border border-gray-400 px-3 py-1 rounded-md text-[10px] font-bold text-gray-600 uppercase mb-6">
                The Old Way
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-gray-800 mb-6">
                Endless Cramming & Stress
              </h3>
              
              <ul className="space-y-4 font-sans font-medium text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 border border-red-300 text-red-600 text-xs font-bold shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span>
                    <strong>Passive reading</strong> of textbooks with zero long-term retention.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 border border-red-300 text-red-600 text-xs font-bold shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span>
                    <strong>Cramming sheets</strong> 24 hours before finals with high anxiety.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 border border-red-300 text-red-600 text-xs font-bold shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span>
                    <strong>Blindspots</strong> remain invisible until the exam paper is handed to you.
                  </span>
                </li>
              </ul>
            </div>

            <p className="mt-8 text-xs font-bold text-gray-500 uppercase tracking-wider border-t border-gray-200 pt-4">
              Result: Inefficient, exhausting, and unreliable.
            </p>
          </div>

          {/* Card B: Solution */}
          <div className="rounded-3xl border-2 border-brand-black bg-brand-yellow p-8 sm:p-10 shadow-neo-lg flex flex-col justify-between">
            <div>
              <div className="inline-block bg-brand-white border-2 border-brand-black px-3 py-1 rounded-md text-[10px] font-bold text-brand-black uppercase mb-6">
                The StudyCoach Way
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-brand-black mb-6">
                Guided Mastery & Confidence
              </h3>

              <ul className="space-y-4 font-sans font-medium text-brand-black">
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-white border-2 border-brand-black text-brand-black text-xs font-bold shrink-0 mt-0.5 shadow-neo-sm">
                    ✓
                  </span>
                  <span>
                    <strong>Instant syllabus parsing</strong> to extract every topic automatically.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-white border-2 border-brand-black text-brand-black text-xs font-bold shrink-0 mt-0.5 shadow-neo-sm">
                    ✓
                  </span>
                  <span>
                    <strong>Personalised day-by-day schedules</strong> dynamically adjusted to your timeline.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-white border-2 border-brand-black text-brand-black text-xs font-bold shrink-0 mt-0.5 shadow-neo-sm">
                    ✓
                  </span>
                  <span>
                    <strong>Weak spot diagnostic loops</strong> targeting errors with adaptive recall quizzes.
                  </span>
                </li>
              </ul>
            </div>

            <p className="mt-8 text-xs font-bold text-brand-black uppercase tracking-wider border-t-2 border-brand-black pt-4">
              Result: Smarter workflows, higher scores, and peace of mind.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
