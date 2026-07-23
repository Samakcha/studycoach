"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface Tab {
  title: string;
  icon: LucideIcon;
  href?: string;
  type?: never;
}

export interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
  href?: never;
}

export type TabItem = Tab | Separator;

export interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
  activeTab?: number | null;
  isExpanded?: boolean;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isExpanded: boolean) => ({
    gap: isExpanded ? ".5rem" : 0,
    paddingLeft: ".5rem",
    paddingRight: isExpanded ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const transition = { type: "spring", bounce: 0, duration: 0.3 };

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-[#01472e] bg-[#e9edc9]",
  onChange,
  activeTab = null,
  isExpanded = false,
}: ExpandableTabsProps) {
  const [selected, setSelected] = React.useState<number | null>(activeTab);

  React.useEffect(() => {
    setSelected(activeTab);
  }, [activeTab]);

  const handleSelect = (index: number) => {
    setSelected(index);
    onChange?.(index);
  };

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/sounds/click.mp3");
      audio.volume = 0.15;
      audio.preload = "auto";
      audioRef.current = audio;
    }
  }, []);

  const playSyntheticClick = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      const now = ctx.currentTime;
      
      // Quick, soft pop sound: frequency sweep from 1000Hz to 150Hz in 40ms
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
      
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  };

  const playClickSound = () => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // Fallback to Web Audio API synthesized click if browser blocks or file fails
          playSyntheticClick();
        });
      } catch (e) {
        playSyntheticClick();
      }
    } else {
      playSyntheticClick();
    }
  };

  const SeparatorComponent = () => (
    <div className="my-1 h-[1.2px] w-[24px] bg-border self-center" aria-hidden="true" />
  );

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border bg-background p-1 shadow-sm w-full",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <SeparatorComponent key={`separator-${index}`} />;
        }

        const Icon = tab.icon;
        const isSelected = selected === index;

        return (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={isExpanded}
            onClick={() => handleSelect(index)}
            onMouseEnter={playClickSound}
            transition={transition}
            className={cn(
              "relative flex items-center rounded-xl py-2 text-sm font-medium transition-colors duration-300 select-none w-full justify-start",
              isSelected
                ? activeColor
                : "text-[#01472e] opacity-70 hover:opacity-100 hover:bg-[#e4e7f0]/50"
            )}
          >
            <Icon size={20} className="shrink-0" />
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{
                    duration: isExpanded ? 0.2 : 0.15,
                    ease: "easeOut",
                  }}
                  className="overflow-hidden whitespace-nowrap text-left"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
