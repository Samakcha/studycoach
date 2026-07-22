import React from "react";
import NavigationMenu from "@/components/navigation/NavigationMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fefae0]">
      <NavigationMenu />
      <main className="ml-20">
        {children}
      </main>
    </div>
  );
}
