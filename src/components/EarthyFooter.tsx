"use client";

import React from "react";
import EarthyScrollReveal from "./EarthyScrollReveal";

export default function EarthyFooter() {
  return (
    <section 
      id="footer"
      data-flow-section
      className="relative w-full min-h-screen overflow-hidden select-none"
      style={{ backgroundColor: "#fefae0" }}
    >
      <div 
        className="flow-art-container relative flex min-h-screen w-full flex-col justify-center items-center rounded-t-[5rem] px-6 md:px-12 py-24 will-change-transform"
        style={{ backgroundColor: "#01472e", color: "#ccd5ae", transformOrigin: "bottom left" }}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-4xl">
          
          <EarthyScrollReveal>
            <h2 
              className="font-display text-[12vw] md:text-[10vw] leading-none tracking-tight uppercase"
              style={{ color: "#fefae0" }}
            >
              -STUDYCOACH
            </h2>
          </EarthyScrollReveal>

          <EarthyScrollReveal delay={100}>
            <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-80 max-w-xl">
              © 2026 STUDYCOACH INC.
            </p>
          </EarthyScrollReveal>

          <EarthyScrollReveal delay={200}>
            <div className="flex items-center gap-12 pt-4 font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">
              <a 
                href="#hero" 
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-[#fefae0] transition-colors duration-300"
                style={{ color: "#ccd5ae" }}
              >
                TWITTER
              </a>
              <a 
                href="#hero" 
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-[#fefae0] transition-colors duration-300"
                style={{ color: "#ccd5ae" }}
              >
                GITHUB
              </a>
              <a 
                href="#hero" 
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-[#fefae0] transition-colors duration-300"
                style={{ color: "#ccd5ae" }}
              >
                TELEGRAM
              </a>
            </div>
          </EarthyScrollReveal>

        </div>
      </div>
    </section>
  );
}
