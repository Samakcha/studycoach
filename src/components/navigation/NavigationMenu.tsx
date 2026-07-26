"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useOnClickOutside } from "usehooks-ts";
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  Calendar,
  Brain,
  FileText,
  TrendingUp,
  Bot,
  Settings,
} from "lucide-react";
import { ExpandableTabs, TabItem } from "@/components/ui/expandable-tabs";

const TABS: TabItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "My Subjects", icon: BookOpen, href: "/dashboard/subjects" },
  { title: "Upload Material", icon: Upload, href: "/dashboard/upload" },
  { title: "Study Plan", icon: Calendar, href: "/dashboard/study-plan" },
  { title: "Quiz", icon: Brain, href: "/dashboard/quiz" },
  { title: "Notes", icon: FileText, href: "/dashboard/notes" },
  { title: "Progress", icon: TrendingUp, href: "/dashboard/progress" },
  { title: "AI Coach", icon: Bot, href: "/dashboard/ai-coach" },
  { type: "separator" },
  { title: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function NavigationMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to collapse the menu
  useOnClickOutside(containerRef as React.RefObject<HTMLDivElement>, () => {
    setIsExpanded(false);
  });

  // Collapse sidebar when route changes
  useEffect(() => {
    setIsExpanded(false);
  }, [pathname]);

  // Find active index based on route pathname
  const getActiveTabIndex = () => {
    // Exact match first
    const exactIndex = TABS.findIndex((tab) => tab.href === pathname);
    if (exactIndex !== -1) return exactIndex;

    // Sub-route match (ignoring dashboard root to prevent it matching everything)
    const subRouteIndex = TABS.findIndex(
      (tab) => tab.href && tab.href !== "/dashboard" && pathname.startsWith(tab.href)
    );
    if (subRouteIndex !== -1) return subRouteIndex;

    // Fallback to dashboard root if it starts with /dashboard
    if (pathname.startsWith("/dashboard")) {
      return TABS.findIndex((tab) => tab.href === "/dashboard");
    }

    return null;
  };

  const activeTab = getActiveTabIndex();

  const handleTabChange = (index: number | null) => {
    // Keep sidebar expanded on tab click
    setIsExpanded(true);

    if (index === null) return;
    const tab = TABS[index];
    if (tab && typeof tab.href === "string") {
      const href = tab.href;
      startTransition(() => {
        router.push(href);
      });
    }
  };

  return (
    <nav
      ref={containerRef}
      suppressHydrationWarning
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 transition-[width] duration-300 select-none overflow-hidden"
      style={{
        width: isExpanded ? "200px" : "56px",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <ExpandableTabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={handleTabChange}
        isExpanded={isExpanded}
        activeColor="text-[#01472e] bg-[#e9edc9]"
        className="bg-white border-[#e4e7f0] rounded-[16px] p-2 shadow-[0_4px_20px_rgba(1,71,46,0.10)]"
      />
    </nav>
  );
}
