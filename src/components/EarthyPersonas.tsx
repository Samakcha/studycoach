"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Award, CheckCircle2, AlertCircle } from "lucide-react";
import EarthyScrollReveal from "./EarthyScrollReveal";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  num: string;
  agent: string;
  title: string;
  desc: string;
  focus: string;
}

const steps: Step[] = [
  {
    num: "01",
    agent: "THE STRATEGIST",
    title: "Syllabus Optimizer",
    desc: "Upload syllabi, notes, or PDFs to instantly extract chapters, weightage, and high-yield study topics. Constructs custom learning roadmaps and maps progress heatmaps automatically.",
    focus: "Board/JEE Pacing",
  },
  {
    num: "02",
    agent: "THE ANNOTATOR",
    title: "Reference Parser",
    desc: "Animate raw textbook and note uploads into active study guides. Extracts formulas, definitions, active recall lists, and comprehensive chapter summaries automatically.",
    focus: "Syllabus Deconstruction",
  },
  {
    num: "03",
    agent: "THE ANALYST",
    title: "Diagnostic Guide",
    desc: "Tracks accuracy scores across study modules to detect learning gaps. Builds interactive error graphs and delivers strategic review suggestions to target weaknesses.",
    focus: "Error Mapping",
  },
  {
    num: "04",
    agent: "THE SOCRATIC",
    title: "Recall Tester",
    desc: "Grolls you on conceptual fundamentals using AI-generated active recall prompts. Evaluates answers in real-time, scores accuracy, and dynamically updates review intervals.",
    focus: "Conceptual Clarity",
  },
  {
    num: "05",
    agent: "THE NUDGER",
    title: "Schedule Pacer",
    desc: "Monitors daily learning rates and adjusts study schedules dynamically. Automatically reshuffles calendars around mock exams and target deadlines.",
    focus: "Pacing Enforcement",
  },
];

