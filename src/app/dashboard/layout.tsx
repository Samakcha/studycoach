import React from "react";
import NavigationMenu from "@/components/navigation/NavigationMenu";
import { GraduationCap } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fefae0]">
      {/* Minimal Logo Mark */}
      <div className="fixed top-4 left-[72px] z-40 flex items-center gap-2.5 text-[#01472e] select-none pointer-events-none">
        <GraduationCap className="w-7 h-7 shrink-0" />
        <span className="font-display text-[20px] tracking-tight uppercase font-extrabold">
          StudyCoach
        </span>
      </div>

      <NavigationMenu />
      <main className="ml-20">
        {children}
      </main>
    </div>
  );
}
