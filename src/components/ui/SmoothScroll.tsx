"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  useEffect(() => {
    // Dynamic import prevents SSR issues
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

        /**
         * virtualScroll is called before Lenis processes each wheel / touch event.
         * Return false  → global Lenis ignores the event; inner ScrollStack Lenis handles it.
         * Return true   → global Lenis scrolls the page.
         *
         * Rule:
         *  • Event outside a .scroll-stack-scroller           → always scroll the page.
         *  • Event inside one, inner scroll NOT at its limit  → block page scroll (inner handles it).
         *  • Event inside one, inner scroll IS at its limit   → hand off to page scroll.
         *  • We also check section alignment to ensure smooth scroll coordination.
         */
        virtualScroll: (data) => {
          const target = data.event.target as HTMLElement | null;
          if (!target) return true;

          const scroller = target.closest<HTMLElement>(".scroll-stack-scroller");
          if (!scroller) return true; // not over a scroll-stack → scroll the page

          const section = scroller.closest("section");
          if (!section) return true;

          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          const atBottom = scroller.dataset.atBottom === "true";
          const atTop    = scroller.dataset.atTop    === "true";

          if (data.deltaY > 0) {
            // Scrolling down
            if (window.scrollY < sectionTop - 5) return true; // not yet aligned -> scroll page
            if (atBottom) return true; // at bottom -> scroll page
            return false; // otherwise -> scroll inner stack
          } else {
            // Scrolling up
            if (window.scrollY > sectionTop + 5) return true; // past aligned -> scroll page
            if (atTop) return true; // at top -> scroll page
            return false; // otherwise -> scroll inner stack
          }
        },
      });

      // Expose to window for programmatic scrollTo calls
      window.lenis = lenis;

      // Keep GSAP ScrollTrigger in sync with Lenis
      lenis.on("scroll", ScrollTrigger.update);

      // Drive Lenis via GSAP's ticker (single rAF loop)
      const updatePhysics = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(updatePhysics);
      gsap.ticker.lagSmoothing(0);

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
