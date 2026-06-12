"use client";

import React, { useState } from "react";
import ScrollReveal from "./ScrollReveal";

export default function SoftWaitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="relative overflow-hidden bg-soft-bg py-24 sm:py-32 select-none border-t border-stone-200/20">
      
      {/* High-blur floating gradients for visual depth */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/4 left-1/3 h-72 w-72 rounded-full bg-[#FFE4E1]/40 blur-[90px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/3 h-80 w-80 rounded-full bg-soft-sage/40 blur-[90px] animate-float-slow-reverse" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
        
        {/* Dark Stone Rounded-Square Icon with Coral Dot */}
        <ScrollReveal>
          <div className="h-16 w-16 bg-soft-dark rounded-2xl flex items-center justify-center relative shadow-soft-md mb-8">
            {/* White abstract icon shape */}
            <div className="h-5 w-5 rounded-full border-2 border-white/80" />
            {/* Coral Dot at top-right */}
            <span className="absolute top-3.5 right-3.5 h-2 w-2 rounded-full bg-soft-coral border border-soft-dark" />
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal>
          <h2 className="font-sans text-4xl sm:text-6xl font-light text-soft-dark tracking-tight leading-none max-w-xl mx-auto">
            step into your digital sanctuary.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-soft-muted max-w-md mx-auto leading-relaxed">
            Join the waitlist to get early beta access to Bloom and build a calm relationship with your screen.
          </p>
        </ScrollReveal>

        {/* Email Waitlist Capture Form */}
        <ScrollReveal>
          {submitted ? (
            <div className="mt-10 bg-white border border-stone-200/50 rounded-2xl py-4 px-8 shadow-soft-sm text-soft-dark max-w-md font-sans font-medium text-sm animate-pulse">
              ✨ Thank you! We've saved your spot.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-10 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-full bg-stone-100/60 border border-stone-200/50 px-6 py-3.5 text-sm text-soft-dark focus:bg-white focus:outline-none focus:ring-1 focus:ring-soft-coral transition-all font-sans font-medium shadow-inner"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-soft-dark text-soft-bg rounded-full px-7 py-3.5 text-sm font-semibold hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer whitespace-nowrap"
              >
                Join waitlist
              </button>
            </form>
          )}
        </ScrollReveal>

        {/* Minimal Footer Links */}
        <div className="mt-28 w-full border-t border-stone-200/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-soft-muted max-w-5xl">
          <div className="flex items-center gap-2 select-none">
            <div className="h-4 w-4 rounded-full bg-soft-coral" />
            <span className="font-sans font-bold text-soft-dark tracking-tight">bloom</span>
            <span className="text-soft-muted/70">&copy; 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hover:text-soft-dark transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hover:text-soft-dark transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hover:text-soft-dark transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
