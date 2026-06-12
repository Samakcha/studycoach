import React from "react";

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
}

function FeatureCard({ emoji, title, description }: FeatureCardProps) {
  return (
    <div className="group relative rounded-2xl border border-brand-border bg-white p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-brand-primary/20">
      <div className="flex flex-col items-start gap-4">
        {/* Emoji Badge Wrapper */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-bg border border-brand-border group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-colors duration-300">
          <span className="text-xl" role="img" aria-label={title}>
            {emoji}
          </span>
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-brand-text group-hover:text-brand-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="mt-2 text-sm sm:text-base text-brand-muted leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Features() {
  const featuresList = [
    {
      emoji: "📄",
      title: "Smart Upload",
      description:
        "Upload any syllabus, notes, or past papers. AI extracts every topic instantly.",
    },
    {
      emoji: "🗓",
      title: "Personalised Plan",
      description:
        "Get a day-by-day study schedule built around your exam date.",
    },
    {
      emoji: "🧠",
      title: "Adaptive Quizzes",
      description:
        "Quiz yourself on any topic. Wrong answers resurface until you get them right.",
    },
    {
      emoji: "📊",
      title: "Weak Spot Tracker",
      description:
        "AI finds the topics dragging your score down and fixes your plan automatically.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-brand-bg relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
            Features
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-brand-text sm:text-4xl">
            Everything you need to ace your exams
          </h2>
        </div>

        {/* 2x2 Grid (Desktop) / Stacked (Mobile) */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {featuresList.map((feature, idx) => (
            <FeatureCard
              key={idx}
              emoji={feature.emoji}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
