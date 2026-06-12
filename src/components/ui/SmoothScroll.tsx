"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  useEffect(() => {
    // Dynamic import of lenis to prevent Server-Side Rendering (SSR) issues
    import("lenis").then(({ default: Lenis }) => {
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });

      // Expose to window for custom navigations/scrolling
      window.lenis = lenis;

      // Connect Lenis to GSAP ScrollTrigger updates
      lenis.on("scroll", ScrollTrigger.update);

      // Sync GSAP ticker with Lenis requestAnimationFrame (raf)
      const updatePhysics = (time: number) => {
        lenis.raf(time * 1000);
      };
      
      gsap.ticker.add(updatePhysics);
      gsap.ticker.lagSmoothing(0);

      // Refresh ScrollTrigger calculations
      ScrollTrigger.refresh();

      return () => {
        lenis.destroy();
        gsap.ticker.remove(updatePhysics);
        window.lenis = undefined;
      };
    });
  }, []);

  return null;
}
