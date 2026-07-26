"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, User, AlertCircle, GraduationCap, Target, Calendar, ArrowRight, Check, Star, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { InteractiveRobotSpline } from "@/components/ui/interactive-3d-robot";

export default function Onboarding() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [gradeClass, setGradeClass] = useState("");
  const [examTarget, setExamTarget] = useState("");
  const [examDate, setExamDate] = useState("");
  
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parallax Mouse Event Listener
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth / 2) / 35;
      const y = (clientY - window.innerHeight / 2) / 35;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch logged in user and exams on mount
  useEffect(() => {
    async function initOnboarding() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          setError("No authenticated user found. Please log in.");
          router.push("/sign-in");
          return;
        }

        setCurrentUser(user);
        if (user.user_metadata?.full_name) {
          setFullName(user.user_metadata.full_name);
        }

        const { data: examsData, error: examsError } = await supabase
          .from("exams")
          .select("*");

        if (examsError) {
          throw new Error(`Failed to load exams: ${examsError.message}`);
        }
        setExams(examsData || []);
      } catch (err: any) {
        setError(err?.message || "Failed to load initial onboarding data.");
      }
    }
    initOnboarding();
  }, [supabase, router]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Clean up previous preview URL to prevent memory leak
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError("No authenticated user found. Please log in.");
      return;
    }
    if (!selectedExamId) {
      setError("Please select an exam target.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let finalAvatarUrl = "";

      // 1. Upload Avatar to Supabase Storage "avatars" bucket if a file was selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const filePath = `${currentUser.id}/avatar.${fileExt}`;

        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, {
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Avatar upload failed: ${uploadError.message}. Make sure the "avatars" storage bucket exists in Supabase.`);
        }

        // Get public URL
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        finalAvatarUrl = data.publicUrl;
      }

      // Step 1: Check if user exists in public.users
      const { data: existingUser, error: userFetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', currentUser.id)
        .maybeSingle();

      // Step 2: If user doesn't exist, create them
      if (!existingUser) {
        const { error: userCreateError } = await supabase
          .from('users')
          .insert({
            id: currentUser.id,
            email: currentUser.email,
            name: fullName,
            onboarding_completed: false
          });
        if (userCreateError) throw userCreateError;
      }

      // Step 3: Then update the user profile
      const { error: profileError } = await supabase
        .from('users')
        .update({
          name: fullName,
          avatar_url: finalAvatarUrl || null,
          grade_class: gradeClass,
          exam_target: examTarget,
          onboarding_completed: true
        })
        .eq('id', currentUser.id);

      if (profileError) {
        throw new Error(`Failed to update profile details: ${profileError.message}`);
      }

      // 3. Fetch exam subjects for the selected exam
      const { data: examSubjects, error: fetchSubjectsError } = await supabase
        .from("exam_subjects")
        .select("*")
        .eq("exam_id", selectedExamId);

      if (fetchSubjectsError) {
        throw new Error(`Failed to retrieve exam subjects: ${fetchSubjectsError.message}`);
      }

      // 4. Insert a row into public.subjects for each exam subject
      if (examSubjects && examSubjects.length > 0) {
        const subjectsToInsert = examSubjects.map((subject) => ({
          user_id: currentUser.id,
          exam_id: selectedExamId,
          name: subject.name,
          exam_date: examDate,
          pdf_uploaded: false,
        }));

        const { error: insertSubjectsError } = await supabase
          .from("subjects")
          .insert(subjectsToInsert);

        if (insertSubjectsError) {
          throw new Error(`Failed to initialize subjects: ${insertSubjectsError.message}`);
        }
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fefae0] font-sans pb-12 pt-24 px-4 items-center justify-center select-none overflow-x-hidden">
      
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

      {/* Big Centered Container Card (Left: Form, Right: Illustration) */}
      <div className="w-full max-w-[1020px] bg-white border border-[#01472e]/10 rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col md:flex-row overflow-hidden min-h-[660px]">
        
        {/* Left Side: Onboarding Form (White Background) */}
        <div className="w-full md:w-[52%] bg-white p-8 md:p-12 flex flex-col justify-between">
          
          {/* Heading and Avatar Side-by-Side Flex Row */}
          <div className="flex items-start justify-between gap-6 mb-6">
            
            {/* Title & Subtext */}
            <div className="flex-grow flex flex-col text-left">
              <h2 className="font-sans text-3xl font-black text-[#01472e] tracking-tight leading-[1.1] mb-2 max-w-[210px]">
                Let's set up your profile
              </h2>
              <p className="font-sans text-[11px] text-[#01472e]/60 font-semibold leading-relaxed max-w-[220px]">
                Tell us a little about yourself so we can personalise your study experience.
              </p>
            </div>

            {/* Avatar Upload (Dashed circle, green camera badge) */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative w-20 h-20">
                <div 
                  onClick={triggerFileSelect}
                  className="w-full h-full rounded-full overflow-hidden border border-dashed border-[#01472e]/25 bg-[#f4f6f0] flex items-center justify-center cursor-pointer shadow-inner transition-all hover:border-[#01472e]/45 duration-300"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-[#01472e]/25" />
                  )}
                </div>
                
                {/* Camera badge on bottom-right */}
                <div 
                  onClick={triggerFileSelect}
                  className="absolute bottom-0 right-0 w-6.5 h-6.5 rounded-full bg-[#01472e] text-white flex items-center justify-center cursor-pointer shadow-md border border-white hover:bg-[#01472e]/90 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <span className="font-sans text-[10px] font-bold text-[#01472e] mt-2">
                Upload photo
              </span>
              <span className="font-sans text-[8px] text-[#01472e]/40 mt-0.5">
                JPG, PNG or WEBP. Max 2MB
              </span>

              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>

          </div>

          {/* Alerts for error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3.5 mb-6 font-medium text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields & Submit button */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-left w-full flex-grow flex flex-col justify-end">
            
            {/* Full Name Input */}
            <div className="flex items-center gap-3.5 bg-white border border-[#01472e]/10 rounded-2xl px-4 py-2 focus-within:border-[#01472e]/30 transition-all duration-300 focus-within:bg-white focus-within:shadow-sm">
              <User className="w-5 h-5 text-[#01472e]/40 shrink-0" />
              <div className="flex-grow flex flex-col text-left">
                <label htmlFor="fullName" className="font-sans text-[8px] font-bold text-[#01472e]/50 uppercase tracking-wider mb-0.5">
                  Full name
                </label>
                <input 
                  type="text" 
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Samakcha Mishra" 
                  className="w-full bg-transparent border-0 p-0 text-xs font-semibold text-[#01472e] focus:outline-none focus:ring-0 placeholder:text-[#01472e]/25"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Grade / Class Dropdown */}
            <div className="flex items-center gap-3.5 bg-white border border-[#01472e]/10 rounded-2xl px-4 py-2 focus-within:border-[#01472e]/30 transition-all duration-300 focus-within:bg-white focus-within:shadow-sm">
              <GraduationCap className="w-5 h-5 text-[#01472e]/40 shrink-0" />
              <div className="flex-grow flex flex-col text-left relative">
                <label htmlFor="gradeClass" className="font-sans text-[8px] font-bold text-[#01472e]/50 uppercase tracking-wider mb-0.5">
                  Grade / Class
                </label>
                <div className="relative w-full flex items-center">
                  <select
                    id="gradeClass"
                    required
                    value={gradeClass}
                    onChange={(e) => setGradeClass(e.target.value)}
                    className="w-full bg-transparent border-0 p-0 pr-8 text-xs font-semibold text-[#01472e] focus:outline-none focus:ring-0 cursor-pointer appearance-none"
                  >
                    <option value="" className="bg-white">Select your grade</option>
                    <option value="Class 9" className="bg-white">Class 9</option>
                    <option value="Class 10" className="bg-white">Class 10</option>
                    <option value="Class 11" className="bg-white">Class 11</option>
                    <option value="Class 12" className="bg-white">Class 12</option>
                    <option value="Dropper/Repeater" className="bg-white">Dropper/Repeater</option>
                    <option value="College" className="bg-white">College</option>
                  </select>
                  <ChevronDown className="absolute right-0 w-4 h-4 text-[#01472e]/40 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Exam Target Dropdown */}
            <div className="flex items-center gap-3.5 bg-white border border-[#01472e]/10 rounded-2xl px-4 py-2 focus-within:border-[#01472e]/30 transition-all duration-300 focus-within:bg-white focus-within:shadow-sm">
              <Target className="w-5 h-5 text-[#01472e]/40 shrink-0" />
              <div className="flex-grow flex flex-col text-left relative">
                <label htmlFor="examTarget" className="font-sans text-[8px] font-bold text-[#01472e]/50 uppercase tracking-wider mb-0.5">
                  Exam Target
                </label>
                <div className="relative w-full flex items-center">
                  <select
                    id="examTarget"
                    required
                    value={selectedExamId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedExamId(id);
                      const matched = exams.find((ex) => ex.id === id);
                      setExamTarget(matched ? matched.title : "");
                    }}
                    className="w-full bg-transparent border-0 p-0 pr-8 text-xs font-semibold text-[#01472e] focus:outline-none focus:ring-0 cursor-pointer appearance-none"
                  >
                    <option value="" className="bg-white">Select your exam</option>
                    {exams.map((exam) => (
                      <option key={exam.id} value={exam.id} className="bg-white">
                        {exam.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-0 w-4 h-4 text-[#01472e]/40 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Exam Date Picker */}
            <div className="flex items-center gap-3.5 bg-white border border-[#01472e]/10 rounded-2xl px-4 py-2 focus-within:border-[#01472e]/30 transition-all duration-300 focus-within:bg-white focus-within:shadow-sm">
              <Calendar className="w-5 h-5 text-[#01472e]/40 shrink-0" />
              <div className="flex-grow flex flex-col text-left">
                <label htmlFor="examDate" className="font-sans text-[8px] font-bold text-[#01472e]/50 uppercase tracking-wider mb-0.5">
                  Exam Date (Optional)
                </label>
                <input
                  type="date"
                  id="examDate"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-transparent border-0 p-0 text-xs font-semibold text-[#01472e] focus:outline-none focus:ring-0 cursor-pointer"
                  style={{ colorScheme: "light" }}
                />
              </div>
            </div>

            {/* Continue Action Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#01472e] hover:bg-[#01472e]/95 text-white font-bold text-xs py-3.5 rounded-2xl mt-6 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Personalising..." : "Continue"}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Bottom Disclaimer */}
            <p className="text-center text-[10px] text-[#01472e]/40 font-medium pt-2 w-full">
              You can change this later in your settings.
            </p>

          </form>
        </div>

        {/* Right Side: Illustration & Text panel (Soft Green Gradient) */}
        <div className="w-full md:w-[48%] bg-gradient-to-br from-[#ebf0db] to-[#ccd5ae]/20 p-8 md:p-10 flex flex-col justify-between items-start text-left relative overflow-hidden border-t md:border-t-0 md:border-l border-[#01472e]/10">
          
          {/* Top Header Text Section */}
          <div className="flex flex-col items-start gap-4 mb-4 z-10 w-full">
            
            {/* Welcome Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/75 backdrop-blur-sm border border-white/50 shadow-sm text-[#01472e] font-sans text-[9px] font-bold tracking-tight">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>Welcome to StudyCoach</span>
            </div>

            {/* Heading */}
            <h2 className="font-sans text-2xl font-black text-[#01472e] tracking-tight leading-[1.2] max-w-xs">
              Your journey to success starts here.
            </h2>
            
            {/* Subtext */}
            <p className="font-sans text-[11px] text-[#01472e]/70 font-semibold leading-relaxed max-w-[280px]">
              We'll help you plan, learn and achieve your goals smarter, every day.
            </p>
          </div>

          {/* Floating Pill Badges around 3D Robot */}
          {/* Smart Study Plans Badge */}
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
            className="absolute top-[38%] left-[4%] z-30 bg-white/95 backdrop-blur-sm border border-[#01472e]/5 px-3 py-2 rounded-2xl shadow-md flex items-center gap-2"
          >
            <div className="w-5 h-5 rounded-lg bg-[#01472e] flex items-center justify-center text-white shrink-0">
              <Calendar className="w-3 h-3 text-white" />
            </div>
            <span className="font-sans text-[9px] font-bold text-[#01472e] tracking-tight">Smart Study Plans</span>
          </motion.div>

          {/* Practice Quizzes Badge */}
          <motion.div 
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 4.6, ease: "easeInOut" }}
            className="absolute top-[40%] right-[4%] z-30 bg-white/95 backdrop-blur-sm border border-[#01472e]/5 px-3 py-2 rounded-2xl shadow-md flex items-center gap-2"
          >
            <div className="w-5 h-5 rounded-lg bg-[#01472e] flex items-center justify-center text-white shrink-0">
              <span className="text-[10px] font-black text-white font-sans">?</span>
            </div>
            <span className="font-sans text-[9px] font-bold text-[#01472e] tracking-tight">Practice Quizzes</span>
          </motion.div>

          {/* Track Progress Badge */}
          <motion.div 
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 0.3 }}
            className="absolute bottom-[28%] left-[2%] z-30 bg-white/95 backdrop-blur-sm border border-[#01472e]/5 px-3 py-2 rounded-2xl shadow-md flex items-center gap-2"
          >
            <div className="w-5 h-5 rounded-lg bg-[#01472e] flex items-center justify-center text-white shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4" />
              </svg>
            </div>
            <span className="font-sans text-[9px] font-bold text-[#01472e] tracking-tight">Track Progress</span>
          </motion.div>

          {/* Stay Motivated Badge */}
          <motion.div 
            animate={{ y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.1 }}
            className="absolute bottom-[26%] right-[2%] z-30 bg-white/95 backdrop-blur-sm border border-[#01472e]/5 px-3 py-2 rounded-2xl shadow-md flex items-center gap-2"
          >
            <div className="w-5 h-5 rounded-lg bg-[#01472e] flex items-center justify-center text-white shrink-0">
              <Star className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="font-sans text-[9px] font-bold text-[#01472e] tracking-tight">Stay Motivated</span>
          </motion.div>

          {/* Interactive 3D Robot Spline - Clipped Container to hide logo watermark */}
          <div className="relative w-full flex-grow flex items-center justify-center min-h-[270px] z-20">
            <div className="w-[300px] h-[250px] overflow-hidden earthy-robot-filter pointer-events-auto relative">
              <div className="absolute top-[-50px] left-[-30px] w-[360px] h-[360px]">
                <InteractiveRobotSpline
                  scene="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"
                  className="w-full h-full scale-[0.8] translate-y-8"
                />
              </div>
            </div>
          </div>
          
          {/* Ambient glows behind the robot */}
          <div className="absolute inset-0 bg-radial-gradient from-white/20 to-transparent pointer-events-none z-10" />

          {/* Privacy Banner */}
          <div className="w-full bg-white/85 backdrop-blur-sm border border-[#01472e]/5 rounded-2xl p-3 flex items-center justify-between gap-3 mt-auto z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#01472e] flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans text-[10px] font-black text-[#01472e]">
                  Your data is safe with us.
                </span>
                <span className="font-sans text-[8.5px] text-[#01472e]/60 font-semibold leading-none mt-0.5">
                  We respect your privacy and never share your information.
                </span>
              </div>
            </div>
            
            {/* Success Checkmark Indicator */}
            <div className="w-5 h-5 rounded-full bg-[#ccd5ae]/40 text-[#01472e] flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3.5]" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
