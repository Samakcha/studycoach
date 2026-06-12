"use client";

import React, { useRef, useState, useEffect } from "react";
import { InteractiveRobotSpline } from "@/components/ui/interactive-3d-robot";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TiltedCard from "@/components/ui/TiltedCard";

interface EarthyHeroProps {
  revealed?: boolean;
}

export default function EarthyHero({ revealed = false }: EarthyHeroProps) {
  const title1 = "STUDY";
  const title2 = "COACH";

  const letterARef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [robotOffset, setRobotOffset] = useState<number>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (letterARef.current && containerRef.current) {
        const aRect = letterARef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Center of letter 'A' in viewport coordinates
        const aCenter = aRect.left + aRect.width / 2;
        // Center of the main container in viewport coordinates
        const containerCenter = containerRect.left + containerRect.width / 2;
        
        // Calculate horizontal offset required to align the robot's container center with 'A'
        const diff = aCenter - containerCenter;
        setRobotOffset(diff);
      }
    };

    // Run position calculations immediately and on resize
    updatePosition();
    window.addEventListener("resize", updatePosition);

    // Run calculations at intervals to handle potential layout adjustments during animation/font loading
    const timers = [
      setTimeout(updatePosition, 50),
      setTimeout(updatePosition, 150),
      setTimeout(updatePosition, 300),
      setTimeout(updatePosition, 600),
      setTimeout(updatePosition, 1200),
      setTimeout(updatePosition, 2000),
      setTimeout(updatePosition, 4000),
    ];

    return () => {
      window.removeEventListener("resize", updatePosition);
      timers.forEach(clearTimeout);
    };
  }, []);

  // Parallax Mouse Event Listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth / 2) / 35;
      const y = (clientY - window.innerHeight / 2) / 35;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth Scroll Trigger Function
  const scrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      // Calculate the correct ScrollTrigger-aware scroll position
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
      });
      const scrollPos = st.start;
      st.kill();

      const lenis = window.lenis;
      if (lenis) {
        lenis.scrollTo(scrollPos);
      } else {
        window.scrollTo({ top: scrollPos, behavior: "smooth" });
      }
    }
  };

  return (
    <section 
      id="hero"
      data-flow-section
      className="relative w-full min-h-screen overflow-hidden select-none"
      style={{ backgroundColor: "#ccd5ae" }}
    >
      <div 
        ref={containerRef}
        className="flow-art-container relative flex min-h-screen w-full flex-col justify-between px-8 md:px-16 pt-32 pb-32 will-change-transform"
        style={{ backgroundColor: "#ccd5ae", transformOrigin: "bottom left" }}
      >
        
        {/* Hero Centerpiece: Massive 'Anton' text */}
        <div className="flex-grow flex flex-col justify-center items-center py-12 relative z-10">
          <h1 
            className="font-display text-[15vw] sm:text-[17vw] md:text-[19vw] leading-[0.85] tracking-[-0.05em] text-center select-none"
            style={{ color: "#01472e" }}
          >
            {/* Row 1: STUDY */}
            <span className="block overflow-hidden py-[0.08em] -my-[0.08em] px-4">
              {title1.split("").map((char, index) => (
                <span
                  key={`t1-${index}`}
                  className={revealed ? "animate-reveal-letter" : "opacity-0"}
                  style={revealed ? { animationDelay: `${index * 0.05}s` } : {}}
                >
                  {char}
                </span>
              ))}
            </span>
            {/* Row 2: COACH */}
            <span className="block overflow-hidden py-[0.08em] -my-[0.08em] px-4">
              {title2.split("").map((char, index) => (
                <span
                  key={`t2-${index}`}
                  ref={index === 2 ? letterARef : undefined}
                  className={revealed ? "animate-reveal-letter inline-block" : "opacity-0 inline-block"}
                  style={revealed ? { animationDelay: `${(title1.length + index) * 0.05}s` } : {}}
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>
        </div>

        {/* Floating Showcase Cards (z-30, absolutely positioned, supporting visual depth) */}
        
        {/* Top-Left: AI Study Plan */}
        <div 
          onClick={() => scrollToSection("cycle")}
          className="absolute top-[8%] left-[2%] md:top-[13%] md:left-[4%] lg:left-[8%] z-30 animate-float-1 select-none cursor-pointer hidden md:block w-[190px] h-[170px] md:w-[250px] md:h-[220px] lg:w-[280px] lg:h-[250px] transition-opacity duration-700"
          style={{ opacity: revealed ? 1 : 0, transitionDelay: revealed ? "0.25s" : "0s" }}
        >
          <div
            className="w-full h-full"
            style={{
              transform: `translate3d(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px, 0)`,
              transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            <TiltedCard
            containerWidth="100%"
            containerHeight="100%"
            imageWidth="100%"
            imageHeight="100%"
            scaleOnHover={1.06}
            rotateAmplitude={10}
            showTooltip={false}
            displayOverlayContent={true}
            overlayContent={
              <div className="w-full h-full p-4.5 md:p-6 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5.5 h-5.5 rounded-md bg-[#01472e]/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#01472e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="font-mono text-[9px] md:text-[10px] font-bold text-[#01472e]/70 uppercase tracking-wider">Plan // Calendar</span>
                  </div>
                  
                  <div className="space-y-2.5 md:space-y-3.5">
                    <div>
                      <div className="flex justify-between items-center text-[10px] md:text-[11px] font-extrabold text-[#01472e] mb-1">
                        <span>Ch. 3 Calculus</span>
                        <span className="text-[#01472e]/70 font-mono font-bold">90%</span>
                      </div>
                      <div className="w-full h-1.5 md:h-2 bg-[#01472e]/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#01472e] rounded-full" style={{ width: "90%" }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center text-[10px] md:text-[11px] font-extrabold text-[#01472e] mb-1">
                        <span>Ch. 4 Vectors</span>
                        <span className="text-[#01472e]/70 font-mono font-bold">45%</span>
                      </div>
                      <div className="w-full h-1.5 md:h-2 bg-[#01472e]/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#a3b18a] rounded-full" style={{ width: "45%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow button at the bottom */}
                <div className="flex justify-between items-center pt-2.5 border-t border-[#01472e]/10 mt-2">
                  <span className="text-[9px] md:text-[10px] font-bold text-[#01472e]/50 uppercase tracking-wider">Explore Workflow</span>
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#01472e] text-cream flex items-center justify-center shadow-sm hover:bg-[#01472e]/90 transition-colors duration-200">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            }
          />
          </div>
        </div>

        {/* Top-Right: Progress Analytics Dashboard */}
        <div 
          onClick={() => scrollToSection("counsels")}
          className="absolute top-[10%] right-[2%] md:top-[15%] md:right-[4%] lg:right-[8%] z-30 animate-float-2 select-none cursor-pointer hidden md:block w-[200px] h-[160px] md:w-[260px] md:h-[210px] lg:w-[290px] lg:h-[240px] transition-opacity duration-700"
          style={{ opacity: revealed ? 1 : 0, transitionDelay: revealed ? "0.35s" : "0s" }}
        >
          <div
            className="w-full h-full"
            style={{
              transform: `translate3d(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px, 0)`,
              transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            <TiltedCard
            containerWidth="100%"
            containerHeight="100%"
            imageWidth="100%"
            imageHeight="100%"
            scaleOnHover={1.06}
            rotateAmplitude={10}
            showTooltip={false}
            displayOverlayContent={true}
            overlayContent={
              <div className="w-full h-full p-4.5 md:p-6 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5.5 h-5.5 rounded-md bg-[#01472e]/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#01472e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-mono text-[9px] md:text-[10px] font-bold text-[#01472e]/70 uppercase tracking-wider">Analytics // Map</span>
                  </div>
                  
                  <div className="flex items-end gap-3 justify-between my-2">
                    <div className="flex flex-col">
                      <span className="font-mono text-[8px] md:text-[9px] font-bold text-[#01472e]/50 uppercase tracking-wider">Accuracy</span>
                      <span className="font-sans text-xl md:text-2xl font-black text-[#01472e] tracking-tight leading-none">92.4%</span>
                    </div>
                    
                    {/* Sparkline wave chart */}
                    <div className="w-20 md:w-24 h-10 md:h-12">
                      <svg className="w-full h-full" viewBox="0 0 100 40">
                        <path 
                          d="M0 35 Q15 25, 30 28 T60 12 T100 5" 
                          fill="none" 
                          stroke="#01472e" 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                        />
                        <circle cx="100" cy="5" r="3.5" fill="#01472e" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Arrow button at the bottom */}
                <div className="flex justify-between items-center pt-2.5 border-t border-[#01472e]/10 mt-2">
                  <span className="text-[9px] md:text-[10px] font-bold text-[#01472e]/50 uppercase tracking-wider">Meet Agents</span>
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#01472e] text-cream flex items-center justify-center shadow-sm hover:bg-[#01472e]/90 transition-colors duration-200">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            }
          />
          </div>
        </div>

        {/* Bottom-Left: Smart Quiz Generator */}
        <div 
          onClick={() => scrollToSection("features")}
          className="absolute bottom-[14%] left-[1.5%] md:bottom-[20%] md:left-[3%] lg:left-[7%] z-30 animate-float-3 select-none cursor-pointer hidden md:block w-[195px] h-[170px] md:w-[255px] md:h-[220px] lg:w-[285px] lg:h-[250px] transition-opacity duration-700"
          style={{ opacity: revealed ? 1 : 0, transitionDelay: revealed ? "0.45s" : "0s" }}
        >
          <div
            className="w-full h-full"
            style={{
              transform: `translate3d(${mousePos.x * -0.7}px, ${mousePos.y * -0.7}px, 0)`,
              transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            <TiltedCard
            containerWidth="100%"
            containerHeight="100%"
            imageWidth="100%"
            imageHeight="100%"
            scaleOnHover={1.06}
            rotateAmplitude={10}
            showTooltip={false}
            displayOverlayContent={true}
            overlayContent={
              <div className="w-full h-full p-4.5 md:p-6 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5.5 h-5.5 rounded-md bg-[#01472e]/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#01472e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h0a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span className="font-mono text-[9px] md:text-[10px] font-bold text-[#01472e]/70 uppercase tracking-wider">Quiz // Recall</span>
                  </div>
                  
                  <div className="space-y-2 text-left my-1">
                    <p className="font-sans text-[10px] md:text-[11px] lg:text-[12px] font-extrabold text-[#01472e] leading-snug">"Define active recall interval?"</p>
                    <div className="flex gap-1.5 md:gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#01472e]/10 border border-[#01472e]/10">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#01472e]" />
                        <span className="font-sans text-[9px] md:text-[10px] font-extrabold text-[#01472e] uppercase tracking-wider">Spaced</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/20 border border-[#01472e]/5">
                        <div className="w-2.5 h-2.5 rounded-full border border-[#01472e]/30" />
                        <span className="font-sans text-[9px] md:text-[10px] font-bold text-[#01472e]/60 uppercase tracking-wider">Linear</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow button at the bottom */}
                <div className="flex justify-between items-center pt-2.5 border-t border-[#01472e]/10 mt-2">
                  <span className="text-[9px] md:text-[10px] font-bold text-[#01472e]/50 uppercase tracking-wider">View Features</span>
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#01472e] text-cream flex items-center justify-center shadow-sm hover:bg-[#01472e]/90 transition-colors duration-200">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            }
          />
          </div>
        </div>

        {/* Bottom-Right: Exam Readiness Score */}
        <div 
          onClick={() => scrollToSection("access")}
          className="absolute bottom-[12%] right-[1.5%] md:bottom-[18%] md:right-[3%] lg:right-[7%] z-30 animate-float-4 select-none cursor-pointer hidden md:block w-[180px] h-[150px] md:w-[240px] md:h-[190px] lg:w-[270px] lg:h-[220px] transition-opacity duration-700"
          style={{ opacity: revealed ? 1 : 0, transitionDelay: revealed ? "0.55s" : "0s" }}
        >
          <div
            className="w-full h-full"
            style={{
              transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`,
              transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            <TiltedCard
            containerWidth="100%"
            containerHeight="100%"
            imageWidth="100%"
            imageHeight="100%"
            scaleOnHover={1.06}
            rotateAmplitude={10}
            showTooltip={false}
            displayOverlayContent={true}
            overlayContent={
              <div className="w-full h-full p-4.5 md:p-6 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5.5 h-5.5 rounded-md bg-[#01472e]/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#01472e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <span className="font-mono text-[9px] md:text-[10px] font-bold text-[#01472e]/70 uppercase tracking-wider">Readiness // Score</span>
                  </div>
                  
                  <div className="flex items-center gap-3.5 my-1.5">
                    {/* Radial donut chart */}
                    <div className="relative w-11 h-11 md:w-13 md:h-13 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(1, 71, 46, 0.08)" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#01472e" strokeWidth="3.2" strokeDasharray="95 5" strokeLinecap="round" />
                      </svg>
                      <span className="absolute font-sans text-[10px] md:text-[11px] font-black text-[#01472e]">95%</span>
                    </div>
                    
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-mono text-[8px] font-bold text-[#01472e]/50 uppercase tracking-wider">Status</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#01472e] text-cream font-sans text-[8px] md:text-[9px] font-extrabold uppercase tracking-widest">READY</span>
                    </div>
                  </div>
                </div>

                {/* Arrow button at the bottom */}
                <div className="flex justify-between items-center pt-2.5 border-t border-[#01472e]/10 mt-2">
                  <span className="text-[9px] md:text-[10px] font-bold text-[#01472e]/50 uppercase tracking-wider">Join Portal</span>
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#01472e] text-cream flex items-center justify-center shadow-sm hover:bg-[#01472e]/90 transition-colors duration-200">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            }
          />
          </div>
        </div>

        {/* Interactive 3D Robot Spline */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] z-20 pointer-events-auto earthy-robot-filter transition-opacity duration-700"
          style={{
            transform: `scale(0.8) translateX(${robotOffset}px) translateY(6vh)`,
            transformOrigin: "bottom center",
            opacity: revealed ? 1 : 0,
            transitionDelay: revealed ? "0.1s" : "0s",
          }}
        >
          <InteractiveRobotSpline
            scene="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"
            className="w-full h-full"
          />
        </div>

      </div>
    </section>
  );
}


