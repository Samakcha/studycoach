"use client";

import React from "react";
import ScrollReveal from "./ScrollReveal";

export default function SoftPreview() {
  return (
    <section id="preview" className="bg-soft-bg py-20 sm:py-28 border-b border-stone-200/30 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-widest text-soft-muted">
              App Preview
            </span>
            <h2 className="mt-4 font-sans text-4xl sm:text-5xl font-light text-soft-dark tracking-tight leading-none">
              a digital living room for your mind.
            </h2>
          </ScrollReveal>
        </div>

        {/* 3-Mockup Stacked Container */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 lg:gap-8 max-w-5xl mx-auto relative select-none">
            
            {/* LEFT PHONE: 280x580px, Sage, 80% opacity, +48px translate */}
            <div className="w-[280px] h-[580px] bg-white rounded-[2.5rem] border-[6px] border-soft-dark/90 p-4 shadow-soft-lg opacity-80 md:translate-y-12 transition-transform duration-300 hover:scale-102 flex flex-col justify-between shrink-0">
              {/* Screen Mockup Area: Sage bg */}
              <div className="flex-1 bg-soft-sage rounded-[2rem] p-5 flex flex-col justify-between items-center text-center">
                {/* Phone Speaker Notch */}
                <div className="h-4.5 w-24 bg-soft-dark/90 rounded-full -mt-2.5 mb-6" />
                
                {/* Content */}
                <div className="w-full">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-soft-dark/60 mb-2">Focus Mode</div>
                  <div className="text-2xl font-light text-soft-dark mb-4">45:00</div>
                  {/* Visual Circle Timer */}
                  <div className="h-28 w-28 rounded-full border-2 border-dashed border-soft-dark/25 flex items-center justify-center mx-auto mb-4">
                    <div className="h-22 w-22 rounded-full bg-white/40 flex items-center justify-center text-xs font-bold text-soft-dark">
                      Active
                    </div>
                  </div>
                </div>

                <div className="w-full bg-white/40 rounded-xl p-3.5 border border-stone-200/20 text-left">
                  <p className="text-xs font-bold text-soft-dark/80">Quiet Mode</p>
                  <p className="text-[10px] text-soft-muted mt-1">Notifications paused across all platforms.</p>
                </div>
              </div>
            </div>

            {/* CENTER PHONE: 300x620px, Lavender, 100% opacity, Coral pulsing button */}
            <div className="w-[300px] h-[620px] bg-white rounded-[2.75rem] border-[6px] border-soft-dark/95 p-4 shadow-soft-lg z-10 transition-transform duration-300 hover:scale-102 flex flex-col justify-between shrink-0">
              {/* Screen Mockup Area: Lavender bg */}
              <div className="flex-1 bg-soft-lavender rounded-[2.25rem] p-6 flex flex-col justify-between items-center text-center relative overflow-hidden">
                {/* Phone Speaker Notch */}
                <div className="h-4.5 w-28 bg-soft-dark/90 rounded-full -mt-3 mb-8" />

                {/* Content */}
                <div className="w-full">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-soft-dark/60 mb-2">Breathing Assistant</div>
                  <h3 className="text-xl font-light text-soft-dark">exhale slowly</h3>
                </div>

                {/* Pulsing "Breathe" button in Coral */}
                <div className="relative flex items-center justify-center my-6">
                  {/* Ping Animation Rings */}
                  <span className="absolute h-28 w-28 rounded-full bg-soft-coral/30 animate-ping" />
                  <span className="absolute h-24 w-24 rounded-full bg-soft-coral/40 animate-pulse" />
                  <button className="relative h-20 w-20 rounded-full bg-soft-coral border border-soft-coral text-soft-dark text-sm font-semibold flex items-center justify-center shadow-soft-md cursor-pointer hover:scale-103 active:scale-95 transition-all">
                    Breathe
                  </button>
                </div>

                <div className="w-full bg-white/40 rounded-xl p-3.5 border border-stone-200/20 text-center">
                  <p className="text-xs font-medium text-soft-dark">Breathe In &middot; 4s &middot; Hold &middot; 4s</p>
                </div>
              </div>
            </div>

            {/* RIGHT PHONE: 280x580px, Sage, 80% opacity, +96px translate */}
            <div className="w-[280px] h-[580px] bg-white rounded-[2.5rem] border-[6px] border-soft-dark/90 p-4 shadow-soft-lg opacity-80 md:translate-y-24 transition-transform duration-300 hover:scale-102 flex flex-col justify-between shrink-0">
              {/* Screen Mockup Area: Sage bg */}
              <div className="flex-1 bg-soft-sage rounded-[2rem] p-5 flex flex-col justify-between items-center text-center">
                {/* Phone Speaker Notch */}
                <div className="h-4.5 w-24 bg-soft-dark/90 rounded-full -mt-2.5 mb-6" />

                {/* Content */}
                <div className="w-full text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-soft-dark/60 mb-2">Daily Journal</div>
                  <div className="text-lg font-light text-soft-dark mb-4 leading-snug">
                    "Today I disconnected for 3 hours. I walked in the garden, read 20 pages, and cooked without checking my feed once."
                  </div>
                </div>

                <div className="w-full bg-white/40 rounded-xl p-3.5 border border-stone-200/20 text-left">
                  <p className="text-xs font-bold text-soft-dark/80">Reflections</p>
                  <p className="text-[10px] text-soft-muted mt-1">Logged gently at 09:30 pm.</p>
                </div>
              </div>
            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
