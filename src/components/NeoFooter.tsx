"use client";

import React from "react";
import Link from "next/link";

export default function NeoFooter() {
  return (
    <footer className="w-full flex flex-col select-none">
      
      {/* Final CTA Section: Yellow background */}
      <section className="bg-brand-yellow py-20 sm:py-28 text-center border-b-2 border-brand-black bg-dots px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="bg-brand-black text-brand-white px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-neo-sm mb-6">
            Get Instant Access
          </span>
          
          <h2 className="font-heading text-4xl sm:text-6xl font-black text-brand-black tracking-tight leading-none max-w-2xl">
            Ready to ace your exams?
          </h2>
          
          <p className="mt-6 text-base sm:text-lg font-sans font-bold text-brand-black/80 max-w-md">
            Join thousands of Indian students scoring higher and studying stress-free with StudyCoach.
          </p>

          <button className="mt-8 relative bg-brand-black text-brand-white px-10 py-5 border-2 border-brand-black rounded-xl font-heading font-black text-xl shadow-neo-lg hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-neo-md active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all duration-150 cursor-pointer">
            Start Studying Now
          </button>
        </div>
      </section>

      {/* Footer Section: Charcoal background */}
      <div className="bg-brand-charcoal text-brand-white py-16 px-4 border-t-2 border-brand-black">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            
            {/* Col 1: Logo & Socials (Col span 4) */}
            <div className="lg:col-span-4 flex flex-col items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center bg-brand-yellow border-2 border-brand-yellow rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5.5 w-5.5 text-brand-black"
                    >
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="font-heading text-2xl font-black tracking-tighter text-brand-white">
                    StudyCoach
                  </span>
                </div>
                <p className="mt-4 text-sm font-sans font-medium text-brand-sage/70 max-w-xs leading-relaxed">
                  The AI-powered study companion built to extract concepts, schedule workloads, and eliminate academic stress.
                </p>
              </div>

              {/* Social Icons: 10x10 squares (40px x 40px) */}
              <div className="flex gap-3 mt-4">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="h-10 w-10 bg-brand-dark-gray border border-brand-sage/20 rounded flex items-center justify-center text-brand-sage hover:bg-brand-yellow hover:text-brand-black hover:border-brand-black transition-colors duration-200 cursor-pointer"
                  aria-label="Twitter"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="h-10 w-10 bg-brand-dark-gray border border-brand-sage/20 rounded flex items-center justify-center text-brand-sage hover:bg-brand-yellow hover:text-brand-black hover:border-brand-black transition-colors duration-200 cursor-pointer"
                  aria-label="GitHub"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="h-10 w-10 bg-brand-dark-gray border border-brand-sage/20 rounded flex items-center justify-center text-brand-sage hover:bg-brand-yellow hover:text-brand-black hover:border-brand-black transition-colors duration-200 cursor-pointer"
                  aria-label="LinkedIn"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2: Product */}
            <div className="lg:col-span-2.5 text-left">
              <h3 className="font-heading text-lg font-black text-brand-yellow uppercase tracking-wider mb-4">
                Product
              </h3>
              <ul className="space-y-2.5 font-sans text-sm font-medium text-brand-sage/80">
                <li><a href="#features" className="hover:text-brand-yellow transition-colors">Features</a></li>
                <li><a href="#cycle" className="hover:text-brand-yellow transition-colors">Methodology</a></li>
                <li><a href="#counsels" className="hover:text-brand-yellow transition-colors">Counsels</a></li>
                <li><a href="#access" className="hover:text-brand-yellow transition-colors">Join</a></li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="lg:col-span-2.5 text-left">
              <h3 className="font-heading text-lg font-black text-brand-yellow uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-2.5 font-sans text-sm font-medium text-brand-sage/80">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-yellow transition-colors">Syllabus Database</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-yellow transition-colors">Active Recall Guide</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-yellow transition-colors">Developer Blog</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-yellow transition-colors">Student Help Center</a></li>
              </ul>
            </div>

            {/* Col 4: Legal */}
            <div className="lg:col-span-3 text-left">
              <h3 className="font-heading text-lg font-black text-brand-yellow uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-2.5 font-sans text-sm font-medium text-brand-sage/80">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-yellow transition-colors">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-yellow transition-colors">Terms of Service</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-yellow transition-colors">Contact Support</a></li>
              </ul>
              <div className="mt-8 text-xs font-mono text-brand-sage/40">
                &copy; 2026 StudyCoach Inc. All rights reserved.
              </div>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}
