import React from "react";
import NavigationMenu from "@/components/navigation/NavigationMenu";
import { GraduationCap } from "lucide-react";
import NeuralBackground from "@/components/ui/flow-field-background";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#E6E8C2] relative">
      {/* Flow field background covering the entire dashboard layout behind content */}
      <NeuralBackground 
        color="#01472e" 
        backgroundColor="#E6E8C2" 
        speed={0.3} 
        particleCount={350} 
        trailOpacity={0.15} 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none w-screen h-screen" 
      />

      {/* Minimal Logo Mark */}
      <div className="fixed top-4 left-4 z-40 flex items-center gap-2.5 text-[#01472e] select-none pointer-events-none">
        <GraduationCap className="w-7 h-7 shrink-0" />
        <span className="font-display text-[20px] tracking-tight uppercase font-extrabold">
          StudyCoach
        </span>
      </div>

      <NavigationMenu />
      <main className="ml-20 relative z-10">
        {children}
      </main>
    </div>
  );
}
