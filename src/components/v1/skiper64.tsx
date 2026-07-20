"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextRoll } from "@/components/v1/skiper58";

const LOGO_SPRING = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

const INITIAL_STATE = {
  y: 0,
  width: 56,
  height: 56,
  borderRadius: 28,
};

const ANIMATED_STATE = {
  y: -10,
  width: 210,
  height: 220,
  borderRadius: 24,
  transition: {
    ...LOGO_SPRING,
    delay: 0.08,
    y: {
      ...LOGO_SPRING,
      delay: 0,
    },
  },
};

export const SkiperGooeyFilterProvider = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none fixed bottom-0 left-0 w-0 h-0"
      version="1.1"
    >
      <defs>
        <filter id="SkiperGooeyFilter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4.4" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7"
            result="SkiperGooeyFilter"
          />
          <feBlend in="SourceGraphic" in2="SkiperGooeyFilter" />
        </filter>
      </defs>
    </svg>
  );
};

export const GooeyStickyMenu = ({
  onNavigate,
  onOpenProfile,
}: {
  onNavigate?: (id: string) => void;
  onOpenProfile?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SkiperGooeyFilterProvider />

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
        <div
          className="relative flex items-center justify-end"
          style={{
            filter: "url(#SkiperGooeyFilter)",
          }}
        >
          {/* Gooey Expanding Background Blob with 3D Depth Shadow */}
          <motion.div
            initial={INITIAL_STATE}
            animate={isOpen ? ANIMATED_STATE : INITIAL_STATE}
            className="bg-[#01472e] absolute right-0 bottom-0 shadow-[0_16px_40px_rgba(1,71,46,0.45)] border border-[#ccd5ae]/20"
          />

          {/* Gooey Trigger Button Circle with 3D Elevation Shadow */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen((prev) => !prev)}
            className="bg-[#01472e] text-[#fefae0] w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-[0_10px_25px_rgba(1,71,46,0.5)] border-2 border-[#ccd5ae]/30 hover:border-[#ccd5ae]/60 relative z-20 transition-all duration-200"
          >
            <span className="font-sans text-xs font-extrabold uppercase tracking-wider text-shadow">
              {isOpen ? "✕" : "MENU"}
            </span>
          </motion.button>
        </div>

        {/* Menu Items Content Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-14 right-3 z-30 p-4 text-left w-48 space-y-2 text-[#fefae0]"
            >
              <div className="flex flex-col space-y-2 font-sans font-bold text-xs">
                <TextRoll
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setIsOpen(false);
                  }}
                  className="text-[#fefae0] hover:text-[#ccd5ae] py-0.5"
                >
                  Overview
                </TextRoll>

                <TextRoll
                  onClick={() => {
                    onNavigate?.("active-modules");
                    setIsOpen(false);
                  }}
                  className="text-[#fefae0] hover:text-[#ccd5ae] py-0.5"
                >
                  Active Modules
                </TextRoll>

                <TextRoll
                  onClick={() => {
                    onNavigate?.("study-plan");
                    setIsOpen(false);
                  }}
                  className="text-[#fefae0] hover:text-[#ccd5ae] py-0.5"
                >
                  Today's Study Plan
                </TextRoll>

                <TextRoll
                  onClick={() => {
                    onNavigate?.("ai-coach");
                    setIsOpen(false);
                  }}
                  className="text-[#fefae0] hover:text-[#ccd5ae] py-0.5"
                >
                  AI Study Coach
                </TextRoll>

                <TextRoll
                  onClick={() => {
                    onOpenProfile?.();
                    setIsOpen(false);
                  }}
                  className="text-[#fefae0] hover:text-[#ccd5ae] py-0.5"
                >
                  Student Profile
                </TextRoll>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const Skiper64 = GooeyStickyMenu;
