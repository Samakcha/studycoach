"use client";

import React from "react";
import { motion } from "framer-motion";

interface TextRollProps {
  children: string;
  className?: string;
  center?: boolean;
  duration?: number;
  onClick?: () => void;
}

export const TextRoll: React.FC<TextRollProps> = ({
  children,
  className = "",
  center = false,
  duration = 0.4,
  onClick,
}) => {
  const letters = Array.from(children);

  return (
    <motion.div
      onClick={onClick}
      initial="initial"
      whileHover="hover"
      className={`relative inline-flex overflow-hidden cursor-pointer select-none ${
        center ? "justify-center" : ""
      } ${className}`}
    >
      <div className="flex flex-wrap overflow-hidden leading-tight">
        {letters.map((letter, i) => (
          <div key={i} className="relative overflow-hidden inline-block">
            {/* Primary visible character */}
            <motion.span
              variants={{
                initial: { y: "0%" },
                hover: { y: "-100%" },
              }}
              transition={{
                duration: duration,
                ease: [0.33, 1, 0.68, 1],
                delay: i * 0.025,
              }}
              className="inline-block"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>

            {/* Rolling character coming from below on hover */}
            <motion.span
              variants={{
                initial: { y: "100%" },
                hover: { y: "0%" },
              }}
              transition={{
                duration: duration,
                ease: [0.33, 1, 0.68, 1],
                delay: i * 0.025,
              }}
              className="absolute left-0 top-0 inline-block"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const Skiper58: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <TextRoll className="text-2xl font-bold">Hover me</TextRoll>
      <TextRoll className="text-4xl font-extrabold" center>
        Centered Animation
      </TextRoll>
    </div>
  );
};
