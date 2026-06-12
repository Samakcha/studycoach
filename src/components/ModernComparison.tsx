"use client";

import React from "react";

interface ComparisonItemProps {
  idx: string;
  title: string;
  desc: string;
}

function ComparisonItem({ idx, title, desc }: ComparisonItemProps) {
  return (
    <div className="group border-t border-brand-border py-8 sm:py-10 flex flex-col md:flex-row items-start justify-between gap-6 cursor-pointer select-none transition-colors duration-250 ease-linear bg-brand-bg hover:bg-white/10 px-4">
      {/* Left: Monospace Index */}
      <div className="flex items-start gap-4">
        <span className="font-mono text-xs font-bold text-brand-muted uppercase tracking-widest pt-1">
          // {idx}
        </span>
        {/* Mid: Large Header */}
        <h3 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-bold text-brand-black tracking-tight group-hover:text-brand-blue transition-colors duration-300 ease-linear">
          {title}
        </h3>
      </div>
      {/* Right: Secondary descriptive text */}
      <div className="max-w-[320px] md:text-right">
        <p className="font-sans text-xs sm:text-sm text-brand-gray font-medium leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function ModernComparison() {
  const items = [
    {
      idx: "001",
      title: "Grid Paced Calendar",
      desc: "Rejects arbitrary study clocks. Bloom maps modules to actual exam schedules to prevent cramming.",
    },
    {
      idx: "002",
      title: "Accuracy Diagnostics",
      desc: "Isolates concepts dragging scores down, auto-updating quizzes until mastery is verified.",
    },
    {
      idx: "003",
      title: "No Gamified Tokens",
      desc: "Zero points, streaks, or cosmetic badges. Bloom maintains a pure focus framework for student success.",
    },
  ];

  return (
    <section id="different" className="relative w-full border-b border-brand-border bg-brand-bg select-none">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Cols 1-3: Label Sidebar */}
          <div className="col-span-12 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-brand-border p-6 sm:p-8 flex lg:flex-col lg:justify-between lg:items-start items-center justify-between">
            <span className="font-mono text-xs font-bold text-brand-muted uppercase tracking-[0.2em] lg:sticky lg:top-[112px]">
              Why Different // 003
            </span>
          </div>

          {/* Right Cols 4-12: List stack */}
          <div className="col-span-12 lg:col-span-9 p-6 sm:p-8 lg:py-16 lg:px-12 flex flex-col justify-between">
            
            {/* List Wrapper (adds bottom border at stack finish) */}
            <div className="border-b border-brand-border">
              {items.map((item, idx) => (
                <ComparisonItem
                  key={idx}
                  idx={item.idx}
                  title={item.title}
                  desc={item.desc}
                />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
