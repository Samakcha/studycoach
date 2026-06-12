import React from "react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-36 lg:pb-28">
      {/* Soft decorative background glow to add visual premium feel */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-70">
        <div className="h-[350px] w-[500px] rounded-full bg-brand-primary/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Introducing Pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3.5 py-1.5 text-xs font-semibold text-brand-primary mb-8 select-none">
          <span className="flex h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
          Introducing StudyCoach 1.0
        </div>

        {/* Headline */}
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-[1.15] sm:leading-[1.12]">
          Study smarter,{" "}
          <span className="text-brand-primary relative inline-block">
            not harder
            <svg
              className="absolute -bottom-2.5 left-0 w-full h-2 text-brand-primary/30"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,5 Q50,10 100,5"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-7 text-lg sm:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
          Upload your syllabus, get a personalised day-by-day study plan, quiz yourself, and let AI find your weak spots — automatically.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-brand-primary px-6.5 py-3.5 text-base font-semibold text-white hover:bg-brand-primary-hover transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
            Get started free
          </button>
          <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-brand-border bg-white px-6.5 py-3.5 text-base font-semibold text-brand-text hover:bg-brand-bg hover:border-brand-text/10 transition-all duration-200 cursor-pointer">
            See how it works
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-14 pt-8 border-t border-brand-border/60 max-w-xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-y-3.5 gap-x-8 text-sm font-medium text-brand-muted">
            {/* Badge 1 */}
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-brand-primary"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              <span>No credit card</span>
            </div>

            {/* Badge 2 */}
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-brand-primary"
              >
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span>Free to start</span>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4.5 w-4.5 text-brand-primary"
              >
                <path d="M22 10v6M2 10v6" />
                <path d="M6 12.5V16a6 6 0 0 0 12 0v-3.5" />
                <path d="m22 10-10-5-10 5 10 5z" />
              </svg>
              <span>Built for Indian students</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
