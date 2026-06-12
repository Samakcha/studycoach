"use client";

import React from "react";
import ScrollReveal from "./ScrollReveal";

interface TestimonialCardProps {
  quote: string;
  author: string;
  rotationClass: string;
}

function TestimonialCard({ quote, author, rotationClass }: TestimonialCardProps) {
  return (
    <div
      className={`bg-white border border-stone-200/50 p-8 sm:p-10 rounded-2xl shadow-soft-md transition-transform duration-300 hover:scale-102 flex flex-col justify-between items-start text-left select-none relative ${rotationClass}`}
    >
      {/* Tape Effect at top */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-20 bg-stone-100/60 border border-stone-200/20 backdrop-blur-xs rotate-[-2deg]" />

      <p className="font-sans font-light text-soft-dark text-lg sm:text-xl leading-relaxed mb-8">
        "{quote}"
      </p>

      <div className="flex items-center gap-3 w-full">
        {/* 32px Horizontal Line */}
        <div className="w-8 h-[1px] bg-soft-dark/25 shrink-0" />
        
        {/* Reenie Beanie Cursive Signature in 24px stone-500 */}
        <span className="font-cursive text-2xl text-soft-muted leading-none">
          {author}
        </span>
      </div>
    </div>
  );
}

export default function SoftTestimonials() {
  const testimonials = [
    {
      quote:
        "This app helped me quiet the background chatter. For the first time in years, I can focus on reading a physical book without constantly reaching for my notifications.",
      author: "Sarah Mitchell",
      rotationClass: "rotate-[-1deg]",
    },
    {
      quote:
        "The breathing prompts are beautifully subtle. It doesn't scream at me to log off or detox; it simply and gently invites me to pause for a moment.",
      author: "David K.",
      rotationClass: "rotate-[1deg]",
    },
  ];

  return (
    <section className="bg-soft-bg py-20 sm:py-28 border-b border-stone-200/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-widest text-soft-muted">
              Quiet Reflections
            </span>
            <h2 className="mt-4 font-sans text-4xl sm:text-5xl font-light text-soft-dark tracking-tight leading-none">
              diary entries from our community.
            </h2>
          </ScrollReveal>
        </div>

        {/* 2-Column Grid (Desktop) / 1-Column (Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {testimonials.map((t, idx) => (
            <ScrollReveal key={idx}>
              <TestimonialCard
                quote={t.quote}
                author={t.author}
                rotationClass={t.rotationClass}
              />
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
