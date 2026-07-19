"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [loading, setLoading] = useState(!isHomePage);

  useEffect(() => {
    if (isHomePage) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 900); // Snappy but premium 900ms duration

    return () => clearTimeout(timer);
  }, [pathname, isHomePage]);

  // If on homepage, render directly to avoid clashing with the homepage GSAP animations/preloader
  if (isHomePage) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="page-preloader"
            initial={{ y: 0 }}
            exit={{ 
              y: "-100%", 
              transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } 
            }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden"
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
                <filter id="templateNoise">
                  <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#templateNoise)" />
              </svg>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center gap-3 relative z-10 px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(2rem, 6vw, 4rem)",
                  color: "#ccd5ae",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
                className="uppercase"
              >
                STUDYCOACH
              </motion.div>
              
              {/* Sleek loader bar */}
              <div className="w-32 h-[1.5px] bg-[#ccd5ae]/10 overflow-hidden rounded-full mt-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.75, ease: "easeInOut" }}
                  className="h-full bg-[#ccd5ae]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main page content smooth transition */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.985 }}
        animate={{ 
          opacity: loading ? 0 : 1, 
          y: loading ? 12 : 0,
          scale: loading ? 0.985 : 1
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="w-full min-h-screen flex flex-col flex-grow"
      >
        {children}
      </motion.div>
    </>
  );
}
