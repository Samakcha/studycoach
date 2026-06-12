"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, X } from "lucide-react";
import EarthyScrollReveal from "./EarthyScrollReveal";

export default function EarthyCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Smooth scroll helper to redirect VIEW DEMO to the counsels simulator
  const handleViewDemo = () => {
    const el = document.getElementById("counsels");
    if (el) {
      // Calculate the correct ScrollTrigger-aware scroll position
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
      });
      const scrollPos = st.start;
      st.kill();

      const lenis = window.lenis;
      if (lenis) {
        lenis.scrollTo(scrollPos);
      } else {
        window.scrollTo({ top: scrollPos, behavior: "smooth" });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setSubmitted(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset inputs after exit animation completes
    setTimeout(() => {
      setName("");
      setEmail("");
      setSubmitted(false);
    }, 300);
  };

  return (
    <section 
      id="access"
      data-flow-section
      className="relative w-full min-h-screen overflow-hidden select-none"
      style={{ backgroundColor: "#a3b18a" }}
    >
      <div 
        className="flow-art-container relative flex min-h-screen w-full flex-col justify-between rounded-t-[5rem] px-6 md:px-12 py-24 will-change-transform"
        style={{ backgroundColor: "#fefae0", transformOrigin: "bottom left" }}
      >
        <EarthyScrollReveal>
          <div 
            className="mx-auto max-w-6xl rounded-[5rem] p-12 md:p-20 text-center flex flex-col items-center justify-center relative overflow-hidden"
            style={{
              backgroundColor: "#01472e",
              boxShadow: "0 40px 80px -20px rgba(1, 71, 46, 0.4)",
            }}
          >
            {/* Subtle decorative background organic shape */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-forest/10 pointer-events-none z-0" />

            <div className="relative z-10 max-w-3xl flex flex-col items-center">
              
              {/* Header Badge */}
              <div 
                className="inline-block px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.25em] mb-8"
                style={{ 
                  backgroundColor: "rgba(204, 213, 174, 0.15)",
                  color: "#ccd5ae",
                  border: "1px solid rgba(204, 213, 174, 0.2)"
                }}
              >
                TAKE CONTROL
              </div>

              {/* Massive Anton Headline */}
              <h2 
                className="font-display text-[7vw] md:text-[8vw] leading-[0.85] tracking-[-0.03em] uppercase mb-8"
                style={{ color: "#ccd5ae" }}
              >
                STOP MANAGING.
                <br />
                <span style={{ color: "#fefae0" }}>LET AI DO IT.</span>
              </h2>

              {/* Description */}
              <p 
                className="font-sans text-xs md:text-sm font-medium leading-relaxed max-w-md mb-12"
                style={{ color: "rgba(254, 250, 224, 0.85)" }}
              >
                Join 12,000+ high-achieving students who have reclaimed their calendar, isolated their study gaps, and boosted board and competitive exam scores.
              </p>

              {/* Premium Buttons with Framer Motion Hovers */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4.5 w-full sm:w-auto font-sans relative z-10">
                <motion.button 
                  onClick={() => setIsModalOpen(true)}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    backgroundColor: "#01472e",
                    color: "#fefae0",
                    borderColor: "#01472e",
                    boxShadow: "0 20px 40px -10px rgba(1, 71, 46, 0.3)" 
                  }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  className="w-full sm:w-auto text-forest font-bold uppercase tracking-[0.25em] text-[10px] md:text-xs px-8 py-4.5 rounded-full shadow-lg border border-transparent"
                  style={{ 
                    backgroundColor: "#ccd5ae", 
                    color: "#01472e",
                    cursor: "pointer"
                  }}
                >
                  GET STARTED FREE
                </motion.button>
                
                <motion.button 
                  onClick={handleViewDemo}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    backgroundColor: "#fefae0",
                    borderColor: "#fefae0",
                    color: "#01472e",
                    boxShadow: "0 20px 40px -10px rgba(254, 250, 224, 0.3)" 
                  }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  className="w-full sm:w-auto bg-transparent border text-white font-bold uppercase tracking-[0.25em] text-[10px] md:text-xs px-8 py-4.5 rounded-full"
                  style={{ 
                    borderColor: "rgba(254, 250, 224, 0.3)",
                    color: "#fefae0",
                    cursor: "pointer"
                  }}
                >
                  VIEW DEMO
                </motion.button>
              </div>
            </div>
          </div>
        </EarthyScrollReveal>
      </div>

      {/* Waitlist Modal Box */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-forest/50 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              className="bg-cream border border-forest/10 p-8 md:p-10 rounded-[2.5rem] w-[95%] max-w-[440px] shadow-2xl relative text-center z-10"
              style={{ backgroundColor: "#fefae0" }}
            >
              {/* Close Button */}
              <motion.button 
                onClick={handleCloseModal}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "#01472e",
                  color: "#fefae0",
                  borderColor: "#01472e"
                }}
                whileTap={{ scale: 0.98 }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300"
                style={{
                  borderColor: "rgba(1, 71, 46, 0.1)",
                  color: "#01472e",
                  cursor: "pointer"
                }}
              >
                <X className="w-4 h-4" />
              </motion.button>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-mono text-[9px] font-bold text-forest/50 uppercase tracking-widest block mb-2">Waitlist Signup</span>
                    <h3 className="font-sans text-xl md:text-2xl font-extrabold text-forest uppercase tracking-tight leading-none mb-4">
                      Get Early Access
                    </h3>
                    <p className="font-sans text-xs text-forest/70 leading-relaxed mb-6">
                      Join the waitlist to receive invitations to early developer builds, alpha releases, and beta access to the academic board.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                      <div>
                        <label className="font-mono text-[8px] font-bold text-forest/60 uppercase tracking-wider block mb-1">Your Name</label>
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe" 
                          className="w-full bg-white/40 border border-forest/15 rounded-xl px-4 py-3 text-xs font-semibold text-forest focus:outline-none focus:border-forest focus:bg-white/60 transition-all duration-300 placeholder:text-forest/30"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] font-bold text-forest/60 uppercase tracking-wider block mb-1">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com" 
                          className="w-full bg-white/40 border border-forest/15 rounded-xl px-4 py-3 text-xs font-semibold text-forest focus:outline-none focus:border-forest focus:bg-white/60 transition-all duration-300 placeholder:text-forest/30"
                        />
                      </div>
                      <motion.button 
                        type="submit"
                        whileHover={{ 
                          scale: 1.02, 
                          y: -1,
                          backgroundColor: "#ccd5ae",
                          color: "#01472e"
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-cream font-bold uppercase tracking-[0.25em] text-[10px] md:text-xs py-4.5 rounded-xl cursor-pointer shadow-md hover:shadow-lg mt-4 flex justify-center items-center border border-transparent"
                        style={{ 
                          backgroundColor: "#01472e", 
                          color: "#fefae0",
                          cursor: "pointer"
                        }}
                      >
                        SUBMIT WAITLIST REQUEST
                      </motion.button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="py-6 flex flex-col items-center justify-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center mb-5 shadow-lg shadow-forest/20 text-cream" style={{ backgroundColor: "#01472e" }}>
                      <Check className="w-7 h-7" />
                    </div>
                    <h3 className="font-sans text-xl md:text-2xl font-extrabold text-forest uppercase tracking-tight leading-none mb-3">
                      You're on the list!
                    </h3>
                    <p className="font-sans text-xs text-forest/75 leading-relaxed max-w-[280px]">
                      Thanks for applying, <strong>{name}</strong>. We've registered <strong>{email}</strong> for beta updates. Watch your inbox soon.
                    </p>
                    <motion.button 
                      type="button"
                      onClick={handleCloseModal}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -1,
                        backgroundColor: "#01472e",
                        color: "#fefae0",
                        borderColor: "#01472e"
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="border text-forest font-mono text-[9px] uppercase tracking-wider font-extrabold px-6 py-2 rounded-full mt-8 transition-all duration-300"
                      style={{ 
                        borderColor: "rgba(1, 71, 46, 0.1)",
                        color: "#01472e",
                        cursor: "pointer"
                      }}
                    >
                      Close Window
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
