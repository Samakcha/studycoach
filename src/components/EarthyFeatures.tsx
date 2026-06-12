"use client";

import React from "react";
import EarthyScrollReveal from "./EarthyScrollReveal";
import ScrollStack, { ScrollStackItem } from "./ui/ScrollStack";

interface FeatureCardData {
  id: string;
  idx: string;
  title: string;
  desc: string;
  image: string;
}

interface EarthyFeaturesProps {
  onAddToCart: () => void;
}

export default function EarthyFeatures({ onAddToCart }: EarthyFeaturesProps) {
  const features: FeatureCardData[] = [
    {
      id: "parse",
      idx: "01 // PARSE",
      title: "Syllabus Parse",
      desc: "Instantly parse academic PDFs to extract chapters, weightage, and high-yield study topics.",
      image: "/feature_card_1.png",
    },
    {
      id: "quiz",
      idx: "02 // DIAGNOSE",
      title: "Adaptive Quizzes",
      desc: "Diagnose concepts dragging down scores and auto-update flashcard intervals until mastered.",
      image: "/feature_card_2.png",
    },
    {
      id: "pacing",
      idx: "03 // PACING",
      title: "Pacing Calendar",
      desc: "Rejects stress clocks. Maps daily learning targets to target exam dates without gamified streaks.",
      image: "/feature_card_3.png",
    },
    {
      id: "recall",
      idx: "04 // RECALL",
      title: "Active Recall",
      desc: "Generates high-yield study questions and flashcards directly from syllabus topics to test comprehension.",
      image: "/feature_card_1.png",
    },
    {
      id: "mock",
      idx: "05 // SIMULATE",
      title: "Mock Simulator",
      desc: "Simulate exam-day conditions with timed mock tests and detailed strategic performance logs.",
      image: "/feature_card_2.png",
    },
  ];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart();
    // Nice feedback
    const btn = e.currentTarget as HTMLButtonElement;
    const originalText = btn.innerText;
    btn.innerText = "ADDED ✓";
    btn.style.backgroundColor = "#ccd5ae";
    btn.style.color = "#01472e";
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.backgroundColor = "#ffffff";
      btn.style.color = "#01472e";
    }, 1000);
  };

  return (
    <section 
      id="features"
      data-flow-section
      className="relative w-full min-h-screen overflow-hidden select-none"
      style={{ backgroundColor: "#ccd5ae" }}
    >
      <div 
        className="flow-art-container relative flex min-h-screen w-full flex-col md:flex-row justify-between items-center gap-12 rounded-t-[5rem] px-8 md:px-16 py-20 md:py-28 will-change-transform"
        style={{ backgroundColor: "#e9edc9", transformOrigin: "bottom left" }}
      >
        
        {/* Left column: Section Header & Brief (Floats sticky on desktop) */}
        <div className="w-full md:w-[35%] lg:w-[40%] flex flex-col justify-start md:sticky md:top-28 h-fit relative z-20">
          <EarthyScrollReveal>
            <h2 
              className="font-display text-[9vw] md:text-[6vw] lg:text-[7vw] leading-[0.85] tracking-[-0.03em] uppercase mb-4 text-forest"
              style={{ color: "#01472e" }}
            >
              THE SYSTEM
            </h2>
          </EarthyScrollReveal>

          <EarthyScrollReveal delay={100}>
            <p className="font-sans text-xs md:text-sm lg:text-base text-forest/75 font-medium leading-relaxed max-w-sm mt-2">
              StudyCoach integrates syllabus mapping, adaptive recall diagnostics, and stress-free pacing calendars into a single, cohesive academic counselor. Add features to your learning deck to begin studying.
            </p>
          </EarthyScrollReveal>
        </div>

        {/* Right column: Scrollable stacked viewport */}
        <div className="w-full md:w-[65%] lg:w-[60%] h-[380px] flex-grow relative z-10 overflow-hidden rounded-3xl">
          <ScrollStack 
            className="w-full h-full"
            itemDistance={75}
            itemScale={0.035}
            itemStackDistance={16}
            stackPosition="15%"
            scaleEndPosition="5%"
            baseScale={0.92}
            blurAmount={1.5}
            useWindowScroll={false}
          >
            {features.map((feat) => (
              <ScrollStackItem 
                key={feat.id}
                itemClassName="relative w-full h-full flex flex-col cursor-pointer"
              >
                {/* Back paper layer */}
                <div 
                  className="absolute inset-0 rounded-3xl shadow-md transform -rotate-3 transition-transform duration-500 hover:-rotate-5"
                  style={{ 
                    backgroundColor: "#e6d668",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    boxShadow: "0 10px 20px -10px rgba(0, 0, 0, 0.12)"
                  }}
                />
                
                {/* Front paper layer */}
                <div 
                  className="relative flex-grow flex flex-col justify-between rounded-3xl p-5 md:p-6 transform rotate-2 transition-transform duration-500 hover:rotate-0 shadow-lg border border-[#ebd859] h-full"
                  style={{ 
                    backgroundColor: "#fff785",
                    boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.15)"
                  }}
                >
                  {/* Red Paperclip at Top Right */}
                  <svg 
                    width="36" 
                    height="36" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#dc2626" 
                    strokeWidth="2.8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="absolute -top-3.5 right-8 z-30 drop-shadow-[0_3px_5px_rgba(0,0,0,0.25)] transform -rotate-[25deg] pointer-events-none"
                  >
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>

                  {/* Content Area */}
                  <div className="flex-grow flex flex-col justify-between pt-2">
                    <div>
                      <div className="font-mono text-[8px] font-bold text-forest/50 uppercase tracking-[0.2em] mb-1.5">
                        {feat.idx}
                      </div>
                      <h3 className="font-sans text-sm md:text-base font-bold text-forest uppercase tracking-tight mb-1.5">
                        {feat.title}
                      </h3>
                      <p className="font-sans text-[11px] text-forest/75 font-medium leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>

                    {/* Quick Add Button */}
                    <div className="mt-4">
                      <button 
                        onClick={handleQuickAdd}
                        className="w-full border border-forest/15 hover:border-forest text-forest uppercase tracking-[0.25em] text-[8px] font-bold py-2.5 px-4 rounded-full transition-colors bg-white hover:bg-forest hover:text-white cursor-pointer active:scale-95 duration-300 shadow-sm"
                        style={{
                          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
                        }}
                      >
                        QUICK ADD
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>

      </div>
    </section>
  );
}
