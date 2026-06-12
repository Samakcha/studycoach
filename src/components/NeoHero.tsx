"use client";

import React from "react";

export default function NeoHero() {
  return (
    <section className="relative overflow-hidden bg-brand-yellow bg-dots border-b-2 border-brand-black pt-16 pb-20 lg:pt-24 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Badge */}
            <div className="inline-block bg-brand-white border-2 border-brand-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-brand-black shadow-neo-sm mb-6 select-none">
              NEW: AI Content Assistant 2.0
            </div>

            {/* Giant Heading */}
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black text-brand-black leading-[0.95] tracking-tighter max-w-2xl">
              Study{" "}
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "2px #000000" }}
              >
                smarter
              </span>
              , not harder.
            </h1>

            {/* Subheadline */}
            <p className="mt-8 text-lg sm:text-xl font-sans font-medium text-brand-black/80 max-w-xl leading-relaxed">
              Upload your syllabus, get a personalised day-by-day study plan, quiz yourself, and let AI find your weak spots — automatically.
            </p>

            {/* CTA Group */}
            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto select-none">
              <button className="relative bg-brand-black text-brand-white px-8 py-4 border-2 border-brand-black rounded-xl font-heading font-black text-lg shadow-neo-lg hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-neo-md active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all duration-150 cursor-pointer text-center">
                Get started free
              </button>
              <button className="relative bg-brand-white text-brand-black px-8 py-4 border-2 border-brand-black rounded-xl font-heading font-black text-lg shadow-neo-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 cursor-pointer text-center">
                See how it works
              </button>
            </div>
            
            {/* Soft Trust Badges row */}
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 font-sans font-bold text-sm text-brand-black/70">
              <div className="flex items-center gap-2">
                <span className="text-brand-black">✦</span> No credit card required
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-black">✦</span> Free to start
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-black">✦</span> Built for Indian students
              </div>
            </div>
          </div>

          {/* Right Column: Browser Mockup */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <div className="w-full max-w-md bg-brand-white border-2 border-brand-black rounded-xl shadow-neo-xl overflow-hidden select-none">
              
              {/* Browser Header Bar */}
              <div className="h-10 bg-brand-black border-b-2 border-brand-black flex items-center px-4 justify-between">
                {/* Control Circles */}
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57] border border-black" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e] border border-black" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840] border border-black" />
                </div>
                {/* Mock URL Bar */}
                <div className="bg-brand-white/10 px-6 py-0.5 rounded text-[10px] text-brand-white/40 font-mono text-center w-48 truncate">
                  studycoach.ai/dashboard
                </div>
                {/* Dummy layout spacing */}
                <div className="w-6" />
              </div>

              {/* Dashboard Content */}
              <div className="bg-brand-white p-6 grid grid-cols-12 gap-4">
                
                {/* Sidebar Navigation mockup (Col 3) */}
                <div className="col-span-3 bg-brand-charcoal rounded-lg border-2 border-brand-black p-2.5 flex flex-col gap-3 h-48 justify-between">
                  <div className="flex flex-col gap-2.5">
                    <div className="h-4 w-full bg-brand-yellow rounded-xs border border-brand-black" />
                    <div className="h-2 w-3/4 bg-brand-sage/40 rounded-xs" />
                    <div className="h-2 w-2/3 bg-brand-sage/40 rounded-xs" />
                    <div className="h-2 w-1/2 bg-brand-sage/40 rounded-xs" />
                  </div>
                  <div className="h-4 w-4 bg-brand-sage rounded-full border border-brand-black self-center" />
                </div>

                {/* Main Dashboard Panel mockup (Col 9) */}
                <div className="col-span-9 flex flex-col gap-4">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-brand-white border-2 border-brand-black rounded-lg p-2.5 shadow-neo-sm">
                      <p className="text-[10px] uppercase font-bold text-brand-black/60">Study Streak</p>
                      <p className="text-lg font-heading font-black">12 Days</p>
                    </div>
                    <div className="bg-brand-sage border-2 border-brand-black rounded-lg p-2.5 shadow-neo-sm">
                      <p className="text-[10px] uppercase font-bold text-brand-black/60">Accuracy</p>
                      <p className="text-lg font-heading font-black">88.5%</p>
                    </div>
                  </div>

                  {/* Revenue / Focus Graph Mockup */}
                  <div className="bg-brand-white border-2 border-brand-black rounded-lg p-3 shadow-neo-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] uppercase font-bold text-brand-black/80">Weekly progress</p>
                      <span className="text-[9px] font-mono bg-brand-yellow px-1.5 py-0.5 rounded border border-brand-black">LIVE</span>
                    </div>
                    
                    {/* Vertical Bar Charts */}
                    <div className="flex items-end justify-between h-20 pt-4 border-b border-brand-black/10">
                      <div className="w-3 bg-brand-charcoal border-t-2 border-x-2 border-brand-black rounded-t-xs" style={{ height: "45%" }} />
                      <div className="w-3 bg-brand-sage border-t-2 border-x-2 border-brand-black rounded-t-xs" style={{ height: "60%" }} />
                      <div className="w-3 bg-brand-yellow border-t-2 border-x-2 border-brand-black rounded-t-xs" style={{ height: "85%" }} />
                      <div className="w-3 bg-brand-charcoal border-t-2 border-x-2 border-brand-black rounded-t-xs" style={{ height: "30%" }} />
                      <div className="w-3 bg-brand-sage border-t-2 border-x-2 border-brand-black rounded-t-xs" style={{ height: "70%" }} />
                      <div className="w-3 bg-brand-yellow border-t-2 border-x-2 border-brand-black rounded-t-xs" style={{ height: "98%" }} />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
