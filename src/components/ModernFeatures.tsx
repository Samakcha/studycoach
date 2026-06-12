"use client";

import React from "react";

interface FeatureCardProps {
  num: string;
  title: string;
  desc: string;
}

function FeatureCard({ num, title, desc }: FeatureCardProps) {
  return (
    <div className="border border-brand-border p-6 flex flex-col justify-between h-72 hover:bg-white/20 transition-colors duration-350 ease-linear select-none rounded-none bg-brand-bg/50">
      <div className="font-mono text-xs font-bold text-brand-muted uppercase tracking-widest">
        // {num}
      </div>
      <div>
        <h3 className="font-sans text-xl font-bold text-brand-black uppercase tracking-tight mb-2">
          {title}
        </h3>
        <p className="font-sans text-xs sm:text-sm font-medium text-brand-gray leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function ModernFeatures() {
  const features = [
    {
      num: "01 // PARSE",
      title: "Syllabus Upload",
      desc: "Upload past papers, handouts, or syllabus drafts. AI instantly parses topics, concepts, and module weights.",
    },
    {
      num: "02 // PACING",
      title: "Paced Schedule",
      desc: "Set your target exam dates. The system maps out a day-by-day calendar module to prevent last-minute cramming.",
    },
    {
      num: "03 // ACCURACY",
      title: "Adaptive Quiz",
      desc: "Run active recall quizzes. Low-accuracy topics are automatically queued for review until fully mastered.",
    },
  ];

  return (
    <section id="system" className="relative w-full border-b border-brand-border bg-brand-bg select-none">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Cols 1-3: Label Sidebar */}
          <div className="col-span-12 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-brand-border p-6 sm:p-8 flex lg:flex-col lg:justify-between lg:items-start items-center justify-between">
            <span className="font-mono text-xs font-bold text-brand-muted uppercase tracking-[0.2em] lg:sticky lg:top-[112px]">
              System // 002
            </span>
          </div>

          {/* Right Cols 4-12: Header and 3-column Grid */}
          <div className="col-span-12 lg:col-span-9 p-6 sm:p-8 lg:py-16 lg:px-12 flex flex-col justify-between">
            
            {/* 3-Word Stacked Headline */}
            <div className="mb-14">
              <h2 className="font-sans text-5xl sm:text-7xl font-black uppercase text-brand-black leading-[0.85] tracking-tighter">
                Extract.
                <br />
                Schedule.
                <br />
                Diagnose.
              </h2>
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-brand-border">
              {features.map((feat, idx) => (
                <div key={idx} className="-mt-[1px] -ml-[1px]">
                  <FeatureCard
                    num={feat.num}
                    title={feat.title}
                    desc={feat.desc}
                  />
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
