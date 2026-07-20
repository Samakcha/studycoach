"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function GlobalCursor() {
  const [mounted, setMounted] = useState(false);

  // Simple direct mouse position (dark orangish cursor dot)
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const opacity = useMotionValue(0);

  useEffect(() => {
    setMounted(true);

    const handlePointerMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      opacity.set(1);
    };

    const handlePointerLeave = () => {
      opacity.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [x, y, opacity]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* Mouse Follow Simple (Dark Orangish Cursor) */}
      <motion.div
        style={{
          x,
          y,
          opacity,
        }}
        className="fixed top-0 left-0 w-3.5 h-3.5 -ml-1.75 -mt-1.75 rounded-full bg-orange-600 border border-orange-700 pointer-events-none z-[99999] shadow-sm"
      />
    </div>
  );
}

// Standalone Container-based Mouse Follow Simple Component
const SimpleMouseFollow = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - bounds.left);
    y.set(e.clientY - bounds.top);
  };

  return (
    <div
      onPointerMove={(e) => {
        handlePointerMove(e);
      }}
      onPointerEnter={() => {
        opacity.set(1);
      }}
      onPointerLeave={() => {
        opacity.set(0);
      }}
      className="rounded-4xl bg-background mt-20 size-[500px] cursor-none overflow-hidden"
    >
      <motion.div
        style={{
          x,
          y,
          opacity,
        }}
        className="rounded-4xl size-5 bg-orange-600"
      ></motion.div>
    </div>
  );
};

export { SimpleMouseFollow };
