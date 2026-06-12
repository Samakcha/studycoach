"use client";

import React from "react";
import EarthyScrollReveal from "./EarthyScrollReveal";

interface CycleStep {
  num: string;
  title: string;
  desc: string;
}

export default function EarthyCycle() {
  const steps: CycleStep[] = [
    {
      num: "01",
      title: "UPLOAD",
      desc: "Upload syllabi, notes, PDFs. Fact-source materials automatically.",
    },
    {
      num: "02",
      title: "ASK/EDIT",
      desc: "Study aids and answers are generated and syntax-corrected instantly.",
    },
    {
      num: "03",
      title: "MEMORISE",
      desc: "Active recall sessions are automatically queued for optimal retention.",
    },
    {
      num: "04",
      title: "CUSTOM",
      desc: "You retain full control over topic prioritization and pacing intervals.",
    },
    {
      num: "05",
      title: "REORGANISE",
      desc: "Your calendar adjusts dynamically around mock exams and performance gaps.",
    },
  ];

  return (
    <section 
      id="cycle"
      data-flow-section
      className="relative w-full min-h-screen overflow-hidden select-none"
      style={{ backgroundColor: "#e9edc9" }}
    >
      <div 
        className="flow-art-container relative flex min-h-screen w-full flex-col justify-between rounded-t-[5rem] px-6 md:px-12 py-24 will-change-transform"
        style={{ backgroundColor: "#fefae0", transformOrigin: "bottom left" }}
      >
      
      {/* Section Header */}
      <EarthyScrollReveal>
        <div className="max-w-3xl mb-16">
          <h2 
            className="font-display text-[10vw] md:text-[12vw] leading-[0.8] tracking-[-0.03em] uppercase mb-6"
            style={{ color: "#01472e" }}
          >
            THE AGENTS
          </h2>
          <p className="font-sans text-xs md:text-sm text-forest/80 font-medium leading-relaxed max-w-lg">
            Forget passive highlight-taking. StudyCoach translates standard files into an active, self-correcting exam preparation cycle that continuously isolates and reinforces high-weightage topics.
          </p>
        </div>
      </EarthyScrollReveal>

      {/* Grid: 5 columns on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {steps.map((step, index) => (
          <EarthyScrollReveal key={step.num} delay={index * 100}>
            <div 
              className="flex flex-col justify-between p-8 h-[280px] rounded-[2.5rem] border transition-all duration-[600ms] hover:translate-y-[-8px] hover:shadow-2xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                borderColor: "rgba(1, 71, 46, 0.08)",
                boxShadow: "0 20px 40px -15px rgba(1, 71, 46, 0.05)",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              
              {/* Step Circle Badge */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-sans text-xs font-bold"
                style={{ 
                  backgroundColor: "#ccd5ae",
                  color: "#01472e"
                }}
              >
                {step.num}
              </div>

              {/* Step Content */}
              <div>
                <h3 className="font-sans text-sm font-bold text-forest uppercase tracking-[0.15em] mb-3" style={{ color: "#01472e" }}>
                  {step.title}
                </h3>
                <p className="font-sans text-[11px] md:text-xs text-forest/75 font-semibold leading-relaxed">
                  {step.desc}
                </p>
              </div>

            </div>
          </EarthyScrollReveal>
        ))}
      </div>
      </div>
    </section>
  );
}
