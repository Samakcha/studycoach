"use client";

import React, { useState } from "react";

export default function ModernAccess() {
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
    <section id="access" className="relative w-full border-b border-brand-border bg-brand-bg select-none">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[50vh]">
          
          {/* Left Cols 1-3: Label Sidebar */}
          <div className="col-span-12 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-brand-border p-6 sm:p-8 flex lg:flex-col lg:justify-between lg:items-start items-center justify-between">
            <span className="font-mono text-xs font-bold text-brand-muted uppercase tracking-[0.2em] lg:sticky lg:top-[112px]">
              Access // 004
            </span>
          </div>

          {/* Right Cols 4-12: Heading & CTA button */}
          <div className="col-span-12 lg:col-span-9 p-6 sm:p-8 lg:py-16 lg:px-12 flex flex-col justify-between">
            
            {/* 8xl Headline */}
            <div>
              <h2 className="font-sans text-5xl sm:text-7xl lg:text-[5.5rem] font-black uppercase text-brand-black tracking-tighter leading-[0.85] mb-6">
                Start Exploring.
              </h2>
              <p className="font-sans text-base sm:text-lg font-normal text-brand-gray leading-normal max-w-lg">
                Join the beta list. Strip away visual noise and build a paced, technical study schedule optimized for CBSE, JEE, or College.
              </p>
            </div>

            {/* Email Waitlist and CTA in bottom right */}
            <div className="mt-12 pt-8 border-t border-brand-border flex flex-col md:flex-row items-stretch md:items-end justify-between gap-6">
              
              {/* Waitlist Box */}
              <div className="w-full max-w-md">
                {submitted ? (
                  <div className="bg-brand-black text-brand-bg px-6 py-4 font-sans font-bold text-sm tracking-wider uppercase">
                    // Saved spot successfully.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 border border-brand-border bg-brand-bg/50">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER EMAIL ADDRESS"
                      className="flex-grow bg-transparent px-5 py-4 font-mono text-xs font-bold text-brand-black focus:outline-none placeholder:text-brand-muted uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-brand-blue text-brand-bg hover:bg-brand-black px-6 py-4 font-sans font-bold text-xs uppercase tracking-widest border-t sm:border-t-0 sm:border-l border-brand-border cursor-pointer transition-colors duration-200"
                    >
                      Submit
                    </button>
                  </form>
                )}
              </div>

              {/* Large Black CTA Button */}
              <div className="flex justify-end select-none">
                <button
                  onClick={() => setSubmitted(true)}
                  className="bg-brand-black text-brand-bg hover:bg-brand-blue font-sans font-bold uppercase tracking-widest text-xs sm:text-sm py-5 px-10 border-0 rounded-none transition-colors duration-300 cursor-pointer"
                >
                  Start Access Now
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
