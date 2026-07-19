"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { LogOut, User, Mail, GraduationCap } from "lucide-react";
import { getCookie, deleteCookie } from "@/lib/cookieHelper";

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      let currentUser: any = null;
      
      try {
        const { data } = await supabase.auth.getUser();
        currentUser = data?.user;
      } catch (err) {
        console.warn("Supabase user fetch failed in dashboard, checking mock cookie...", err);
      }

      if (!currentUser) {
        const mockUserCookie = getCookie("studycoach_mock_user");
        if (mockUserCookie) {
          try {
            currentUser = JSON.parse(decodeURIComponent(mockUserCookie));
          } catch (e) {
            console.error("Failed to parse mock cookie in dashboard", e);
          }
        }
      }

      if (!currentUser) {
        router.push("/sign-in");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    }
    getUser();
  }, [router, supabase]);

  const handleSignOut = async () => {
    deleteCookie("studycoach_mock_user");
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase signOut failed, continuing locally:", err);
    }
    router.push("/sign-in");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#fefae0] font-sans">
        <div className="font-mono text-xs text-[#01472e]/60 uppercase tracking-widest animate-pulse">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const fullName = user.user_metadata?.full_name || "StudyCoach Student";
  const email = user.email || "";

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-[#fefae0] p-4 select-none overflow-hidden font-sans">
      
      {/* Persistent SVG Noise Overlay (4% opacity) */}
      <div className="pointer-events-none fixed inset-0 z-[999] opacity-[0.04] select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.75" 
              numOctaves="3" 
              stitchTiles="stitch" 
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Earthy theme decorative glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#ccd5ae]/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#a3b18a]/30 blur-[120px] pointer-events-none" />

      {/* Centered card with clean exit/entry animation */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.15 }}
        className="w-full max-w-[480px] bg-white border border-[#01472e]/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10"
      >
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-[#ccd5ae]/30 flex items-center justify-center mb-2 text-[#01472e]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-display text-xl tracking-tight text-[#01472e] font-bold uppercase">
            StudyCoach
          </span>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="font-sans text-xl md:text-2xl font-extrabold text-[#01472e] tracking-tight leading-none mb-2.5">
            Student Dashboard
          </h2>
          <p className="font-sans text-xs text-[#01472e]/60 leading-relaxed">
            Welcome back to your personalised study program
          </p>
        </div>

        {/* User profile details box */}
        <div className="space-y-3.5 bg-[#fefae0]/40 border border-[#01472e]/10 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#01472e]/10 flex items-center justify-center text-[#01472e]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[8px] font-bold text-[#01472e]/50 uppercase tracking-wider block">
                Full Name
              </span>
              <span className="text-xs font-bold text-[#01472e]">
                {fullName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-[#01472e]/5 pt-3">
            <div className="w-8 h-8 rounded-full bg-[#01472e]/10 flex items-center justify-center text-[#01472e]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[8px] font-bold text-[#01472e]/50 uppercase tracking-wider block">
                Email Address
              </span>
              <span className="text-xs font-bold text-[#01472e]">
                {email}
              </span>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <motion.button 
          onClick={handleSignOut}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#01472e] text-[#fefae0] font-bold uppercase tracking-[0.25em] text-[10px] md:text-xs py-4.5 rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 flex justify-center items-center gap-2 border border-transparent"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </motion.button>

      </motion.div>
    </div>
  );
}
