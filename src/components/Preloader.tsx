"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const barFill = barFillRef.current;
    const logo = logoRef.current;
    const tagline = taglineRef.current;
    const dots = dotsRef.current;
    if (!overlay || !barFill || !logo || !tagline || !dots) return;

    // Set initial states
    gsap.set([logo, tagline, dots], { opacity: 0, y: 24 });
    gsap.set(barFill, { scaleX: 0, transformOrigin: "left center" });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(overlay, {
          yPercent: -102,
          duration: 0.9,
          ease: "power3.inOut",
          onComplete,
        });
      },
    });

    tl
      // Logo entrance
      .to(logo, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" })
      .to(tagline, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.35")
      .to(dots, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.25")
      // Progress bar fills over ~2s
      .to(barFill, { scaleX: 1, duration: 2.1, ease: "power1.inOut" }, "-=0.2")
      // Hold briefly before exit
      .to({}, { duration: 0.25 });

    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden"
      style={{ backgroundColor: "#01472e" }}
    >
      {/* Ambient radial glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "20%", left: "15%", width: "40vw", height: "40vw",
          background: "radial-gradient(circle, rgba(204,213,174,0.08) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "15%", right: "10%", width: "30vw", height: "30vw",
          background: "radial-gradient(circle, rgba(254,250,224,0.05) 0%, transparent 65%)",
        }}
      />

      {/* SVG Noise texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="preloaderNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#preloaderNoise)" />
        </svg>
      </div>

      {/* Thin decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ backgroundColor: "rgba(204,213,174,0.15)" }} />

      {/* Center content */}
      <div className="flex flex-col items-center gap-5 relative z-10 px-6 text-center">

        {/* Main wordmark */}
        <div
          ref={logoRef}
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
            color: "#ccd5ae",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          STUDYCOACH
        </div>

        {/* Tagline */}
        <div
          ref={taglineRef}
          style={{
            fontFamily: "'Inter', monospace",
            fontSize: "10px",
            color: "rgba(204,213,174,0.45)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Reality-First AI Study Assistant
        </div>

        {/* Progress bar track */}
        <div
          ref={dotsRef}
          className="flex flex-col items-center gap-2 mt-2"
        >
          <div
            className="overflow-hidden rounded-full"
            style={{ width: "180px", height: "1.5px", backgroundColor: "rgba(204,213,174,0.12)" }}
          >
            <div
              ref={barFillRef}
              className="h-full w-full rounded-full"
              style={{ backgroundColor: "#ccd5ae" }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Inter', monospace",
              fontSize: "8px",
              color: "rgba(204,213,174,0.3)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Loading
          </span>
        </div>
      </div>

      {/* Bottom corner version stamp */}
      <div
        className="absolute bottom-6 right-8"
        style={{
          fontFamily: "'Inter', monospace",
          fontSize: "9px",
          color: "rgba(204,213,174,0.2)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        v0.1.0
      </div>
    </div>
  );
}
