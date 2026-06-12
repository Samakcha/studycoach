"use client";

import React from "react";

export default function NeoPersonas() {
  return (
    <section id="personas" className="bg-brand-white py-20 sm:py-28 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="bg-brand-yellow text-brand-black border-2 border-brand-black px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-neo-sm">
            Target Audiences
          </span>
          <h2 className="mt-4 font-heading text-4xl sm:text-5xl font-black text-brand-black tracking-tight leading-none">
            Tailored study plans for every stage
          </h2>
        </div>

        {/* Bento Grid (3 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* Card 1: Sage Card */}
          <div className="bg-brand-sage border-2 border-brand-black rounded-2xl p-8 sm:p-10 flex flex-col justify-between items-start text-left shadow-neo-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all duration-150">
            <div className="w-full">
              {/* White Pill Badge */}
              <div className="inline-block bg-brand-white border-2 border-brand-black px-3.5 py-1 rounded-full text-xs font-bold text-brand-black mb-8 shadow-neo-sm">
                School Students
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-brand-black mb-4 tracking-tight leading-none">
                Ace Boards & CBSE
              </h3>
              <p className="font-sans font-medium text-sm sm:text-base text-brand-black/80 leading-relaxed">
                Organise subjects, track daily syllabus coverage, and run mock board tests directly from your study table. Fits CBSE and ICSE boards seamlessly.
              </p>
            </div>
            
            <span className="mt-8 text-xs font-black uppercase text-brand-black/60 border-t border-brand-black/20 pt-4 w-full">
              Ideal for CBSE, ICSE & state boards
            </span>
          </div>

          {/* Card 2: Yellow Card with 8px Hard Shadow */}
          <div className="bg-brand-yellow border-2 border-brand-black rounded-2xl p-8 sm:p-10 flex flex-col justify-between items-start text-left shadow-neo-lg hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-neo-md transition-all duration-150 relative">
            {/* Spotlight label */}
            <span className="absolute -top-3.5 right-6 bg-brand-black text-brand-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded border-2 border-brand-black shadow-neo-sm">
              MOST POPULAR
            </span>

            <div className="w-full">
              {/* White Pill Badge */}
              <div className="inline-block bg-brand-white border-2 border-brand-black px-3.5 py-1 rounded-full text-xs font-bold text-brand-black mb-8 shadow-neo-sm">
                Competitive Exams
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-brand-black mb-4 tracking-tight leading-none">
                Master JEE & NEET
              </h3>
              <p className="font-sans font-medium text-sm sm:text-base text-brand-black/85 leading-relaxed">
                Target high-weightage topics first, clear past papers, and trigger smart diagnostic quizzes to isolate physics and chemistry equations.
              </p>
            </div>

            <span className="mt-8 text-xs font-black uppercase text-brand-black/75 border-t border-brand-black/20 pt-4 w-full">
              Features advanced test diagnostics
            </span>
          </div>

          {/* Card 3: Dark Gray Card */}
          <div className="bg-brand-dark-gray border-2 border-brand-black text-brand-white rounded-2xl p-8 sm:p-10 flex flex-col justify-between items-start text-left shadow-neo-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all duration-150">
            <div className="w-full">
              {/* White Pill Badge */}
              <div className="inline-block bg-brand-white border-2 border-brand-black px-3.5 py-1 rounded-full text-xs font-bold text-brand-black mb-8 shadow-neo-sm-white">
                College Students
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-brand-white mb-4 tracking-tight leading-none">
                Slay Semester Exams
              </h3>
              <p className="font-sans font-medium text-sm sm:text-base text-brand-sage/85 leading-relaxed">
                Cram smart during busy college semesters. Parse complex university PDFs to instantly generate active recall lists and adaptive study cards.
              </p>
            </div>

            <span className="mt-8 text-xs font-black uppercase text-brand-sage/60 border-t border-brand-white/10 pt-4 w-full">
              Supports complex academic PDFs
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
