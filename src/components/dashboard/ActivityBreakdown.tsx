"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Loader2 } from "lucide-react";

interface ActivityBreakdownProps {
  userId: string;
}

export default function ActivityBreakdown({ userId }: ActivityBreakdownProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [percentages, setPercentages] = useState({
    quiz: 0,
    upload: 0,
    study_session: 0,
    notes: 0
  });
  const [totalActivities, setTotalActivities] = useState(0);

  // Format date as local YYYY-MM-DD
  const toLocalDateString = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (!userId) return;

    async function fetchBreakdown() {
      try {
        setLoading(true);
        setError(null);

        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        const oneYearAgoStr = toLocalDateString(oneYearAgo);

        const { data, error: fetchError } = await supabase
          .from("study_activity")
          .select("activity_type")
          .eq("user_id", userId)
          .gte("activity_date", oneYearAgoStr);

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        let quizCount = 0;
        let uploadCount = 0;
        let sessionCount = 0;
        let notesCount = 0;

        if (data) {
          data.forEach((row: any) => {
            if (row.activity_type === "quiz") quizCount++;
            else if (row.activity_type === "upload") uploadCount++;
            else if (row.activity_type === "study_session") sessionCount++;
            else if (row.activity_type === "notes") notesCount++;
          });
        }

        const total = quizCount + uploadCount + sessionCount + notesCount;
        setTotalActivities(total);

        if (total > 0) {
          setPercentages({
            quiz: Math.round((quizCount / total) * 100),
            upload: Math.round((uploadCount / total) * 100),
            study_session: Math.round((sessionCount / total) * 100),
            notes: Math.round((notesCount / total) * 100)
          });
        } else {
          setPercentages({ quiz: 0, upload: 0, study_session: 0, notes: 0 });
        }
      } catch (err: any) {
        setError(err.message || "Failed to load activity breakdown.");
      } finally {
        setLoading(false);
      }
    }

    fetchBreakdown();
  }, [userId, supabase]);

  return (
    <div className="bg-white border border-[#e4e7f0] rounded-xl p-5 text-left relative z-20 w-full h-full shadow-xs flex flex-col justify-between">
      <div className="space-y-0.5">
        <h3 className="font-sans font-semibold text-[15px] text-[#01472e] leading-snug">
          Activity Breakdown
        </h3>
        <p className="font-sans text-[11px] text-[#6b7280]">
          Your study activity by type
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-[10px] rounded-xl p-2.5 mt-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex-grow flex items-center justify-center mt-4">
        {loading ? (
          <div className="flex items-center gap-2 py-10">
            <Loader2 className="w-4 h-4 animate-spin text-[#01472e]" />
            <span className="text-xs text-[#01472e]/60 font-semibold">Loading breakdown...</span>
          </div>
        ) : (
          <div className="w-full bg-[#0f1a14] rounded-xl p-4 relative flex flex-col justify-between h-[200px] overflow-hidden">
            {/* The Crosshair Area */}
            <div className="relative w-[150px] h-[150px] mx-auto mt-2">
              {/* Horizontal Line */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#2d6a4f] -translate-y-1/2" />
              {/* Vertical Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#2d6a4f] -translate-x-1/2" />
              
              {/* Center Dot */}
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#00ff88] -translate-x-1/2 -translate-y-1/2" />

              {/* Glowing Dots along axes */}
              {/* Top - Quiz */}
              <div 
                className="absolute w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={{
                  left: "50%",
                  top: `${50 - percentages.quiz * 0.45}%`
                }}
              />
              {/* Right - Upload */}
              <div 
                className="absolute w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={{
                  left: `${50 + percentages.upload * 0.45}%`,
                  top: "50%"
                }}
              />
              {/* Bottom - Study Session */}
              <div 
                className="absolute w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={{
                  left: "50%",
                  top: `${50 + percentages.study_session * 0.45}%`
                }}
              />
              {/* Left - Notes */}
              <div 
                className="absolute w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={{
                  left: `${50 - percentages.notes * 0.45}%`,
                  top: "50%"
                }}
              />

              {/* Axis Labels */}
              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 text-center w-full select-none">
                <span className="text-[10px] text-[#a0aec0] font-sans block leading-none font-bold">
                  {percentages.quiz}%
                </span>
                <span className="text-[9px] text-[#a0aec0]/70 font-sans block leading-none mt-0.5">
                  Quiz
                </span>
              </div>

              <div className="absolute right-[-15px] top-1/2 -translate-y-1/2 text-left select-none">
                <span className="text-[10px] text-[#a0aec0] font-sans block leading-none font-bold">
                  {percentages.upload}%
                </span>
                <span className="text-[9px] text-[#a0aec0]/70 font-sans block leading-none mt-0.5">
                  Upload
                </span>
              </div>

              <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 text-center w-full select-none">
                <span className="text-[9px] text-[#a0aec0]/70 font-sans block leading-none">
                  Session
                </span>
                <span className="text-[10px] text-[#a0aec0] font-sans block leading-none font-bold mt-0.5">
                  {percentages.study_session}%
                </span>
              </div>

              <div className="absolute left-[-15px] top-1/2 -translate-y-1/2 text-right select-none">
                <span className="text-[10px] text-[#a0aec0] font-sans block leading-none font-bold">
                  {percentages.notes}%
                </span>
                <span className="text-[9px] text-[#a0aec0]/70 font-sans block leading-none mt-0.5">
                  Notes
                </span>
              </div>
            </div>

            {totalActivities === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0f1a14]/90 rounded-xl backdrop-blur-[0.5px] z-10">
                <span className="text-xs text-[#a0aec0] font-sans font-semibold">
                  No activity yet
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
