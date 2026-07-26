"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Loader2 } from "lucide-react";

interface ActivityHeatmapProps {
  userId: string;
}

interface HoveredSquareInfo {
  date: Date;
  isActive: boolean;
  x: number;
  y: number;
}

export default function ActivityHeatmap({ userId }: ActivityHeatmapProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [activeDates, setActiveDates] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  
  // Tooltip state based on coordinates relative to the outer .heatmap-card
  const [hoveredSquare, setHoveredSquare] = useState<HoveredSquareInfo | null>(null);

  // Format date as local YYYY-MM-DD
  const toLocalDateString = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (!userId) return;

    async function fetchActivity() {
      try {
        setLoading(true);
        setError(null);

        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        const oneYearAgoStr = toLocalDateString(oneYearAgo);

        const { data, error: fetchError } = await supabase
          .from("study_activity")
          .select("activity_date")
          .eq("user_id", userId)
          .gte("activity_date", oneYearAgoStr);

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        const dateSet = new Set<string>();
        if (data) {
          data.forEach((row: any) => {
            if (row.activity_date) {
              dateSet.add(row.activity_date);
            }
          });
        }
        setActiveDates(dateSet);
      } catch (err: any) {
        setError(err.message || "Failed to load study activity data.");
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, [userId, supabase]);

  // Generate 52 weeks × 7 days (Monday to Sunday) ending with the current week
  const generateGrid = () => {
    const grid: Date[][] = [];
    const today = new Date();

    // Find the Monday of the current week
    const currentDay = today.getDay();
    const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() - diffToMonday);

    // Start date is 51 weeks before this Monday
    const startDate = new Date(currentMonday);
    startDate.setDate(currentMonday.getDate() - 51 * 7);

    for (let w = 0; w < 52; w++) {
      const week: Date[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + w * 7 + d);
        week.push(date);
      }
      grid.push(week);
    }
    return grid;
  };

  const grid = generateGrid();

  // Find month transitions to position labels above the columns
  const getMonthLabels = () => {
    const labels: { text: string; colIndex: number }[] = [];
    let lastMonth = -1;

    grid.forEach((week, colIndex) => {
      // Check what month the first day of that week belongs to
      const month = week[0].getMonth();
      if (month !== lastMonth) {
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        labels.push({
          text: monthNames[month],
          colIndex,
        });
        lastMonth = month;
      }
    });

    // Remove first month label if the second one is too close to avoid overlapping
    if (labels.length > 1 && labels[1].colIndex - labels[0].colIndex < 3) {
      labels.shift();
    }

    return labels;
  };

  const monthLabels = getMonthLabels();

  const formatTooltipDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, date: Date, isActive: boolean) => {
    const squareRect = e.currentTarget.getBoundingClientRect();
    const cardElement = e.currentTarget.closest(".heatmap-card");
    if (cardElement) {
      const cardRect = cardElement.getBoundingClientRect();
      // Calculate coordinates relative to the .heatmap-card container
      const x = squareRect.left - cardRect.left + squareRect.width / 2;
      const y = squareRect.top - cardRect.top;
      setHoveredSquare({ date, isActive, x, y });
    }
  };

  return (
    <div className="bg-white border border-[#e4e7f0] rounded-xl p-5 text-left relative z-20 w-full h-full shadow-xs heatmap-card flex flex-col justify-between">
      <div className="space-y-1 mb-4">
        <h3 className="font-sans font-semibold text-lg text-[#01472e]">
          Study Activity
        </h3>
        <p className="font-sans text-xs text-[#6b7280]">
          Your study consistency over the past year
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3.5 mb-4">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex-grow flex items-center justify-center py-10 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#01472e]" />
          <span className="text-xs text-[#01472e]/60 font-semibold">Loading activity...</span>
        </div>
      ) : (
        <div className="flex-grow flex flex-col justify-between">
          {/* Scrollable Month Header and Day Grid */}
          <div 
            className="overflow-x-auto pb-2 scrollbar-none w-full"
            onScroll={() => setHoveredSquare(null)}
          >
            <div className="min-w-[881px]">
              {/* Month Labels row (spaced dynamically based on week column width: 14px + 3px gap = 17px) */}
              <div className="relative h-4 mb-2 text-xs text-[#6b7280] font-sans font-bold">
                {monthLabels.map((label, idx) => (
                  <span
                    key={idx}
                    className="absolute"
                    style={{ left: `${label.colIndex * 17}px` }}
                  >
                    {label.text}
                  </span>
                ))}
              </div>

              {/* Grid container with 14px squares and 3px gaps */}
              <div className="flex gap-[3px]">
                {grid.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[3px] shrink-0">
                    {week.map((date, dIdx) => {
                      const dateString = toLocalDateString(date);
                      const isActive = activeDates.has(dateString);

                      return (
                        <div 
                          key={dIdx} 
                          className="relative"
                          onMouseEnter={(e) => handleMouseEnter(e, date, isActive)}
                          onMouseLeave={() => setHoveredSquare(null)}
                        >
                          <div
                            className={`w-[14px] h-[14px] rounded-[3px] transition-all duration-200 cursor-pointer ${
                              isActive ? "bg-[#01472e]" : "bg-[#e9edc9]"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Single absolute Tooltip rendered relative to the outer .heatmap-card wrapper to prevent clipping */}
          {hoveredSquare && (
            <div
              className="absolute bg-[#01472e] text-[#fefae0] text-[12px] font-sans font-medium rounded-[6px] py-[6px] px-[10px] whitespace-nowrap shadow-md z-50 pointer-events-none -translate-x-1/2"
              style={{
                left: `${hoveredSquare.x}px`,
                top: `${hoveredSquare.y - 36}px`, // Adjusted above the 14px square
              }}
            >
              {hoveredSquare.isActive 
                ? `📗 Studied — ${formatTooltipDate(hoveredSquare.date)}` 
                : `No activity — ${formatTooltipDate(hoveredSquare.date)}`}
              {/* Down-pointing arrow */}
              <div className="w-[6px] h-[6px] bg-[#01472e] rotate-45 absolute bottom-[-3px] left-1/2 -ml-[3px]" />
            </div>
          )}

          {/* Bottom Legend */}
          <div className="flex items-center justify-end gap-1.5 text-xs text-[#6b7280] font-sans font-semibold mt-4">
            <span>Not worked</span>
            <div className="w-3 h-3 rounded-[3px] bg-[#e9edc9] border border-[#01472e]/5" />
            <div className="w-3 h-3 rounded-[3px] bg-[#01472e]" />
            <span>Worked</span>
          </div>
        </div>
      )}
    </div>
  );
}
