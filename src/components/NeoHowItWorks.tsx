"use client";

import React from "react";

export default function NeoHowItWorks() {
  const steps = [
    {
      num: "01",
      glowColor: "border-brand-sage shadow-[0_0_12px_rgba(183,198,194,0.5)]",
      title: "Upload Resources",
      desc: "Drop syllabus files, class notes, or past exam sheets. AI breaks down concepts instantly.",
    },
    {
      num: "02",
      glowColor: "border-brand-yellow shadow-[0_0_12px_rgba(255,225,124,0.5)]",
      title: "Get Custom Pacing",
      desc: "Set your exam dates and let AI schedule daily target blocks so you never cram again.",
    },
    {
      num: "03",
      glowColor: "border-brand-white shadow-[0_0_12px_rgba(255,255,255,0.5)]",
      title: "Quiz & Diagnose",
      desc: "Complete adaptive reviews. Wrong concepts automatically loop back until fully master them.",
    },
  ];

  return (
    <section className="bg-brand-charcoal py-20 sm:py-28 text-brand-white border-b-2 border-brand-black select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="bg-brand-dark-gray text-brand-yellow border-2 border-brand-yellow px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-neo-sm-white">
            Pipelined Workflow
          </span>
          <h2 className="mt-5 font-heading text-4xl sm:text-5xl font-black text-brand-white tracking-tight leading-none">
            How StudyCoach works
          </h2>
        </div>

        {/* 3-Step Flow */}
        <div className="relative max-w-5xl mx-auto">
          {/* Horizontal Connection Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-1/12 right-1/12 h-[3px] bg-brand-dark-gray z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                
                {/* Large 24x24 (96px) Circle with colored glow border */}
                <div className={`h-24 w-24 rounded-full bg-brand-charcoal border-4 flex items-center justify-center text-2xl font-heading font-black text-brand-white shrink-0 mb-6 transition-transform duration-200 group-hover:scale-105 ${step.glowColor}`}>
                  {step.num}
                </div>

                <h3 className="font-heading text-xl sm:text-2xl font-black text-brand-white mb-3 tracking-tight">
                  {step.title}
                </h3>
                
                <p className="font-sans font-medium text-xs sm:text-sm text-brand-sage/80 leading-relaxed max-w-xs">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
