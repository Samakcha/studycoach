"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { InteractiveRobotSpline } from "@/components/ui/interactive-3d-robot";
import TiltedCard from "@/components/ui/TiltedCard";
import { setCookie } from "@/lib/cookieHelper";

export default function SignIn() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [envMissing, setEnvMissing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Parallax Mouse Event Listener & Env Validation
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Check if env variables are empty or placeholder values
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || url.trim() === "" || key.trim() === "") {
      setEnvMissing(true);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth / 2) / 35;
      const y = (clientY - window.innerHeight / 2) / 35;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // If configuration is missing, fall back to Demo Mode directly
    if (envMissing) {
      console.info("Supabase configuration missing, entering Demo Mode.");
      
      if (typeof window !== "undefined") {
        const existingMockUsersStr = localStorage.getItem("studycoach_mock_users");
        const existingMockUsers = existingMockUsersStr ? JSON.parse(existingMockUsersStr) : {};
        const lowerEmail = email.toLowerCase();
        
        let mockUser = existingMockUsers[lowerEmail];
        if (!mockUser) {
          mockUser = {
            id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            email: email,
            user_metadata: {
              full_name: email.split("@")[0],
            },
            onboarding_completed: false,
          };
          existingMockUsers[lowerEmail] = mockUser;
          localStorage.setItem("studycoach_mock_users", JSON.stringify(existingMockUsers));
        }

        setCookie("studycoach_mock_user", JSON.stringify(mockUser), 7);

        if (mockUser.onboarding_completed) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      }
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      const isFetchError = err?.message?.includes("fetch") || err?.message?.includes("NetworkError") || err?.message?.includes("Failed to fetch");

      if (isFetchError) {
        console.warn("Supabase connection failed, falling back to Demo Mode:", err.message);
        
        if (typeof window !== "undefined") {
          const existingMockUsersStr = localStorage.getItem("studycoach_mock_users");
          const existingMockUsers = existingMockUsersStr ? JSON.parse(existingMockUsersStr) : {};
          const lowerEmail = email.toLowerCase();
          
          let mockUser = existingMockUsers[lowerEmail];
          if (!mockUser) {
            mockUser = {
              id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              email: email,
              user_metadata: {
                full_name: email.split("@")[0],
              },
              onboarding_completed: false,
            };
            existingMockUsers[lowerEmail] = mockUser;
            localStorage.setItem("studycoach_mock_users", JSON.stringify(existingMockUsers));
          }

          setCookie("studycoach_mock_user", JSON.stringify(mockUser), 7);

          if (mockUser.onboarding_completed) {
            router.push("/dashboard");
          } else {
            router.push("/onboarding");
          }
        }
      } else {
        setError(err?.message || "An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);

    if (envMissing) {
      console.info("Supabase configuration missing, entering Demo Mode via Google sign-in.");
      const mockUser = {
        id: `mock-google-${Date.now()}`,
        email: "google.student@studycoach.com",
        user_metadata: {
          full_name: "Google Student",
        },
        onboarding_completed: false,
      };

      setCookie("studycoach_mock_user", JSON.stringify(mockUser), 7);
      router.push("/onboarding");
      return;
    }

    try {
      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/auth/callback",
        },
      });
      if (oAuthError) {
        setError(oAuthError.message);
      }
    } catch (err: any) {
      console.warn("Google OAuth failed, falling back to Demo Mode:", err);
      const mockUser = {
        id: `mock-google-${Date.now()}`,
        email: "google.student@studycoach.com",
        user_metadata: {
          full_name: "Google Student",
        },
        onboarding_completed: false,
      };

      setCookie("studycoach_mock_user", JSON.stringify(mockUser), 7);
      router.push("/onboarding");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fefae0] font-sans">
      
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

      {/* Fixed, full-width green navbar with centered brand name */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 w-full flex items-center justify-center bg-[#01472e] shadow-md border-b border-[#ccd5ae]/20">
        <Link href="/" className="font-display text-xl md:text-2xl text-[#fefae0] font-bold tracking-tight hover:opacity-90 transition-opacity uppercase cursor-pointer">
          Studycoach
        </Link>
      </nav>

      {/* Split Columns Content Container */}
      <div className="flex flex-col md:flex-row flex-grow w-full pt-16">
        
        {/* Left Section: Interactive 3D Robot Spline surrounded by showcase cards */}
        <div className="w-full md:w-1/2 bg-[#ccd5ae] flex items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-[#01472e]/10 min-h-[50vh] md:min-h-[calc(100vh-4rem)]">
          
          {/* Top-Left Showcase Card (Plan // Calendar) */}
          <div 
            className="absolute top-[6%] left-[3%] lg:top-[10%] lg:left-[6%] z-30 animate-float-1 select-none hidden md:block w-[160px] h-[140px] lg:w-[210px] lg:h-[185px] transition-all duration-700"
          >
            <div
              className="w-full h-full"
              style={{
                transform: `translate3d(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px, 0)`,
                transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            >
              <TiltedCard
                containerWidth="100%"
                containerHeight="100%"
                imageWidth="100%"
                imageHeight="100%"
                scaleOnHover={1.05}
                rotateAmplitude={8}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                  <div className="w-full h-full p-3 lg:p-4.5 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-4.5 h-4.5 rounded bg-[#01472e]/10 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-[#01472e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <span className="font-mono text-[8px] lg:text-[9px] font-bold text-[#01472e]/70 uppercase tracking-wider">Plan // Calendar</span>
                      </div>
                      
                      <div className="space-y-1.5 lg:space-y-2.5">
                        <div>
                          <div className="flex justify-between items-center text-[8px] lg:text-[9px] font-extrabold text-[#01472e] mb-0.5">
                            <span>Ch. 3 Calculus</span>
                            <span className="text-[#01472e]/70 font-mono">90%</span>
                          </div>
                          <div className="w-full h-1 bg-[#01472e]/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#01472e] rounded-full" style={{ width: "90%" }} />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center text-[8px] lg:text-[9px] font-extrabold text-[#01472e] mb-0.5">
                            <span>Ch. 4 Vectors</span>
                            <span className="text-[#01472e]/70 font-mono">45%</span>
                          </div>
                          <div className="w-full h-1 bg-[#01472e]/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#a3b18a] rounded-full" style={{ width: "45%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1.5 border-t border-[#01472e]/10 mt-1.5">
                      <span className="text-[7.5px] lg:text-[8.5px] font-bold text-[#01472e]/50 uppercase tracking-wider">Explore Workflow</span>
                      <div className="w-4.5 h-4.5 rounded-full bg-[#01472e] text-cream flex items-center justify-center shadow-sm">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Top-Right Showcase Card (Analytics // Map) */}
          <div 
            className="absolute top-[8%] right-[3%] lg:top-[12%] lg:right-[6%] z-30 animate-float-2 select-none hidden md:block w-[160px] h-[130px] lg:w-[210px] lg:h-[175px] transition-all duration-700"
          >
            <div
              className="w-full h-full"
              style={{
                transform: `translate3d(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px, 0)`,
                transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            >
              <TiltedCard
                containerWidth="100%"
                containerHeight="100%"
                imageWidth="100%"
                imageHeight="100%"
                scaleOnHover={1.05}
                rotateAmplitude={8}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                  <div className="w-full h-full p-3 lg:p-4.5 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-4.5 h-4.5 rounded bg-[#01472e]/10 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-[#01472e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="font-mono text-[8px] lg:text-[9px] font-bold text-[#01472e]/70 uppercase tracking-wider">Analytics // Map</span>
                      </div>
                      
                      <div className="flex items-end gap-2 justify-between my-0.5">
                        <div className="flex flex-col">
                          <span className="font-mono text-[7px] lg:text-[8px] font-bold text-[#01472e]/50 uppercase tracking-wider">Accuracy</span>
                          <span className="font-sans text-base lg:text-xl font-black text-[#01472e] tracking-tight leading-none">92.4%</span>
                        </div>
                        <div className="w-14 lg:w-20 h-7 lg:h-9">
                          <svg className="w-full h-full" viewBox="0 0 100 40">
                            <path d="M0 35 Q15 25, 30 28 T60 12 T100 5" fill="none" stroke="#01472e" strokeWidth="3.5" strokeLinecap="round" />
                            <circle cx="100" cy="5" r="3.5" fill="#01472e" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1.5 border-t border-[#01472e]/10 mt-1.5">
                      <span className="text-[7.5px] lg:text-[8.5px] font-bold text-[#01472e]/50 uppercase tracking-wider">Meet Agents</span>
                      <div className="w-4.5 h-4.5 rounded-full bg-[#01472e] text-cream flex items-center justify-center shadow-sm">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Bottom-Left Showcase Card (Quiz // Recall) */}
          <div 
            className="absolute bottom-[10%] left-[2.5%] lg:bottom-[15%] lg:left-[5%] z-30 animate-float-3 select-none hidden md:block w-[160px] h-[135px] lg:w-[210px] lg:h-[185px] transition-all duration-700"
          >
            <div
              className="w-full h-full"
              style={{
                transform: `translate3d(${mousePos.x * -0.7}px, ${mousePos.y * -0.7}px, 0)`,
                transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            >
              <TiltedCard
                containerWidth="100%"
                containerHeight="100%"
                imageWidth="100%"
                imageHeight="100%"
                scaleOnHover={1.05}
                rotateAmplitude={8}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                  <div className="w-full h-full p-3 lg:p-4.5 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-4.5 h-4.5 rounded bg-[#01472e]/10 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-[#01472e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h0a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <span className="font-mono text-[8px] lg:text-[9px] font-bold text-[#01472e]/70 uppercase tracking-wider">Quiz // Recall</span>
                      </div>
                      
                      <div className="space-y-1.5 my-0.5">
                        <p className="font-sans text-[8px] lg:text-[10px] font-extrabold text-[#01472e] leading-snug">"Define active recall interval?"</p>
                        <div className="flex gap-1">
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#01472e]/10 border border-[#01472e]/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#01472e]" />
                            <span className="font-sans text-[7.5px] lg:text-[8.5px] font-extrabold text-[#01472e] uppercase tracking-wider">Spaced</span>
                          </div>
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/20 border border-[#01472e]/5">
                            <div className="w-1.5 h-1.5 rounded-full border border-[#01472e]/30" />
                            <span className="font-sans text-[7.5px] lg:text-[8.5px] font-bold text-[#01472e]/60 uppercase tracking-wider">Linear</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1.5 border-t border-[#01472e]/10 mt-1.5">
                      <span className="text-[7.5px] lg:text-[8.5px] font-bold text-[#01472e]/50 uppercase tracking-wider">View Features</span>
                      <div className="w-4.5 h-4.5 rounded-full bg-[#01472e] text-cream flex items-center justify-center shadow-sm">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Bottom-Right Showcase Card (Readiness // Score) */}
          <div 
            className="absolute bottom-[8%] right-[2.5%] lg:bottom-[13%] lg:right-[5%] z-30 animate-float-4 select-none hidden md:block w-[150px] h-[120px] lg:w-[200px] lg:h-[165px] transition-all duration-700"
          >
            <div
              className="w-full h-full"
              style={{
                transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`,
                transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            >
              <TiltedCard
                containerWidth="100%"
                containerHeight="100%"
                imageWidth="100%"
                imageHeight="100%"
                scaleOnHover={1.05}
                rotateAmplitude={8}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                  <div className="w-full h-full p-3 lg:p-4.5 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-4.5 h-4.5 rounded bg-[#01472e]/10 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-[#01472e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <span className="font-mono text-[8px] lg:text-[9px] font-bold text-[#01472e]/70 uppercase tracking-wider">Readiness // Score</span>
                      </div>
                      
                      <div className="flex items-center gap-2.5 my-0.5">
                        <div className="relative w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(1, 71, 46, 0.08)" strokeWidth="3" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#01472e" strokeWidth="3.2" strokeDasharray="95 5" strokeLinecap="round" />
                          </svg>
                          <span className="absolute font-sans text-[8px] lg:text-[9.5px] font-black text-[#01472e]">95%</span>
                        </div>
                        
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="font-mono text-[7px] lg:text-[8px] font-bold text-[#01472e]/50 uppercase tracking-wider">Status</span>
                          <span className="px-1.5 py-0.5 rounded-full bg-[#01472e] text-cream font-sans text-[6.5px] lg:text-[7.5px] font-extrabold uppercase tracking-wider">READY</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1.5 border-t border-[#01472e]/10 mt-1.5">
                      <span className="text-[7.5px] lg:text-[8.5px] font-bold text-[#01472e]/50 uppercase tracking-wider">Join Portal</span>
                      <div className="w-4.5 h-4.5 rounded-full bg-[#01472e] text-cream flex items-center justify-center shadow-sm">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Interactive 3D Robot Spline */}
          <div 
            className="w-full h-[50vh] md:h-[75vh] relative z-20 earthy-robot-filter pointer-events-auto"
            style={{
              transform: "translateY(22vh)",
              transformOrigin: "bottom center",
            }}
          >
            <InteractiveRobotSpline
              scene="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"
              className="w-full h-full"
            />
          </div>
          {/* Ambient glows behind the robot */}
          <div className="absolute inset-0 bg-radial-gradient from-white/20 to-transparent pointer-events-none z-10" />
        </div>

        {/* Right Section: Sign-In Form Card */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10 min-h-[calc(100vh-4rem)]">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#ccd5ae]/30 blur-[100px] pointer-events-none" />
          
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.15 }}
            className="w-full max-w-[420px] bg-white border border-[#01472e]/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10 text-center"
          >
            {/* Soft Green Logo Icon */}
            <div className="w-12 h-12 rounded-2xl bg-[#ccd5ae]/30 text-[#01472e] flex items-center justify-center mb-4 mx-auto">
              <GraduationCap className="w-6 h-6" />
            </div>

            {/* Heading & Subtitle */}
            <div className="text-center mb-8">
              <h2 className="font-sans text-2xl font-bold text-[#01472e] tracking-tight leading-none mb-2">
                Welcome back
              </h2>
              <p className="font-sans text-xs text-[#01472e]/60 font-medium">
                Sign in to continue your study plan
              </p>
            </div>

            {/* Environment Variables Warning Banner */}
            {envMissing && (
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3.5 mb-6 font-medium text-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                <div>
                  <p className="font-bold mb-0.5">Configuration Required</p>
                  <p className="text-[10px] leading-relaxed text-amber-700/80 font-sans">
                    Supabase connection details are missing. Please ensure <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[9px]">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[9px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are configured in your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[9px]">.env.local</code>.
                  </p>
                </div>
              </div>
            )}

            {/* Alerts for error */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3.5 mb-6 font-medium text-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Address Input */}
              <div className="flex items-center gap-3 bg-white border border-[#01472e]/10 rounded-2xl px-4 py-2.5 focus-within:border-[#01472e]/30 transition-all duration-300 focus-within:bg-white focus-within:shadow-sm">
                <Mail className="w-5 h-5 text-[#01472e]/40 shrink-0" />
                <div className="h-6 w-[1px] bg-[#01472e]/10 shrink-0" />
                <div className="flex-grow flex flex-col text-left">
                  <label htmlFor="email" className="font-mono text-[8px] font-bold text-[#01472e]/50 uppercase tracking-wider mb-0.5">
                    Email address
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    className="w-full bg-transparent border-0 p-0 text-xs font-semibold text-[#01472e] focus:outline-none focus:ring-0 placeholder:text-[#01472e]/25"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex items-center gap-3 bg-white border border-[#01472e]/10 rounded-2xl px-4 py-2.5 focus-within:border-[#01472e]/30 transition-all duration-300 focus-within:bg-white focus-within:shadow-sm relative">
                <Lock className="w-5 h-5 text-[#01472e]/40 shrink-0" />
                <div className="h-6 w-[1px] bg-[#01472e]/10 shrink-0" />
                <div className="flex-grow flex flex-col text-left pr-8">
                  <label htmlFor="password" className="font-mono text-[8px] font-bold text-[#01472e]/50 uppercase tracking-wider mb-0.5">
                    Password
                  </label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-transparent border-0 p-0 text-xs font-semibold text-[#01472e] focus:outline-none focus:ring-0 placeholder:text-[#01472e]/25"
                    autoComplete="current-password"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#01472e]/40 hover:text-[#01472e] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Action Button */}
              <motion.button 
                type="submit"
                disabled={loading}
                onHoverStart={() => !loading && setIsHovered(true)}
                onHoverEnd={() => !loading && setIsHovered(false)}
                initial={{ width: 44 }}
                animate={{ 
                  width: loading ? 180 : (isHovered ? 180 : 44),
                }}
                whileTap={loading ? {} : { scale: 0.99 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto flex items-center justify-center overflow-hidden relative shadow-lg bg-[#01472e] text-white font-bold text-xs rounded-full mt-6 shadow-[#01472e]/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  height: 44,
                  boxShadow: "0 10px 25px -5px rgba(1, 71, 46, 0.3)",
                }}
              >
                {/* Arrow Icon */}
                <motion.div
                  className="absolute"
                  animate={{ 
                    opacity: (isHovered || loading) ? 0 : 1,
                    scale: (isHovered || loading) ? 0.8 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="text-white w-4 h-4" />
                </motion.div>

                {/* Text Label */}
                <motion.div
                  className="w-full flex justify-center items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: (isHovered || loading) ? 1 : 0 }}
                  transition={{ duration: 0.2, delay: (isHovered || loading) ? 0.1 : 0 }}
                >
                  <span className="text-white text-[10px] font-bold uppercase tracking-[0.25em] whitespace-nowrap pl-1">
                    {loading ? "Signing in..." : "Sign in"}
                  </span>
                </motion.div>
              </motion.button>
            </form>

            {/* Back Link to Sign Up */}
            <div className="text-center mt-6 text-xs text-[#01472e]/60 font-sans">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-[#01472e] hover:text-[#01472e]/85 font-bold underline transition-colors cursor-pointer">
                Sign up
              </Link>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
