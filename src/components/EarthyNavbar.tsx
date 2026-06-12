"use client";

import React from "react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, HelpCircle, Sparkles, Users, UserPlus } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface EarthyNavbarProps {
  cartCount: number;
}

export default function EarthyNavbar({ cartCount }: EarthyNavbarProps) {
  const navItems = [
    { name: "Home", url: "#hero", icon: Home },
    { name: "Features", url: "#features", icon: Sparkles },
    { name: "Agents", url: "#cycle", icon: HelpCircle },
    { name: "Counsels", url: "#counsels", icon: Users },
    { name: "Join", url: "#access", icon: UserPlus },
  ];

  return (
    <>
      {/* Top bar for Brand Logo and Cart Button */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 select-none pointer-events-none">
        
        {/* Left: Logo in bold uppercase with hyphen prefix */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display text-xl md:text-2xl text-forest font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity pointer-events-auto"
          style={{ color: "#01472e" }}
        >
          -STUDYCOACH
        </div>

        {/* Right: Start Now CTA button in a white pill */}
        <div className="flex items-center pointer-events-auto">
          <button 
            className="flex items-center justify-center bg-white border border-forest/15 px-6 py-2.5 rounded-full shadow-2xl transition-transform active:scale-95 cursor-pointer hover:shadow-forest/5"
            style={{ 
              boxShadow: "0 25px 50px -12px rgba(1, 71, 46, 0.15)",
            }}
            onClick={() => {
              const el = document.getElementById("access");
              if (el) {
                if (typeof window !== "undefined") {
                  gsap.registerPlugin(ScrollTrigger);
                  const tempTrigger = ScrollTrigger.create({
                    trigger: el,
                    start: "top top",
                  });
                  const targetScroll = tempTrigger.start;
                  tempTrigger.kill();
                  window.scrollTo({
                    top: targetScroll,
                    behavior: "smooth",
                  });
                } else {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }
            }}
          >
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-forest" style={{ color: "#01472e" }}>
              START NOW
            </span>
          </button>
        </div>

      </nav>

      {/* Floating tubelight navbar component */}
      <NavBar items={navItems} />
    </>
  );
}
