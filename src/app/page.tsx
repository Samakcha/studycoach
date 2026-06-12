"use client";

import React, { useState } from "react";
import EarthyNavbar from "@/components/EarthyNavbar";
import EarthyHero from "@/components/EarthyHero";
import EarthyFeatures from "@/components/EarthyFeatures";
import EarthyCycle from "@/components/EarthyCycle";
import EarthyPersonas from "@/components/EarthyPersonas";
import EarthyCTA from "@/components/EarthyCTA";
import EarthyFooter from "@/components/EarthyFooter";
import FlowArt from "@/components/ui/story-scroll";

export default function Home() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="relative min-h-screen flex flex-col antialiased selection:bg-forest selection:text-cream">
      
      {/* Persistent SVG Noise Overlay (4% opacity) */}
      <div className="pointer-events-none fixed inset-0 z-[999] opacity-[0.04] select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.75" 
              numOctaves="3" 
              stitchTiles="stitch" 
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Navigation pill and cart counter */}
      <EarthyNavbar cartCount={cartCount} />
      
      {/* Main stacked sections */}
      <main className="flex-grow">
        <FlowArt>
          <EarthyHero />
          <EarthyFeatures onAddToCart={() => setCartCount((prev) => prev + 1)} />
          <EarthyCycle />
          <EarthyPersonas />
          <EarthyCTA />
          <EarthyFooter />
        </FlowArt>
      </main>



    </div>
  );
}


