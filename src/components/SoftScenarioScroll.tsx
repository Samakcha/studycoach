"use client";

import React from "react";
import ScrollReveal from "./ScrollReveal";

interface ScenarioCardProps {
  time: string;
  text: string;
  hoverColorClass: string;
}

function ScenarioCard({ time, text, hoverColorClass }: ScenarioCardProps) {
  return (
    <div
      className="w-[288px] h-[160px] bg-white rounded-3xl border border-stone-100 p-6 flex flex-col justify-between shrink-0 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 group cursor-pointer"
    >
      <div className="font-sans font-medium text-sm text-soft-muted/70 select-none">
        {time}
      </div>
      <div
        className={`font-sans text-xl font-medium text-soft-dark transition-colors duration-300 ${hoverColorClass}`}
      >
        {text}
      </div>
    </div>
  );
}

export default function SoftScenarioScroll() {
  const scenarios = [
    {
      time: "08:15 am",
      text: "Start your morning without instantly checking your inbox.",
      hoverColorClass: "group-hover:text-soft-coral",
    },
    {
      time: "02:30 pm",
      text: "Take a micro-break to breathe and rest your eyes.",
      hoverColorClass: "group-hover:text-[#A7C5A7]", // Soft dark Sage accent
    },
    {
      time: "06:45 pm",
      text: "Shut down digital noise and transition to cooking.",
      hoverColorClass: "group-hover:text-[#B6B0E0]", // Soft dark Lavender accent
    },
    {
      time: "10:00 pm",
      text: "Settle into deep sleep with an offline environment.",
      hoverColorClass: "group-hover:text-soft-coral",
    },
  ];

  return (
    <section id="scenarios" className="bg-soft-bg py-20 border-b border-stone-200/30">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mb-12 text-left">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-widest text-soft-muted">
              Daily Rhythms
            </span>
            <h2 className="mt-3 font-sans text-3xl sm:text-4xl font-light text-soft-dark leading-tight">
              designed for the moments you need focus.
            </h2>
          </ScrollReveal>
        </div>

        {/* Scroll Container */}
        <ScrollReveal>
          <div className="w-full overflow-x-auto flex gap-6 px-4 sm:px-6 lg:px-8 pb-8 scrollbar-hide snap-x snap-mandatory">
            {scenarios.map((scen, idx) => (
              <div key={idx} className="snap-start shrink-0">
                <ScenarioCard
                  time={scen.time}
                  text={scen.text}
                  hoverColorClass={scen.hoverColorClass}
                />
              </div>
            ))}
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
