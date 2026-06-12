"use client";

import React, { useState } from "react";
import ScrollReveal from "./ScrollReveal";

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/50 overflow-hidden shadow-soft-sm transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex justify-between items-center font-sans font-medium text-base text-soft-dark cursor-pointer select-none"
      >
        <span>{question}</span>
        
        {/* Plus Icon that rotates 45 degrees to cross */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className={`h-5 w-5 text-soft-muted transition-transform duration-300 shrink-0 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      {/* Height transition container */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="pb-6 px-6 font-sans font-light text-sm sm:text-base text-soft-muted leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function SoftFAQ() {
  const faqs = [
    {
      question: "How does the breathing assistant work?",
      answer:
        "The breathing assistant guides you through deep inhalation and exhalation cycles using tactile on-screen expansions and subtle vibrations to quiet your mind.",
    },
    {
      question: "Is my screen-time data kept private?",
      answer:
        "Yes, absolutely. Bloom runs entirely on-device. Your usage patterns, files, and diary reflections never leave your smartphone.",
    },
    {
      question: "Can I customize quiet blocks?",
      answer:
        "You can schedule silent windows (e.g. morning routine or family hours) where distracting apps are completely blocked and notifications are silent.",
    },
  ];

  return (
    <section id="faq" className="bg-soft-bg py-20 sm:py-28 border-b border-stone-200/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-widest text-soft-muted">
              Common Inquiries
            </span>
            <h2 className="mt-4 font-sans text-4xl sm:text-5xl font-light text-soft-dark tracking-tight leading-none">
              frequently asked questions.
            </h2>
          </ScrollReveal>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <ScrollReveal key={idx}>
              <FAQItem question={faq.question} answer={faq.answer} />
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
