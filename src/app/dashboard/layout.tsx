"use client";

import React, { useState } from "react";
import NavigationMenu from "@/components/navigation/NavigationMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <NavigationMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      <div
        className="transition-all duration-400 ease-in-out flex flex-col min-h-screen"
        style={{
          filter: isMenuOpen ? "blur(8px)" : "none",
          opacity: isMenuOpen ? 0.4 : 1,
          pointerEvents: isMenuOpen ? "none" : "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}
