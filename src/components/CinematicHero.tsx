"use client";

import React from "react";

export default function CinematicHero() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black text-white select-none">
      
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
      >
        <source
          src="https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4"
          type="video/mp4"
        />
      </video>

      {/* Cinematic dark overlays to guarantee contrast and readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/60 z-10" />

      {/* Content Area */}
      <div className="relative z-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Badge Indicator */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-md border border-white/20 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Cinematic AI Experience
        </div>

        {/* Main Header */}
        <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase leading-none max-w-4xl">
          Study Smarter,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400">
            Not Harder.
          </span>
        </h1>

        {/* Sub-paragraph */}
        <p className="mt-8 text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light">
          Upload your syllabus, get a personalised day-by-day study plan, quiz yourself, and let AI find your weak spots — automatically.
        </p>

        {/* Dual Actions buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4.5 w-full sm:w-auto font-sans">
          <button className="w-full sm:w-auto bg-white text-black hover:bg-white/95 px-8 py-4 text-sm font-semibold rounded-none uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
            Get Started Free
          </button>
          <button className="w-full sm:w-auto bg-transparent border border-white/30 text-white hover:bg-white/10 px-8 py-4 text-sm font-semibold rounded-none uppercase tracking-wider transition-all duration-300 cursor-pointer">
            See How It Works
          </button>
        </div>

      </div>
    </section>
  );
}
