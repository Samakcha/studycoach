"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AnimatedStartButton() {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link 
      href="/sign-in" 
      className="inline-block cursor-pointer pointer-events-auto"
    >
      <motion.div
        initial={{ width: 44, height: 44 }}
        whileHover={{ width: 155 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center overflow-hidden relative cursor-pointer shadow-lg"
        style={{ 
          borderRadius: 22,
          backgroundColor: "#01472e",
          boxShadow: "0 10px 25px -5px rgba(1, 71, 46, 0.3)",
        }}
      >
        <motion.div
          className="absolute"
          animate={{ 
            opacity: isHovered ? 0 : 1,
            scale: isHovered ? 0.8 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight className="text-white w-4 h-4" />
        </motion.div>
 
        <motion.div
          className="w-full flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2, delay: isHovered ? 0.1 : 0 }}
        >
          <span className="text-white text-[10px] font-bold uppercase tracking-[0.25em] whitespace-nowrap pl-1">
            Log In Now
          </span>
        </motion.div>
      </motion.div>
    </Link>
  );
}

