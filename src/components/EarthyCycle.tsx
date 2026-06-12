"use client";

import React from "react";
import EarthyScrollReveal from "./EarthyScrollReveal";
import ScrollVelocity from "./ui/ScrollVelocity";

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
            THE WORKFLOW
          </h2>
          <p className="font-sans text-xs md:text-sm text-forest/80 font-medium leading-relaxed max-w-lg">
            Forget passive highlight-taking. StudyCoach translates standard files into an active, self-correcting exam preparation cycle that continuously isolates and reinforces high-weightage topics.
          </p>
        </div>
      </EarthyScrollReveal>

      {/* ScrollVelocity horizontal continuous cards row */}
      <div className="w-full select-none pointer-events-auto overflow-hidden">
        <ScrollVelocity
          texts={[
            <div className="flex gap-6 items-center px-3" style={{ paddingRight: "24px" }} key="row">
              {steps.map((step) => (
                <div 
                  key={step.num}
                  className="flex flex-col justify-between p-8 h-[280px] w-[260px] rounded-[2.5rem] border shrink-0 transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg text-left whitespace-normal"
                  style={{
                    backgroundColor: "#01472e",
                    borderColor: "rgba(254, 250, 224, 0.12)",
                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  {/* Step Circle Badge */}
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-sans text-xs font-bold"
                    style={{ 
                      backgroundColor: "#e9edc9",
                      color: "#01472e"
                    }}
                  >
                    {step.num}
                  </div>

                  {/* Step Content */}
                  <div>
                    <h3 className="font-sans text-sm font-bold uppercase tracking-[0.15em] mb-3" style={{ color: "#fefae0" }}>
                      {step.title}
                    </h3>
                    <p className="font-sans text-[11px] md:text-xs font-semibold leading-relaxed whitespace-normal" style={{ color: "rgba(254, 250, 224, 0.85)" }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ]}
          velocity={120}
          numCopies={4}
          damping={30}
          stiffness={150}
        />
      </div>
      </div>
    </section>
  );
}
