"use client";

import React, { useEffect, useRef, useState } from "react";

interface EarthyScrollRevealProps {
  children: React.ReactNode;
  delay?: number; // Delay in milliseconds
  className?: string;
}

export default function EarthyScrollReveal({
  children,
  delay = 0,
  className = "",
}: EarthyScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px", // triggers slightly before entering the full viewport
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ${className}`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(100px)",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
