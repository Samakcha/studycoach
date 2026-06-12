"use client";

import React from "react";

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
}

function TestimonialCard({ name, role, quote }: TestimonialCardProps) {
  return (
    <div className="bg-brand-white border-2 border-brand-black p-8 shadow-neo-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all duration-150 flex flex-col justify-between items-start text-left select-none rounded-tr-3xl rounded-bl-3xl rounded-tl-[2px] rounded-br-[2px]">
      
      <div>
        {/* 5-Star Rating in #ffbc2e */}
        <div className="flex gap-1 mb-5">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#ffbc2e"
              className="h-5 w-5 stroke-brand-black stroke-2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>

        <p className="font-sans font-medium text-brand-black text-sm sm:text-base leading-relaxed mb-6 italic">
          "{quote}"
        </p>
      </div>

      <div className="border-t border-brand-black/10 pt-4 w-full">
        <h4 className="font-heading text-lg font-black text-brand-black leading-none">
          {name}
        </h4>
        <p className="font-sans font-bold text-xs text-brand-black/60 mt-1">
          {role}
        </p>
      </div>

    </div>
  );
}

export default function NeoTestimonials() {
  const testimonials = [
    {
      name: "Aarav Sharma",
      role: "Class 12 CBSE Student",
      quote:
        "StudyCoach completely changed my board exam prep. The day-by-day plan kept me accountable, and the AI schedule adapted whenever I missed a day.",
    },
    {
      name: "Priya Patel",
      role: "NEET Aspirant",
      quote:
        "The adaptive quizzes helped me find my biology weak spots. The questions I got wrong kept resurfacing until I understood the underlying theory.",
    },
    {
      name: "Kabir Roy",
      role: "B.Tech Student, IIT",
      quote:
        "Reduced semester cramming times by half. I just upload my professors' dense slide presentations and let the AI extract revision sheets.",
    },
  ];

  return (
    <section id="testimonials" className="bg-brand-sage py-20 sm:py-28 border-b-2 border-brand-black select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="bg-brand-white text-brand-black border-2 border-brand-black px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-neo-sm">
            Testimonials
          </span>
          <h2 className="mt-4 font-heading text-4xl sm:text-5xl font-black text-brand-black tracking-tight leading-none">
            Approved by top scorers
          </h2>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {testimonials.map((t, idx) => (
            <TestimonialCard
              key={idx}
              name={t.name}
              role={t.role}
              quote={t.quote}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