// Mockup 1: Syllabus Optimizer
function SyllabusOptimizerMockup() {
  const [progress, setProgress] = useState(0);
  const [showModules, setShowModules] = useState(false);

  useEffect(() => {
    setProgress(0);
    setShowModules(false);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowModules(true);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between text-forest select-none">
      <div className="flex justify-between items-center mb-3 pb-1.5 border-b border-forest/10">
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-forest/60">Optimizer // Active</span>
        <span className="text-[9px] font-extrabold uppercase bg-forest/10 px-2 py-0.5 rounded-full text-forest">Strategist v1.4</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
        {/* Upload box */}
        <div className="border border-dashed border-forest/20 rounded-xl p-3 flex flex-col justify-center items-center bg-white/10 h-full max-h-[190px]">
          <FileText className="w-7 h-7 text-forest/40 mb-2 animate-bounce" />
          <span className="font-mono text-[8.5px] font-bold text-forest/70 uppercase text-center break-all">physics_syllabus.pdf</span>
          <div className="w-full bg-forest/10 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-forest transition-all duration-100" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[8px] text-forest/50 mt-1.5 uppercase tracking-wider">
            {progress < 100 ? `Parsing: ${progress}%` : "Syllabus Parsed ✓"}
          </span>
        </div>

        {/* Breakdown details */}
        <div className="flex flex-col justify-between h-full max-h-[190px]">
          <div className="space-y-1.5">
            <span className="font-mono text-[8px] font-bold text-forest/50 uppercase tracking-widest block">Core Modules Extracted</span>
            <AnimatePresence>
              {showModules && (
                <motion.div 
                  key="modules-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-1"
                >
                  {[
                    { name: "01 Mechanics", wt: "35%" },
                    { name: "02 Electromagnetism", wt: "30%" },
                    { name: "03 Optics & Waves", wt: "20%" },
                  ].map((m, i) => (
                    <motion.div 
                      key={m.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex justify-between items-center text-[9px] font-bold bg-white/30 border border-forest/5 rounded-lg px-2 py-1"
                    >
                      <span className="text-forest">{m.name}</span>
                      <span className="text-forest/60 font-mono">{m.wt} Weight</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Activity Heatmap */}
          <div className="mt-2">
            <span className="font-mono text-[8px] font-bold text-forest/50 uppercase tracking-widest block mb-1">Roadmap Coverage</span>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: 28 }).map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0.3, scale: 0.8 }}
                  animate={{ 
                    opacity: showModules ? (i % 3 === 0 ? 0.9 : i % 2 === 0 ? 0.6 : 0.3) : 0.2,
                    scale: 1 
                  }}
                  transition={{ delay: i * 0.01 }}
                  className="aspect-square w-full rounded-[2px]"
                  style={{
                    backgroundColor: showModules 
                      ? (i % 3 === 0 ? "#01472e" : i % 2 === 0 ? "#a3b18a" : "#e9edc9")
                      : "rgba(1, 71, 46, 0.1)"
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mockup 2: Reference Parser
function ReferenceParserMockup() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1200);
    const t3 = setTimeout(() => setStep(3), 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between text-forest select-none">
      <div className="flex justify-between items-center mb-3 pb-1.5 border-b border-forest/10">
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-forest/60">Parser // Deconstruct</span>
        <span className="text-[9px] font-extrabold uppercase bg-forest/10 px-2 py-0.5 rounded-full text-forest">Annotator v2.1</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
        {/* Source PDF Page View */}
        <div className="bg-white/40 border border-forest/10 rounded-xl p-3 flex flex-col justify-between h-full max-h-[190px] font-serif text-[9px] leading-relaxed text-forest/80 relative overflow-hidden">
          <div className="absolute top-2 right-2 flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-forest/30" />
            <span className="w-1.5 h-1.5 rounded-full bg-forest/30" />
          </div>
          <div>
            <h4 className="font-bold text-center border-b border-forest/10 pb-1 mb-1.5 tracking-tight uppercase font-sans text-[8px] text-forest/60">Chapter 4: Orbital Dynamics</h4>
            <p className="mb-1.5">
              According to Kepler's laws, the orbit of a planet is an ellipse with the Sun at one of the two foci. The square of the orbital period <span className="bg-[#ebd859]/50 font-mono font-bold px-1 rounded">T² ∝ a³</span> is proportional to the cube of the semi-major axis.
            </p>
            <p>
              The gravitational force between two point masses is given by Newton's formulation: <span className="bg-[#ebd859]/50 font-mono font-bold px-1 rounded">F = G(m₁m₂)/r²</span>.
            </p>
          </div>
          <div className="mt-2 pt-1 border-t border-forest/5 font-mono text-[7px] text-forest/50 uppercase tracking-widest">
            Source: Physics_vol2_ref.pdf
          </div>
        </div>

        {/* Extracted Elements */}
        <div className="flex flex-col justify-start space-y-2 h-full max-h-[190px] overflow-hidden">
          <span className="font-mono text-[8px] font-bold text-forest/50 uppercase tracking-widest block">Extracted Knowledge Objects</span>
          
          <AnimatePresence>
            {step >= 1 && (
              <motion.div 
                key="fx-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-white/50 border border-forest/10 p-2 rounded-xl flex items-center gap-2 shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-[#01472e]/10 flex items-center justify-center shrink-0">
                  <span className="font-mono text-[10px] font-bold text-[#01472e]">Fx</span>
                </div>
                <div>
                  <span className="font-mono text-[7.5px] font-bold text-forest/50 uppercase tracking-wide block leading-none mb-0.5">Formula Card</span>
                  <p className="font-mono text-[9px] font-bold text-forest leading-none">F = G * (m₁ * m₂) / r²</p>
                </div>
              </motion.div>
            )}

            {step >= 2 && (
              <motion.div 
                key="summary-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-white/50 border border-forest/10 p-2 rounded-xl flex items-center gap-2 shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-forest/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-forest" />
                </div>
                <div>
                  <span className="font-mono text-[7.5px] font-bold text-forest/50 uppercase tracking-wide block leading-none mb-0.5">Summary Flashcard</span>
                  <p className="font-sans text-[8.5px] font-bold text-forest leading-snug">Kepler's 3rd: Square of period is proportional to cube of semi-major axis.</p>
                </div>
              </motion.div>
            )}

            {step >= 3 && (
              <motion.div 
                key="note-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-white/50 border border-[#ebd859] p-2 rounded-xl flex items-center gap-2 shadow-sm"
                style={{ backgroundColor: "rgba(254, 250, 224, 0.9)" }}
              >
                <div className="w-7 h-7 rounded-lg bg-[#ebd859]/30 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-forest" />
                </div>
                <div>
                  <span className="font-mono text-[7.5px] font-bold text-forest/50 uppercase tracking-wide block leading-none mb-0.5">Dynamic Note</span>
                  <p className="font-sans text-[8.5px] font-bold text-forest leading-snug">Kepler's 3rd scheduled for spaced recall queue.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Mockup 3: Diagnostic Guide
function DiagnosticGuideMockup() {
  const [drawPath, setDrawPath] = useState(false);

  useEffect(() => {
    setDrawPath(false);
    const t = setTimeout(() => setDrawPath(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between text-forest select-none">
      <div className="flex justify-between items-center mb-3 pb-1.5 border-b border-forest/10">
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-forest/60">Diagnostics // Metrics</span>
        <span className="text-[9px] font-extrabold uppercase bg-forest/10 px-2 py-0.5 rounded-full text-forest">Analyst v1.9</span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "Overall Accuracy", val: "92.4%", change: "+1.2%" },
          { label: "Study Volume", val: "18.2 Hrs", change: "42 sessions" },
          { label: "Mastery Index", val: "88.5%", change: "Optimal" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/30 border border-forest/10 rounded-xl p-2 flex flex-col justify-between">
            <span className="font-mono text-[7px] font-bold text-forest/50 uppercase tracking-wide leading-none">{stat.label}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-sans text-xs md:text-sm font-black text-forest leading-none">{stat.val}</span>
              <span className="font-mono text-[6.5px] font-bold text-forest/50 leading-none">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SVG Accuracy Graph */}
      <div className="bg-white/40 border border-forest/10 rounded-xl p-3 flex-grow flex flex-col justify-between relative overflow-hidden h-[120px]">
        <span className="font-mono text-[8px] font-bold text-forest/50 uppercase tracking-wider mb-1">Performance Trend (Mock Exams)</span>
        <div className="relative w-full h-[60px] flex-grow mt-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80">
            <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(1, 71, 46, 0.05)" strokeWidth="1" strokeDasharray="4" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(1, 71, 46, 0.05)" strokeWidth="1" strokeDasharray="4" />
            
            <motion.path 
              d="M0 65 L60 55 L120 62 L180 30 L240 38 L300 12"
              fill="none"
              stroke="#01472e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: drawPath ? 1 : 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            <motion.path 
              d="M0 65 L60 55 L120 62 L180 30 L240 38 L300 12 L300 80 L0 80 Z"
              fill="rgba(1, 71, 46, 0.04)"
              initial={{ opacity: 0 }}
              animate={{ opacity: drawPath ? 1 : 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
            {[{cx: 180, cy: 30}, {cx: 300, cy: 12}].map((pt, index) => (
              <motion.circle 
                key={pt.cx} 
                cx={pt.cx} 
                cy={pt.cy} 
                r="3" 
                fill="#01472e" 
                stroke="#fff785" 
                strokeWidth="1.2"
                initial={{ scale: 0 }}
                animate={{ scale: drawPath ? 1 : 0 }}
                transition={{ delay: 0.8 + index * 0.2 }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Suggestion Notification */}
      <div className="bg-[#01472e] border border-white/5 rounded-xl p-2.5 flex items-center gap-2 mt-2.5 shadow-md">
        <AlertCircle className="w-4 h-4 text-[#fefae0] shrink-0 animate-pulse" />
        <div className="flex-grow text-left">
          <span className="font-mono text-[7.5px] font-bold text-cream/60 uppercase tracking-wide block leading-none">Diagnostic Alert</span>
          <p className="font-sans text-[8.5px] font-bold text-[#fefae0] leading-snug mt-0.5">Rotational Dynamics accuracy fell to 64%. Auto-queueing remedial flashcards.</p>
        </div>
      </div>
    </div>
  );
}

// Mockup 4: Recall Tester
function RecallTesterMockup() {
  const [chats, setChats] = useState<Array<{ sender: string, text: string, type?: string }>>([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setChats([
      { sender: "ai", text: "What is the physical meaning of the divergence of a vector field?" }
    ]);
    setStep(0);

    const t1 = setTimeout(() => {
      setChats(prev => [...prev, { sender: "user", text: "It measures the net rate of outward flux leaving an infinitesimal point." }]);
      setStep(1);
    }, 1000);

    const t2 = setTimeout(() => {
      setChats(prev => [...prev, { sender: "ai", text: "✓ 94% ACCURACY: Conceptually correct. Divergence represents the outward flux density. Score updated (+15 pts)", type: "eval" }]);
      setStep(2);
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between text-forest select-none">
      <div className="flex justify-between items-center mb-3 pb-1.5 border-b border-forest/10">
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-forest/60">Active Recall // Tester</span>
        <span className="text-[9px] font-extrabold uppercase bg-forest/10 px-2 py-0.5 rounded-full text-forest">Socratic v3.0</span>
      </div>

      {/* Chat messages */}
      <div className="flex-grow space-y-2.5 overflow-y-auto pr-1 h-[140px]">
        {chats.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`p-2.5 rounded-2xl max-w-[85%] text-[9.5px] font-medium leading-relaxed ${
                msg.sender === "user"
                  ? "bg-forest text-[#fefae0] rounded-tr-none shadow-sm"
                  : msg.type === "eval"
                    ? "bg-[#fefae0] border border-[#01472e]/20 text-forest rounded-tl-none font-bold shadow-md"
                    : "bg-white/40 border border-forest/10 text-forest rounded-tl-none"
              }`}
            >
              <span className="font-mono text-[6.5px] font-extrabold uppercase tracking-widest block mb-0.5 opacity-60">
                {msg.sender === "user" ? "You" : msg.type === "eval" ? "Socratic Evaluation" : "Socratic Agent"}
              </span>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mastery Score progress circle */}
      <div className="mt-3 pt-2 border-t border-forest/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8.5 h-8.5 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(1, 71, 46, 0.08)" strokeWidth="3" />
              <motion.circle 
                cx="18" 
                cy="18" 
                r="15.915" 
                fill="none" 
                stroke="#01472e" 
                strokeWidth="3.2" 
                strokeDasharray="94 6" 
                strokeLinecap="round" 
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: step >= 2 ? 0 : 10 }}
                transition={{ duration: 0.8 }}
              />
            </svg>
            <span className="absolute font-sans text-[8.5px] font-black text-forest">{step >= 2 ? "94%" : "88%"}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[7px] font-bold text-forest/50 uppercase tracking-wide leading-none">Concept Mastery</span>
            <span className="font-sans text-[9px] font-bold text-forest mt-0.5">Vector Divergence: Mastered</span>
          </div>
        </div>
        
        <span className="font-mono text-[7px] font-extrabold text-forest/40 uppercase tracking-widest">Mastery +6%</span>
      </div>
    </div>
  );
}

// Mockup 5: Schedule Pacer
function SchedulePacerMockup() {
  const [rescheduled, setRescheduled] = useState(false);

  useEffect(() => {
    setRescheduled(false);
    const t = setTimeout(() => setRescheduled(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between text-forest select-none">
      <div className="flex justify-between items-center mb-3 pb-1.5 border-b border-forest/10">
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-forest/60">Schedule // Pacer</span>
        <span className="text-[9px] font-extrabold uppercase bg-forest/10 px-2 py-0.5 rounded-full text-forest">Nudger v2.0</span>
      </div>

      {/* Week Calendar */}
      <div className="flex-grow flex flex-col justify-start">
        <span className="font-mono text-[8px] font-bold text-forest/50 uppercase tracking-widest block mb-2">Weekly Learning Blocks</span>
        
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { day: "MON", task: "Chapter 3 Revise", active: false },
            { day: "TUE", task: "Mock Exam 1", active: true, shift: true },
            { day: "WED", task: "Diag. Review", active: false },
            { day: "THU", task: "Mock Exam 1", active: true, dropzone: true },
            { day: "FRI", task: "Pacing Sync", active: false }
          ].map((col) => {
            const isMockExam = col.task === "Mock Exam 1";
            
            return (
              <div 
                key={col.day} 
                className={`flex flex-col rounded-xl border p-1.5 h-[110px] transition-colors duration-300 relative ${
                  col.dropzone && rescheduled 
                    ? "bg-[#fefae0]/80 border-[#01472e]/45" 
                    : isMockExam && col.shift && rescheduled
                      ? "bg-white/10 border-forest/5 border-dashed"
                      : "bg-white/30 border-forest/10"
                }`}
              >
                <span className="font-mono text-[7px] font-black text-forest/40 border-b border-forest/5 pb-1 mb-1 block">{col.day}</span>
                
                {isMockExam ? (
                  !rescheduled && col.shift ? (
                    <motion.div 
                      layoutId="mockCard"
                      className="bg-forest text-[#fefae0] p-1 rounded-lg text-[8px] font-bold leading-tight flex-grow flex flex-col justify-between shadow-sm cursor-grab"
                    >
                      <span>Mock 1</span>
                      <span className="font-mono text-[6.5px] text-cream/70 uppercase">09:00 AM</span>
                    </motion.div>
                  ) : rescheduled && col.dropzone ? (
                    <motion.div 
                      layoutId="mockCard"
                      className="bg-[#01472e] text-[#fefae0] p-1 rounded-lg text-[8px] font-bold leading-tight flex-grow flex flex-col justify-between shadow-sm border border-[#ebd859]/30"
                    >
                      <span className="flex items-center gap-0.5">Mock 1 <span className="w-1 h-1 rounded-full bg-[#ebd859] animate-ping" /></span>
                      <span className="font-mono text-[6.5px] text-cream/70 uppercase">09:00 AM</span>
                    </motion.div>
                  ) : col.shift ? (
                    <span className="text-[7px] font-mono text-forest/20 text-center mt-5 uppercase italic">Moved →</span>
                  ) : null
                ) : col.dropzone && !rescheduled ? (
                  <span className="text-[7.5px] font-mono text-forest/20 text-center mt-5 uppercase border border-dashed border-forest/10 rounded-lg p-0.5">Empty</span>
                ) : (
                  <div className="flex-grow flex flex-col justify-between">
                    <span className="font-sans text-[8px] font-bold leading-tight text-forest">{col.task}</span>
                    <span className="font-mono text-[6.5px] text-forest/50 uppercase">03:00 PM</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pacer status */}
      <div className="mt-3 pt-2 border-t border-forest/10 flex justify-between items-center bg-white/20 p-2 rounded-xl border border-forest/5">
        <div className="flex flex-col">
          <span className="font-mono text-[7px] font-bold text-forest/50 uppercase tracking-wide leading-none">Pacing Status</span>
          <span className="font-sans text-[9px] font-extrabold text-forest mt-0.5">Adaptation Complete: No overlaps</span>
        </div>
        <div className="bg-[#01472e] text-cream text-[7.5px] font-bold font-mono px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
          Pacing Health: 98%
        </div>
      </div>
    </div>
  );
}

export default function EarthyPersonas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const targetScroll = useRef(0);
  const [activeStep, setActiveStep] = useState(0);

  // Tell Lenis to not interfere with the inner scroller element
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    // Mark element so Lenis skips it
    scroller.setAttribute("data-lenis-prevent", "");
    return () => scroller.removeAttribute("data-lenis-prevent");
  }, []);

  // Wheel scroll-catching for desktop — routes wheel events into the inner scroller
  useEffect(() => {
    const container = containerRef.current;
    const scroller = scrollerRef.current;
    if (!container || !scroller) return;

    targetScroll.current = scroller.scrollTop;

    const handleWheel = (e: WheelEvent) => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (!isDesktop) return;

      const scrollTop = scroller.scrollTop;
      const scrollHeight = scroller.scrollHeight;
      const clientHeight = scroller.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      // Sync if desynced
      if (Math.abs(targetScroll.current - scrollTop) > 100) {
        targetScroll.current = scrollTop;
      }

      const nextScroll = Math.max(0, Math.min(targetScroll.current + e.deltaY, maxScroll));
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;
      let shouldPrevent = false;

      if (isScrollingDown && scrollTop + clientHeight < scrollHeight - 5) {
        shouldPrevent = true;
      } else if (isScrollingUp && scrollTop > 5) {
        shouldPrevent = true;
      }

      if (shouldPrevent) {
        targetScroll.current = nextScroll;
        gsap.to(scroller, {
          scrollTop: nextScroll,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
        e.preventDefault();
      } else {
        targetScroll.current = scrollTop;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // GSAP ScrollTrigger to track active step cards inside inner scroller
  useGSAP(
    () => {
      if (!scrollerRef.current) return;
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (!isDesktop) return;

      const cards = scrollerRef.current.querySelectorAll(".step-card");
      const triggers: ScrollTrigger[] = [];

      cards.forEach((card, idx) => {
        const trigger = ScrollTrigger.create({
          scroller: scrollerRef.current,
          trigger: card,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveStep(idx);
            }
          },
        });
        triggers.push(trigger);
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: scrollerRef }
  );

  return (
    <section 
      ref={containerRef}
      id="counsels"
      data-flow-section
      className="relative w-full h-screen overflow-hidden select-none"
      style={{ backgroundColor: "#fefae0" }}
    >
      <div 
        className="flow-art-container relative flex h-full w-full flex-col justify-between rounded-t-[5rem] will-change-transform overflow-hidden"
        style={{ backgroundColor: "#a3b18a", transformOrigin: "bottom left" }}
      >
        {/* Inner hidden-scrollbar wrapper */}
        <div 
          ref={scrollerRef}
          className="w-full h-full overflow-y-auto scrollbar-none pointer-events-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          
          {/* Desktop Layout */}
          <div className="hidden md:block w-full">
            
            {/* Header Intro - stationary at the top of the scroll container */}
            <div className="px-6 md:px-12 pt-16 md:pt-20 pb-4 shrink-0">
              <EarthyScrollReveal>
                <div className="max-w-3xl">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-forest/70 mb-2 block" style={{ color: "rgba(1, 71, 46, 0.7)" }}>
                    AGENTS // THE ACADEMIC COUNSELS
                  </span>
                  <h2 
                    className="font-display text-[8vw] md:text-[6vw] leading-[0.85] tracking-[-0.03em] uppercase mb-3 text-forest"
                    style={{ color: "#01472e" }}
                  >
                    THE COUNSELS
                  </h2>
                  <p className="font-sans text-xs md:text-sm text-forest/80 font-medium leading-relaxed max-w-lg">
                    Meet your personal AI academic board. Five specialized agents working in tandem to optimize syllabus coverage, test recall accuracy, and guide your daily pacing.
                  </p>
                </div>
              </EarthyScrollReveal>
            </div>

            {/* Desktop Two-Column Layout */}
            <div className="flex gap-12 w-full items-start relative px-6 md:px-12 pb-20">
              
              {/* LEFT COLUMN: Scrollable Cards */}
              <div className="w-[45%] flex flex-col gap-[12vh] py-[8vh]">
                {steps.map((step, idx) => (
                  <motion.div 
                    key={step.num}
                    className="step-card border rounded-[2rem] p-8 backdrop-blur-md flex flex-col justify-between"
                    style={{ minHeight: "280px" }}
                    animate={{
                      scale: activeStep === idx ? 1.02 : 0.95,
                      opacity: activeStep === idx ? 1 : 0.35,
                      backgroundColor: activeStep === idx ? "rgba(255, 255, 255, 0.55)" : "rgba(255, 255, 255, 0.1)",
                      borderColor: activeStep === idx ? "rgba(1, 71, 46, 0.3)" : "rgba(1, 71, 46, 0.05)",
                      boxShadow: activeStep === idx ? "0 20px 25px -5px rgba(1, 71, 46, 0.15), 0 10px 10px -5px rgba(1, 71, 46, 0.04)" : "none",
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-mono text-[10px] font-extrabold text-[#01472e] uppercase tracking-widest bg-[#01472e]/10 px-2.5 py-1 rounded-lg">
                          {step.num} — 05
                        </span>
                        <span className="font-mono text-[9px] font-bold text-forest/60 tracking-wider uppercase">
                          {step.agent}
                        </span>
                      </div>
                      
                      <motion.h3 
                        className="font-sans text-xl md:text-2xl font-extrabold text-forest uppercase tracking-tight leading-none mb-4"
                        animate={{
                          y: activeStep === idx ? 0 : 4,
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        {step.title}
                      </motion.h3>
                      
                      <motion.p 
                        className="font-sans text-xs md:text-sm text-forest/80 font-medium leading-relaxed"
                        animate={{
                          y: activeStep === idx ? 0 : 6,
                        }}
                        transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
                      >
                        {step.desc}
                      </motion.p>
                    </div>
                    
                    <motion.div 
                      className="pt-4 border-t border-forest/10 font-mono text-[9px] uppercase tracking-wider text-forest/50 mt-6"
                      animate={{
                        opacity: activeStep === idx ? 1 : 0.6,
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      Focus: {step.focus}
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* RIGHT COLUMN: Sticky Simulator Display Dashboard Mockup */}
              <div className="w-[55%] sticky top-[15vh] h-[70vh] flex items-center justify-center self-start">
                <div className="w-full max-w-[620px] bg-white/40 backdrop-blur-xl border border-forest/10 rounded-3xl p-5 shadow-2xl flex flex-col h-[400px] shrink-0">
                  {/* macOS window title bar */}
                  <div className="flex items-center justify-between mb-4 shrink-0 pb-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="font-mono text-[8px] font-bold text-forest/40 uppercase tracking-widest">
                      StudyCoach Workspace
                    </span>
                    <div className="w-10" />
                  </div>

                  {/* Dashboard Content screen */}
                  <div className="flex-grow relative overflow-hidden bg-white/10 rounded-2xl p-4.5 border border-forest/5 flex flex-col justify-between">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.03 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full h-full"
                      >
                        {activeStep === 0 && <SyllabusOptimizerMockup />}
                        {activeStep === 1 && <ReferenceParserMockup />}
                        {activeStep === 2 && <DiagnosticGuideMockup />}
                        {activeStep === 3 && <RecallTesterMockup />}
                        {activeStep === 4 && <SchedulePacerMockup />}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Mobile Stack Layout */}
          <div className="block md:hidden px-6 py-10 space-y-8">
            <div className="max-w-3xl mb-8">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-forest/70 mb-2 block" style={{ color: "rgba(1, 71, 46, 0.7)" }}>
                AGENTS // THE ACADEMIC COUNSELS
              </span>
              <h2 
                className="font-display text-[8vw] md:text-[6vw] leading-[0.85] tracking-[-0.03em] uppercase mb-3 text-forest"
                style={{ color: "#01472e" }}
              >
                THE COUNSELS
              </h2>
              <p className="font-sans text-xs md:text-sm text-forest/80 font-medium leading-relaxed max-w-lg">
                Meet your personal AI academic board. Five specialized agents working in tandem to optimize syllabus coverage, test recall accuracy, and guide your daily pacing.
              </p>
            </div>

            {steps.map((step, index) => (
              <div key={step.num} className="bg-white/20 border border-forest/15 rounded-[2.5rem] p-6 shadow-md flex flex-col gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-forest uppercase bg-forest/10 px-2 py-0.5 rounded-full">
                      {step.num} — 05
                    </span>
                    <span className="font-mono text-[9px] font-bold text-forest/60 tracking-wider uppercase">
                      {step.agent}
                    </span>
                  </div>
                  <h3 className="font-sans text-lg font-bold uppercase tracking-tight text-forest">
                    {step.title}
                  </h3>
                  <p className="font-sans text-xs text-forest/80 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                
                {/* Embedded mockup box */}
                <div className="bg-white/30 border border-forest/10 rounded-2xl p-4 min-h-[260px] flex flex-col justify-between shadow-sm">
                  {index === 0 && <SyllabusOptimizerMockup />}
                  {index === 1 && <ReferenceParserMockup />}
                  {index === 2 && <DiagnosticGuideMockup />}
                  {index === 3 && <RecallTesterMockup />}
                  {index === 4 && <SchedulePacerMockup />}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
