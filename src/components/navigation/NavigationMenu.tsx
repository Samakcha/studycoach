"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import OptionWheel from "./OptionWheel";

interface NavigationMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MENU_ITEMS = [
  'Dashboard',
  'My Subjects',
  'Upload Material',
  'Study Plan',
  'Quiz',
  'Notes',
  'Progress',
  'AI Coach',
  'Settings'
];

const ROUTES = [
  '/dashboard',
  '/dashboard/subjects',
  '/dashboard/upload',
  '/dashboard/study-plan',
  '/dashboard/quiz',
  '/dashboard/notes',
  '/dashboard/progress',
  '/dashboard/ai-coach',
  '/dashboard/settings'
];

const getSelectedIndex = (pathname: string) => {
  const index = ROUTES.indexOf(pathname);
  return index !== -1 ? index : 0;
};

export default function NavigationMenu({ isOpen, setIsOpen }: NavigationMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const lastClickTimeRef = useRef<number>(0);

  // Set mounted flag to prevent navigation on initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Escape key listener to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleWheelClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("option-wheel__item")) {
      lastClickTimeRef.current = Date.now();
    }
  };

  const handleNavigation = (index: number) => {
    if (!isMounted) return;

    // Detect if change was triggered by a click
    const timeSinceClick = Date.now() - lastClickTimeRef.current;
    if (timeSinceClick > 150) {
      return; // Drag or scroll, ignore
    }

    const route = ROUTES[index];

    // Wait 200ms so user sees the selection highlight
    setTimeout(() => {
      // Close the panel
      setIsOpen(false);

      // Navigate after panel completes slide-out animation (400ms)
      setTimeout(() => {
        router.push(route);
      }, 400);
    }, 200);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const currentSelectionIndex = getSelectedIndex(pathname);

  return (
    <>
      <style>{`
        .nav-menu-panel {
          transform: translateX(-100%);
          transition: transform 400ms cubic-bezier(0.4, 0, 1, 1);
          background: rgba(254, 250, 224, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-right: 1px solid rgba(1, 71, 46, 0.15);
        }
        .nav-menu-panel.open {
          transform: translateX(0);
          transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-menu-btn {
          left: -4px;
          transition: left 400ms cubic-bezier(0.4, 0, 1, 1);
        }
        .nav-menu-btn.open {
          left: 288px;
          transition: left 400ms cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      {/* Full screen overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#fefae0]/30 transition-opacity duration-400 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-label="Close menu"
        role="button"
      />

      {/* Floating menu button */}
      <button
        onClick={toggleMenu}
        className={`nav-menu-btn fixed top-1/2 -translate-y-1/2 z-50 w-16 h-16 rounded-full bg-white border-2 border-[#01472e] text-[#01472e] flex items-center justify-center font-sans font-semibold text-sm cursor-pointer shadow-[0_4px_20px_rgba(1,71,46,0.15)] hover:shadow-lg transition-shadow duration-200 select-none ${
          isOpen ? "open" : ""
        }`}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isOpen ? "X" : "Menu"}
      </button>

      {/* Sidebar Panel */}
      <aside
        className={`nav-menu-panel fixed top-0 left-0 z-45 w-[320px] h-screen flex flex-col pt-8 pb-4 shadow-2xl select-none overflow-hidden ${
          isOpen ? "open" : ""
        }`}
        onWheel={(e) => e.stopPropagation()}
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Subtle noise overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="panelNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#panelNoise)" />
          </svg>
        </div>

        {/* Logo Header */}
        <div className="flex flex-col items-center justify-center px-6 z-20">
          <h2 className="font-display text-[18px] text-[#01472e] uppercase tracking-wider">
            StudyCoach
          </h2>
          <div className="w-full h-[1px] bg-[#01472e]/10 mt-4 mb-2" />
        </div>

        {/* Option Wheel Container */}
        <div 
          className="flex-grow w-full relative z-20"
          onClickCapture={handleWheelClickCapture}
        >
          <OptionWheel
            key={pathname} // Re-mounts OptionWheel on path change to reset selected index
            items={MENU_ITEMS}
            defaultSelected={currentSelectionIndex}
            textColor="rgba(1, 71, 46, 0.5)"
            activeColor="#01472e"
            side="right"
            fontSize={1.4}
            spacing={1.8}
            curve={1.2}
            tilt={7}
            blur={1.5}
            fade={0.3}
            smoothing={180}
            inset={48}
            loop={false}
            draggable={true}
            soundUrl="/sounds/click.mp3"
            soundVolume={0.4}
            onChange={(index) => handleNavigation(index)}
          />
        </div>
      </aside>
    </>
  );
}
