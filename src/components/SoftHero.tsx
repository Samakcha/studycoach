"use client";

import React from "react";

export default function SoftHero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28 lg:pt-48 lg:pb-36 bg-soft-bg select-none">
      
      {/* Animated Blurred Blobs */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        {/* Blob A: Light Pink #FFE4E1 */}
        <div
          className="absolute top-20 left-[10%] sm:left-[25%] h-[350px] w-[350px] sm:h-[450px] sm:w-[450px] rounded-full bg-[#FFE4E1]/60 blur-[80px] sm:blur-[100px] animate-float-slow"
          aria-hidden="true"
        />
        {/* Blob B: Lavender #E6E6FA */}
        <div
          className="absolute bottom-10 right-[10%] sm:right-[20%] h-[350px] w-[350px] sm:h-[450px] sm:w-[450px] rounded-full bg-[#E6E6FA]/60 blur-[80px] sm:blur-[100px] animate-float-slow-reverse"
          aria-hidden="true"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-soft-sage/55 border border-soft-dark/10 px-3.5 py-1 text-xs font-medium text-soft-dark/80 mb-8 tracking-wide">
          <span className="flex h-1.5 w-1.5 rounded-full bg-soft-coral" />
          digital wellness 1.0
        </div>

        {/* Heading: Sentence-case Outfit with Reenie Beanie cursive keyword */}
        <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl font-light text-soft-dark leading-[1.08] tracking-tight max-w-4xl mx-auto">
          disconnect to connect{" "}
          <span className="font-cursive text-5xl sm:text-7xl md:text-8xl text-soft-coral font-normal inline-block transform rotate-[-3deg] ml-1.5 mr-1">
            gently
          </span>
          .
        </h1>

        {/* Sub-headline (max-width 500px) */}
        <p className="mt-8 text-base sm:text-lg text-soft-muted max-w-[500px] mx-auto leading-relaxed">
          Bloom is a digital sanctuary for your mind. Uncomplicate your screen habits, reclaim your attention, and focus on what truly matters.
        </p>

        {/* Dual CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4.5">
          {/* Primary Coral Pill */}
          <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-soft-coral text-soft-dark px-7 py-3.5 text-sm font-semibold shadow-soft-md hover:bg-soft-coral/90 active:scale-98 transition-all cursor-pointer">
            Start free trial
          </button>
          
          {/* Secondary White Pill with Border */}
          <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white border border-stone-200 text-soft-dark px-7 py-3.5 text-sm font-semibold hover:bg-stone-50 active:scale-98 transition-all cursor-pointer">
            See how it works
          </button>
        </div>

      </div>
    </section>
  );
}
