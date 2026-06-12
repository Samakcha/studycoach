"use client";

import React from "react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, HelpCircle, Sparkles, Users, UserPlus } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedStartButton from "./ui/AnimatedStartButton";

interface EarthyNavbarProps {
  cartCount: number;
}

export default function EarthyNavbar({ cartCount }: EarthyNavbarProps) {
  const navItems = [
    { name: "Home", url: "#hero", icon: Home },
    { name: "Features", url: "#features", icon: Sparkles },
    { name: "Workflow", url: "#cycle", icon: HelpCircle },
    { name: "Agents", url: "#counsels", icon: Users },
    { name: "Join", url: "#access", icon: UserPlus },
  ];

  return (
    <>
      {/* Top bar for Brand Logo and Cart Button */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 select-none pointer-events-none">
        
        {/* Left: Logo in bold uppercase with hyphen prefix */}
        <div 
          onClick={() => {
            const lenis = window.lenis;
            if (lenis) {
              lenis.scrollTo(0);
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="font-display text-xl md:text-2xl text-forest font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity pointer-events-auto"
          style={{ color: "#01472e" }}
        >
          STUDYCOACH
        </div>

        {/* Right: Start Now CTA button in a white pill */}
        <div className="flex items-center pointer-events-auto">
          <AnimatedStartButton />
        </div>

      </nav>

      {/* Floating tubelight navbar component */}
      <NavBar items={navItems} />
    </>
  );
}
