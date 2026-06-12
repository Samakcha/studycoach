"use client";

import React from "react";

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
}

function FeatureCard({ emoji, title, description }: FeatureCardProps) {
  return (
    <div className="group bg-brand-white border-2 border-brand-black rounded-xl p-8 shadow-neo-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all duration-150 flex flex-col items-start text-left select-none">
      
      {/* Icon Box: 16x16 (64px) Sage, turns Yellow on hover */}
      <div className="h-16 w-16 bg-brand-sage group-hover:bg-brand-yellow border-2 border-brand-black rounded-lg flex items-center justify-center transition-colors duration-200 shadow-neo-sm mb-6 shrink-0">
        <span className="text-2xl" role="img" aria-label={title}>
          {emoji}
        </span>
      </div>

      <h3 className="font-heading text-2xl font-black text-brand-black tracking-tight mb-3">
        {title}
      </h3>
      
      <p className="font-sans font-medium text-sm sm:text-base text-brand-black/85 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function NeoFeatureGrid() {
  const features = [
    {
      emoji: "📄",
      title: "Smart Upload",
      description:
        "Upload notes, syllabus, or past papers. AI extracts topics instantly and builds your dashboard.",
    },
    {
      emoji: "🧠",
      title: "Adaptive Quizzes",
      description:
        "Quiz yourself on any concept. Wrong answers are queued for review until you get them right.",
    },
    {
      emoji: "📊",
      title: "Weak Spot Tracker",
      description:
        "AI scans quiz metrics, highlights low-performing topics, and adjusts study schedules automatically.",
    },
  ];

  return (
    <section id="features" className="bg-brand-yellow border-y-2 border-brand-black py-20 sm:py-28 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="bg-brand-white text-brand-black border-2 border-brand-black px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-neo-sm">
            Core Features
          </span>
          <h2 className="mt-4 font-heading text-4xl sm:text-5xl font-black text-brand-black tracking-tight leading-none">
            Everything you need to ace exams
          </h2>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feat, idx) => (
            <FeatureCard
              key={idx}
              emoji={feat.emoji}
              title={feat.title}
              description={feat.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
