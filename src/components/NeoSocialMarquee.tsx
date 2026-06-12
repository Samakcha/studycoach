"use client";

import React from "react";

export default function NeoSocialMarquee() {
  const brands = [
    "ACME CORP",
    "GLOBEX",
    "INITECH",
    "UMBRELLA CORP",
    "TYRELL",
    "WONKA INDUSTRIES",
    "Hooli",
    "SIRIUS CYBERNETICS",
  ];

  // Repeat the list to ensure there's enough content to scroll seamlessly
  const marqueeItems = [...brands, ...brands, ...brands];

  return (
    <section className="bg-brand-charcoal border-b-2 border-brand-black py-4 overflow-hidden select-none">
      <div className="w-full flex">
        <div className="animate-marquee flex gap-12 items-center whitespace-nowrap">
          {marqueeItems.map((brand, index) => (
            <div key={index} className="flex items-center gap-12">
              <span className="font-heading text-xl sm:text-2xl font-black text-brand-sage opacity-50 tracking-wider">
                {brand}
              </span>
              <span className="text-brand-sage/40 text-lg">★</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
