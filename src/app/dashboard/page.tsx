"use client";

import dynamic from "next/dynamic";
import { TextRoll } from "@/components/v1/skiper58";

const ShaderBackground = dynamic(() => import("@/components/ui/ShaderBackground"), {
  ssr: false,
});

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  LogOut,
  User,
  Mail,
  GraduationCap,
  Sparkles,
  Calendar,
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  Send,
  Plus,
  Award,
  RefreshCw,
  X,
  Target,
  UploadCloud,
  FileText,
  Check
} from "lucide-react";
import { getCookie, deleteCookie } from "@/lib/cookieHelper";

// Animation presets adhering to Emil Kowalski's ease-out enter rules & scale(0.97) press feedback
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 26,
    },
  },
};

interface StudyTask {
  id: string;
  title: string;
  duration: string;
  subject: string;
  subjectColor: string;
  completed: boolean;
}

interface SubjectItem {
  id: string;
  name: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  nextTopic: string;
  topicCount: number;
  lastStudied: string;
  borderColor: string;
}

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [dbSubjects, setDbSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // AI Coach state
  const [aiInput, setAiInput] = useState("");
  const [aiChat, setAiChat] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "Hello! I'm your StudyCoach AI Assistant. Ask me to generate practice quizzes, clarify tough topics, or create a personalized daily study plan.",
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Color palette sequence for subject cards & task dots
  const subjectColors = ["#01472e", "#2d6a4f", "#52b788", "#74c69d"];

  // Daily Tasks State with durations and subject dots
  const [tasks, setTasks] = useState<StudyTask[]>([
    {
      id: "1",
      title: "Complete 15 Practice Questions",
      duration: "45 min",
      subject: "Mathematics",
      subjectColor: "#01472e",
      completed: true,
    },
    {
      id: "2",
      title: "Review Formula Cheat Sheet & Flashcards",
      duration: "30 min",
      subject: "Physics",
      subjectColor: "#2d6a4f",
      completed: false,
    },
    {
      id: "3",
      title: "AI Practice Quiz & Weak Areas Drill",
      duration: "20 min",
      subject: "Chemistry",
      subjectColor: "#52b788",
      completed: false,
    },
    {
      id: "4",
      title: "30-Min Pomodoro Revision Session",
      duration: "15 min",
      subject: "General Review",
      subjectColor: "#74c69d",
      completed: false,
    },
  ]);

  // Modals States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Upload Modal State variables
  const [uploadFile, setUploadFile] = useState<{ name: string; size: number } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Quiz Modal State variables
  const [quizSubject, setQuizSubject] = useState("Mathematics");
  const [quizStep, setQuizStep] = useState<"select" | "question" | "score">("select");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  // Notes Modal State variables
  const [notesSubject, setNotesSubject] = useState("Mathematics");
  const [copiedNotes, setCopiedNotes] = useState(false);

  // Settings Modal State variables
  const [settingsTab, setSettingsTab] = useState<"profile" | "preferences" | "account">("profile");
  const [editFullName, setEditFullName] = useState("");
  const [editExamTarget, setEditExamTarget] = useState("");
  const [editGradeClass, setEditGradeClass] = useState("");
  const [editExamDate, setEditExamDate] = useState("");
  const [dailyGoalPercent, setDailyGoalPercent] = useState(75);
  const [mockDarkMode, setMockDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Sync edit profile variables when profileData is loaded
  useEffect(() => {
    if (profileData) {
      setEditFullName(profileData.fullName || "");
      setEditExamTarget(profileData.examTarget || "");
      setEditGradeClass(profileData.gradeClass || "");
      setEditExamDate(profileData.examDate || "");
    }
  }, [profileData]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        // Add new subject dynamically
        const newSubjectName = uploadFile.name.split(".")[0].replace(/_/g, " ").replace(/-/g, " ");
        const newSubject: SubjectItem = {
          id: `subj-new-${Date.now()}`,
          name: newSubjectName.charAt(0).toUpperCase() + newSubjectName.slice(1),
          progress: 0,
          totalModules: 10,
          completedModules: 0,
          nextTopic: "Chapter 1 Overview",
          topicCount: 10,
          lastStudied: "Just now",
          borderColor: subjectColors[dbSubjects.length % subjectColors.length],
        };
        setDbSubjects((prev) => [...prev, newSubject]);
        setTimeout(() => {
          setIsUploading(false);
          setUploadFile(null);
          setUploadProgress(0);
          setShowUploadModal(false);
        }, 800);
      }
    }, 200);
  };

  const handleSaveSettings = () => {
    setProfileData((prev: any) => ({
      ...prev,
      fullName: editFullName,
      examTarget: editExamTarget,
      gradeClass: editGradeClass,
      examDate: editExamDate,
    }));
    setShowSettingsModal(false);
  };

  const quizQuestions: Record<string, Array<{ question: string; options: string[]; answer: number }>> = {
    "Mathematics": [
      {
        question: "What is the derivative of f(x) = 3x² + 5x - 2?",
        options: ["f'(x) = 6x + 5", "f'(x) = 3x + 5", "f'(x) = 6x", "f'(x) = 6x - 2"],
        answer: 0,
      },
      {
        question: "If log₂(x) = 5, what is x?",
        options: ["x = 10", "x = 25", "x = 32", "x = 64"],
        answer: 2,
      },
      {
        question: "What is the value of sin(π/6)?",
        options: ["0", "0.5", "√3/2", "1"],
        answer: 1,
      },
    ],
    "Physics": [
      {
        question: "Which of the following is Newton's Second Law?",
        options: ["E = mc²", "F = ma", "v = d/t", "p = mv"],
        answer: 1,
      },
      {
        question: "What is the approximate acceleration due to gravity on Earth's surface?",
        options: ["9.8 m/s²", "8.9 m/s²", "10.5 m/s²", "1.6 m/s²"],
        answer: 0,
      },
      {
        question: "Which color of light is scattered most by Earth's atmosphere, causing the sky to appear blue?",
        options: ["Red", "Green", "Blue", "Yellow"],
        answer: 2,
      },
    ],
    "Chemistry": [
      {
        question: "What is the chemical formula for common table salt?",
        options: ["H₂O", "CO₂", "NaCl", "O₂"],
        answer: 2,
      },
      {
        question: "What is the pH of a perfectly neutral aqueous solution at 25°C?",
        options: ["0", "5", "7", "14"],
        answer: 2,
      },
      {
        question: "Which element has the atomic number 1?",
        options: ["Helium", "Hydrogen", "Oxygen", "Carbon"],
        answer: 1,
      },
    ],
    "General Review": [
      {
        question: "What is the primary focus of active recall as a study technique?",
        options: ["Reading the textbook multiple times", "Highlighting key sentences in color", "Testing your memory by retrieving info", "Listening to lecture recordings"],
        answer: 2,
      },
      {
        question: "Which study technique uses timed focus intervals followed by short breaks?",
        options: ["The Pomodoro Technique", "The Feynman Technique", "The Leitner System", "SQ3R Method"],
        answer: 0,
      },
      {
        question: "What is the recommended sleep duration for optimal cognitive retention and memory consolidation?",
        options: ["3 - 4 hours", "5 - 6 hours", "7 - 9 hours", "10 - 12 hours"],
        answer: 2,
      },
    ],
  };

  const getQuizQuestions = (subjectName: string) => {
    if (subjectName.includes("Math")) return quizQuestions["Mathematics"];
    if (subjectName.includes("Science") || subjectName.includes("Physic")) return quizQuestions["Physics"];
    if (subjectName.includes("Chemis")) return quizQuestions["Chemistry"];
    return quizQuestions["General Review"];
  };

  const mockNotes: Record<string, string[]> = {
    "Mathematics": [
      "📐 Calculus: The derivative of f(x) = x^n is f'(x) = n*x^(n-1). Useful for finding rate of change.",
      "📈 Logarithms: log_b(x) = y is equivalent to b^y = x. Essential property: log(a*b) = log(a) + log(b).",
      "📐 Trigonometry: sin²(θ) + cos²(θ) = 1. Double angle formulas: sin(2θ) = 2sin(θ)cos(θ).",
      "💡 Study Tip: Solve at least 5 derivative problems daily to maintain speed and accuracy."
    ],
    "Physics": [
      "🍎 Mechanics: F = ma (Force = Mass * Acceleration). Friction acts opposite to the direction of motion.",
      "⚡ Electromagnetism: V = IR (Ohm's Law). Power P = VI = I²R.",
      "🌌 Relativity: E = mc² states mass and energy are equivalent and interconvertible.",
      "💡 Study Tip: Always write out variables and units before initiating multi-step formula calculations."
    ],
    "Chemistry": [
      "🧪 Atomic Structure: Atomic number represents protons. Neutrons = Mass number - Atomic number.",
      "⚖️ Stoichiometry: 1 mole of any gas at STP occupies 22.4 liters. Balance equations before calculations.",
      "🌡️ Thermodynamics: Exothermic reactions release heat (ΔH < 0). Endothermic absorb heat (ΔH > 0).",
      "💡 Study Tip: Draw Lewis dot structures to visualize electron sharing in covalent compounds."
    ],
    "General Review": [
      "⏱️ Pomodoro Technique: Focus intensely for 25 minutes, then take a 5-minute restorative break.",
      "🧠 Active Recall: Test yourself with flashcards rather than passively re-reading the textbook.",
      "📊 Spaced Repetition: Review concepts at expanding intervals (1 day, 3 days, 7 days, 14 days)."
    ]
  };

  const getSubjectNotes = (subjectName: string) => {
    if (subjectName.includes("Math")) return mockNotes["Mathematics"];
    if (subjectName.includes("Science") || subjectName.includes("Physic")) return mockNotes["Physics"];
    if (subjectName.includes("Chemis")) return mockNotes["Chemistry"];
    return mockNotes["General Review"];
  };

  // Sticky Menu Drawer State
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  // Fetch logged in user and Supabase database details
  const fetchDashboardData = async () => {
    let currentUser: any = null;
    let fetchedProfile: any = null;
    let fetchedSubjects: SubjectItem[] = [];

    try {
      // 1. Get Supabase auth user
      const { data: authData } = await supabase.auth.getUser();
      currentUser = authData?.user;

      if (currentUser) {
        // 2. Fetch profile from Supabase 'users' table
        const { data: userProfile, error: profileErr } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (!profileErr && userProfile) {
          fetchedProfile = userProfile;
        }

        // 3. Fetch subjects from Supabase 'subjects' table
        const { data: subjectRows, error: subjectErr } = await supabase
          .from("subjects")
          .select("*")
          .eq("user_id", currentUser.id);

        if (!subjectErr && subjectRows && subjectRows.length > 0) {
          fetchedSubjects = subjectRows.map((s: any, idx: number) => ({
            id: s.id || `subj-${idx}`,
            name: s.name || "Target Subject",
            progress: s.progress || Math.floor(Math.random() * 35) + 50,
            totalModules: 12,
            completedModules: Math.floor(Math.random() * 5) + 6,
            nextTopic: s.next_topic || "Key Concept Drill",
            topicCount: s.topic_count || 12,
            lastStudied: s.last_studied || "2 hours ago",
            borderColor: subjectColors[idx % subjectColors.length],
          }));
        }
      }
    } catch (err) {
      console.warn("Supabase fetch failed in dashboard, trying local user fallback...", err);
    }

    // Fallback check for mock cookie or localStorage user data if Supabase auth is not present
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

    // Redirect to sign-in if no user exists at all
    if (!currentUser) {
      router.push("/sign-in");
      return;
    }

    setUser(currentUser);

    // Merge profile fields from Supabase table or Auth Metadata
    const mergedName =
      fetchedProfile?.name ||
      currentUser.user_metadata?.full_name ||
      currentUser.full_name ||
      currentUser.email?.split("@")[0] ||
      "Student";

    const mergedGrade =
      fetchedProfile?.grade_class ||
      currentUser.grade_class ||
      currentUser.user_metadata?.grade_class ||
      "Senior Year / Test Prep";

    const mergedExamTarget =
      fetchedProfile?.exam_target ||
      currentUser.exam_target ||
      currentUser.user_metadata?.exam_target ||
      "SAT & University Finals";

    const mergedExamDate =
      fetchedProfile?.exam_date ||
      currentUser.exam_date ||
      currentUser.user_metadata?.exam_date ||
      new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const mergedAvatar =
      fetchedProfile?.avatar_url ||
      currentUser.avatar_url ||
      currentUser.user_metadata?.avatar_url ||
      "";

    setProfileData({
      fullName: mergedName,
      email: currentUser.email || "",
      gradeClass: mergedGrade,
      examTarget: mergedExamTarget,
      examDate: mergedExamDate,
      avatarUrl: mergedAvatar,
      onboardingCompleted: fetchedProfile?.onboarding_completed ?? true,
    });

    // Generate default subjects if Supabase subjects table had no rows
    if (fetchedSubjects.length === 0) {
      const examName = mergedExamTarget;
      fetchedSubjects = [
        {
          id: "subj-1",
          name: `${examName} - Core Modules`,
          progress: 72,
          totalModules: 14,
          completedModules: 10,
          nextTopic: "Advanced Problem Solving & Time Management",
          topicCount: 14,
          lastStudied: "2 hours ago",
          borderColor: "#01472e",
        },
        {
          id: "subj-2",
          name: "Mathematics & Analytical Reasoning",
          progress: 85,
          totalModules: 10,
          completedModules: 8,
          nextTopic: "Functions & Polynomial Equations",
          topicCount: 10,
          lastStudied: "Yesterday",
          borderColor: "#2d6a4f",
        },
        {
          id: "subj-3",
          name: "Science & Critical Comprehension",
          progress: 58,
          totalModules: 12,
          completedModules: 7,
          nextTopic: "Data Interpretation & Experimental Synthesis",
          topicCount: 12,
          lastStudied: "3 days ago",
          borderColor: "#52b788",
        },
      ];
    }

    setDbSubjects(fetchedSubjects);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  const handleSignOut = async () => {
    deleteCookie("studycoach_mock_user");
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase signOut error:", err);
    }
    router.push("/sign-in");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiThinking) return;

    const userMsg = aiInput.trim();
    setAiInput("");
    setAiChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsAiThinking(true);

    setTimeout(() => {
      let botResponse = `Here is your customized study guidance for "${userMsg}":\n\n1. Key Concept Overview: Break down the main rules and formulas.\n2. Practice Tip: Work through 3 step-by-step example problems.\n3. Goal: Test your recall with a 5-question quick quiz.`;

      if (userMsg.toLowerCase().includes("quiz")) {
        botResponse = `🎯 **Quick Practice Quiz Generated!**\n\nQ1: What is the primary strategy for solving systems of linear equations under time constraints?\nA) Substitution\nB) Elimination (Recommended for speed)\nC) Graphing\n\nNeed detailed step-by-step solutions? Ask away!`;
      } else if (userMsg.toLowerCase().includes("sprint") || userMsg.toLowerCase().includes("schedule") || userMsg.toLowerCase().includes("chapter")) {
        botResponse = `⏱️ **Recommended 30-Min Focus Sprint:**\n• 0-25 mins: High-intensity active recall on ${profileData?.examTarget || "your exam topics"}.\n• 25-30 mins: Quick mental check & review weak notes.`;
      }

      setAiChat((prev) => [...prev, { role: "assistant", text: botResponse }]);
      setIsAiThinking(false);
    }, 800);
  };

  const handleQuickPrompt = (promptText: string) => {
    setAiInput(promptText);
  };

  // Calculate days remaining until target exam
  const daysUntilExam = React.useMemo(() => {
    if (!profileData?.examDate) return 35;
    const target = new Date(profileData.examDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [profileData?.examDate]);

  // Completed tasks calculation for progress bar
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#fefae0] font-sans">
        <div className="w-10 h-10 rounded-full border-2 border-[#01472e]/20 border-t-[#01472e] animate-spin mb-4" />
        <div className="font-sans font-semibold text-[11px] text-[#01472e]/70 uppercase tracking-[0.1em] animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  if (!user || !profileData) return null;

  return (
    <div className="relative min-h-screen bg-[#fefae0] text-[#01472e] select-none overflow-x-hidden font-sans pb-16">

      {/* Subtle 4% opacity SVG fractal noise texture overlay */}
      <div className="pointer-events-none fixed inset-0 z-[999] opacity-[0.04] select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Sticky Top Navbar with thin bottom border (#e4e7f0) */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#fefae0]/90 border-b border-[#e4e7f0] px-4 md:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#01472e] flex items-center justify-center text-[#fefae0] shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-xl tracking-tight text-[#01472e] uppercase font-bold block leading-none">
                StudyCoach
              </span>
              <span className="font-sans text-[11px] font-semibold text-[#01472e]/70 uppercase tracking-[0.1em] block mt-0.5">
                Dashboard
              </span>
            </div>
          </div>

          {/* User Profile Summary Pill & Actions */}
          <div className="flex items-center gap-3">

            {/* Refresh Button */}
            <motion.button
              onClick={handleRefresh}
              whileTap={{ scale: 0.95 }}
              title="Refresh Dashboard Data"
              className="p-2 rounded-xl border border-[#01472e]/15 bg-white/80 hover:bg-white text-[#01472e] transition-all duration-200 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </motion.button>

            {/* Profile Drawer Trigger Pill */}
            <motion.button
              onClick={() => setShowSettingsModal(true)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 bg-white border border-[#01472e]/15 hover:border-[#01472e]/30 px-3.5 py-1.5 rounded-full shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              {profileData.avatarUrl ? (
                <img
                  src={profileData.avatarUrl}
                  alt={profileData.fullName}
                  className="w-6 h-6 rounded-full object-cover border border-[#01472e]/20"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#ccd5ae] flex items-center justify-center text-[#01472e] font-bold text-[10px]">
                  {profileData.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-bold text-[#01472e] hidden sm:inline-block max-w-[120px] truncate">
                {profileData.fullName}
              </span>
              <span className="text-[11px] font-semibold bg-[#ccd5ae]/50 text-[#01472e] px-2 py-0.5 rounded-full">
                {profileData.gradeClass.split(" ")[0] || "Student"}
              </span>
            </motion.button>

            {/* Sign Out Button */}
            <motion.button
              onClick={handleSignOut}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="hidden md:flex items-center gap-1.5 bg-[#01472e] hover:bg-[#013522] text-[#fefae0] text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </motion.button>
          </div>

        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-8 relative z-10">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 md:space-y-8"
        >

          {/* 1. HERO BANNER */}
          <motion.div variants={itemVariants} className="w-full">
            <div className="relative overflow-hidden bg-white/20 backdrop-blur-xs border border-[#01472e]/15 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-200">

              {/* Animated 3D Shader Gradient Background */}
              <ShaderBackground />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                {/* Welcome Message split into 2 lines with TextRoll animation */}
                <div className="space-y-1 max-w-xl">
                  <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#01472e] tracking-tight leading-none flex flex-col items-start">
                    <TextRoll className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#01472e]">
                      Welcome back,
                    </TextRoll>
                    <TextRoll className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#01472e] mt-1">
                      {`${profileData.fullName.split(" ")[0]}!`}
                    </TextRoll>
                  </h1>
                </div>

                {/* 3 Refined Stat Cards with white background and subtle green left border accent */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">

                  {/* Stat Card 1: Exam Days */}
                  <div className="bg-white border border-[#01472e]/10 border-l-4 border-l-[#01472e] rounded-2xl p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 text-[#01472e]/70 text-[11px] font-semibold uppercase tracking-[0.1em] mb-1">
                      <Calendar className="w-3.5 h-3.5 text-[#01472e]" />
                      <span>Exam Days</span>
                    </div>
                    <div className="font-sans text-2xl md:text-3xl font-bold text-[#01472e]">
                      {daysUntilExam} <span className="text-xs font-normal text-[#4a5568]">days left</span>
                    </div>
                  </div>

                  {/* Stat Card 2: Study Streak */}
                  <div className="bg-white border border-[#01472e]/10 border-l-4 border-l-[#01472e] rounded-2xl p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 text-[#01472e]/70 text-[11px] font-semibold uppercase tracking-[0.1em] mb-1">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      <span>Study Streak</span>
                    </div>
                    <div className="font-sans text-2xl md:text-3xl font-bold text-[#01472e]">
                      7 <span className="text-xs font-normal text-[#4a5568]">days 🔥</span>
                    </div>
                  </div>

                  {/* Stat Card 3: Daily Goal */}
                  <div className="col-span-2 sm:col-span-1 bg-white border border-[#01472e]/10 border-l-4 border-l-[#01472e] rounded-2xl p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-center">
                    <div className="flex items-center justify-between text-[#01472e]/70 text-[11px] font-semibold uppercase tracking-[0.1em] mb-1">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#01472e]" />
                        <span>Daily Goal</span>
                      </span>
                      <span className="font-bold text-[#01472e]">75%</span>
                    </div>
                    <div className="w-full bg-[#ccd5ae]/40 h-2 rounded-full overflow-hidden mt-1.5">
                      <div className="bg-[#01472e] h-full rounded-full w-[75%] transition-all duration-300" />
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </motion.div>

          {/* MAIN DASHBOARD TWO-COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

            {/* LEFT COLUMN: Active Study Modules & Today's Study Plan (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8">

              {/* 3. ACTIVE STUDY MODULES */}
              <motion.div id="active-modules" variants={itemVariants} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-sans text-xl font-bold text-[#01472e]">
                      Active Study Modules
                    </h2>
                    <span className="font-sans text-[11px] font-semibold text-[#01472e]/70 uppercase tracking-[0.1em]">
                      Target Program Progression
                    </span>
                  </div>
                  <span className="text-xs font-semibold bg-[#ccd5ae]/40 text-[#01472e] px-3 py-1 rounded-full border border-[#01472e]/10">
                    {dbSubjects.length} Modules Active
                  </span>
                </div>

                {dbSubjects.length === 0 ? (
                  /* Empty state card when no subjects exist */
                  <div className="bg-white border-2 border-dashed border-[#01472e]/20 rounded-2xl p-8 text-center hover:border-[#01472e]/40 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#ccd5ae]/40 flex items-center justify-center text-[#01472e]">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-sans text-base font-bold text-[#01472e] mb-1">
                        Upload Study Material
                      </h3>
                      <p className="font-sans text-sm font-normal text-[#4a5568] max-w-sm mx-auto">
                        Drag & drop your syllabus, class notes, or exam study guide to generate personalized AI study modules.
                      </p>
                    </div>
                    <button className="bg-[#01472e] text-[#fefae0] font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition-all duration-200">
                      Select Files to Upload
                    </button>
                  </div>
                ) : (
                  /* Subject Cards Grid */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dbSubjects.map((subject, idx) => (
                      <motion.div
                        key={subject.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white border border-[#01472e]/10 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                        style={{ borderLeftWidth: "4px", borderLeftColor: subject.borderColor }}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#01472e]/70 bg-[#fefae0] px-2.5 py-0.5 rounded-md border border-[#01472e]/10">
                              {subject.topicCount || 12} Topics
                            </span>
                            <span className="font-sans text-xs text-[#4a5568]">
                              {subject.lastStudied || "2h ago"}
                            </span>
                          </div>

                          <h3 className="font-sans text-base font-bold text-[#01472e] mb-1.5 leading-snug">
                            {subject.name}
                          </h3>

                          <p className="font-sans text-sm font-normal text-[#4a5568] mb-4 line-clamp-2">
                            Next: <span className="font-medium text-[#01472e]">{subject.nextTopic}</span>
                          </p>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-[#01472e]/8">
                          <div className="flex items-center justify-between font-sans text-xs">
                            <span className="font-semibold text-[#01472e]/70 uppercase text-[11px] tracking-[0.1em]">
                              Mastery
                            </span>
                            <span className="font-bold text-[#01472e]">{subject.progress}%</span>
                          </div>

                          <div className="w-full bg-[#ccd5ae]/30 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#01472e] h-full rounded-full transition-all duration-300"
                              style={{ width: `${subject.progress}%` }}
                            />
                          </div>

                          {/* Ghost style Continue Module button with arrow icon */}
                          <button
                            onClick={() => handleQuickPrompt(`Help me study ${subject.name}: ${subject.nextTopic}`)}
                            className="w-full mt-1 bg-transparent hover:bg-[#01472e]/5 text-[#01472e] font-semibold text-sm py-2 px-3 rounded-xl border border-transparent hover:border-[#01472e]/15 flex items-center justify-between transition-all duration-200 cursor-pointer group"
                          >
                            <span>Continue Module</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* 4. TODAY'S STUDY PLAN */}
              <motion.div id="study-plan" variants={itemVariants} className="bg-white border border-[#01472e]/12 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="space-y-4 mb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-sans text-xl font-bold text-[#01472e]">
                        Today's Study Plan
                      </h2>
                      <span className="font-sans text-[11px] font-semibold text-[#01472e]/70 uppercase tracking-[0.1em]">
                        Daily Progress Checklist
                      </span>
                    </div>
                    <span className="font-sans text-xs font-semibold text-[#01472e] bg-[#fefae0] px-3 py-1 rounded-full border border-[#01472e]/10">
                      {completedTasksCount} of {tasks.length} Completed
                    </span>
                  </div>

                  {/* Subtle top progress bar showing X/Y done */}
                  <div className="w-full bg-[#ccd5ae]/30 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#01472e] h-full rounded-full transition-all duration-300"
                      style={{ width: `${(completedTasksCount / tasks.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Color-coded task items with estimated duration */}
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        task.completed
                          ? "bg-[#ccd5ae]/15 border-[#01472e]/10 border-l-2 border-l-[#01472e] opacity-50"
                          : "bg-white hover:bg-[#fefae0]/50 border-[#01472e]/10 border-l-2 border-l-[#01472e] hover:border-l-4"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Color dot per subject */}
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: task.subjectColor }}
                        />

                        {/* Checkbox indicator */}
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 ${
                            task.completed
                              ? "bg-[#01472e] text-[#fefae0]"
                              : "border border-[#01472e]/30 bg-white"
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5" />}
                        </div>

                        <div>
                          <span
                            className={`font-sans text-sm font-bold block text-[#01472e] ${
                              task.completed ? "line-through opacity-50" : ""
                            }`}
                          >
                            {task.title}
                          </span>
                          <span className="font-sans text-xs text-[#4a5568]">
                            {task.subject}
                          </span>
                        </div>
                      </div>

                      {/* Estimated duration badge */}
                      <span className="font-sans text-xs font-semibold text-[#01472e] bg-[#fefae0] px-2.5 py-1 rounded-lg border border-[#01472e]/10">
                        {task.duration}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* RIGHT COLUMN: AI Coach Widget & Profile (5 Cols) */}
            <div className="lg:col-span-5 space-y-6 md:space-y-8">

              {/* 5. AI COACH WIDGET */}
              <motion.div id="ai-coach" variants={itemVariants} className="w-full">
                <div className="bg-[#01472e] text-[#fefae0] border border-[#01472e] rounded-3xl p-6 shadow-xl relative overflow-hidden">

                  {/* Header with Online Pulsing Dot */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#fefae0]/15 flex items-center justify-center text-[#fefae0]">
                        <Sparkles className="w-4 h-4 text-[#ccd5ae]" />
                      </div>
                      <div>
                        <h3 className="font-sans text-lg font-bold text-[#fefae0]">
                          AI Study Coach
                        </h3>
                        <span className="font-sans text-[11px] font-semibold text-[#ccd5ae] uppercase tracking-[0.1em] block">
                          Instant Assistance
                        </span>
                      </div>
                    </div>

                    {/* Pulsing Green Dot showing "Online" */}
                    <div className="flex items-center gap-1.5 font-sans text-xs text-[#ccd5ae] bg-[#013522] px-2.5 py-1 rounded-full border border-[#ccd5ae]/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Online</span>
                    </div>
                  </div>

                  {/* 3 Suggested Quick Action Chips */}
                  <div className="space-y-2 mb-4 relative z-10">
                    <span className="font-sans text-[11px] font-semibold text-[#ccd5ae]/80 uppercase tracking-[0.1em] block">
                      Quick Suggestions:
                    </span>

                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleQuickPrompt(`Generate a 5-question practice quiz for ${profileData.examTarget}`)}
                        className="text-xs font-sans font-semibold bg-[#fefae0]/10 hover:bg-[#fefae0]/20 text-[#fefae0] px-3 py-1.5 rounded-xl border border-[#fefae0]/15 transition-all duration-200 cursor-pointer"
                      >
                        🎯 5-Q Practice Quiz
                      </button>
                      <button
                        onClick={() => handleQuickPrompt(`Summarize key concepts for ${profileData.examTarget}`)}
                        className="text-xs font-sans font-semibold bg-[#fefae0]/10 hover:bg-[#fefae0]/20 text-[#fefae0] px-3 py-1.5 rounded-xl border border-[#fefae0]/15 transition-all duration-200 cursor-pointer"
                      >
                        💡 Summarize Chapter
                      </button>
                      <button
                        onClick={() => handleQuickPrompt("Create a 30-minute study sprint plan for today")}
                        className="text-xs font-sans font-semibold bg-[#fefae0]/10 hover:bg-[#fefae0]/20 text-[#fefae0] px-3 py-1.5 rounded-xl border border-[#fefae0]/15 transition-all duration-200 cursor-pointer"
                      >
                        ⏱️ 30-Min Sprint
                      </button>
                    </div>
                  </div>

                  {/* AI Chat History Container */}
                  <div className="bg-[#013522] rounded-2xl p-4 mb-4 max-h-56 overflow-y-auto space-y-3 text-xs leading-relaxed font-sans border border-[#ccd5ae]/10 scrollbar-none relative z-10">
                    {aiChat.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                      >
                        <span className="font-sans text-[10px] font-semibold text-[#ccd5ae]/70 uppercase tracking-[0.1em] mb-0.5">
                          {msg.role === "user" ? "You" : "AI Coach"}
                        </span>
                        <div
                          className={`p-3 rounded-xl max-w-[90%] whitespace-pre-line ${
                            msg.role === "user"
                              ? "bg-[#ccd5ae] text-[#01472e] font-semibold"
                              : "bg-[#01472e] text-[#fefae0] border border-[#fefae0]/15 font-normal"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {isAiThinking && (
                      <div className="flex items-center gap-2 text-[#ccd5ae] font-sans text-xs animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>AI Coach is crafting your response...</span>
                      </div>
                    )}
                  </div>

                  {/* AI Chat Input Form with Dynamic Placeholder */}
                  <form onSubmit={handleAiSubmit} className="flex gap-2 relative z-10">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder={`Ask AI Coach about ${profileData.examTarget || "your topics"}...`}
                      className="flex-1 bg-[#013522] border border-[#ccd5ae]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#fefae0] placeholder-[#ccd5ae]/50 focus:outline-none focus:border-[#ccd5ae] transition-all duration-200"
                    />
                    <motion.button
                      type="submit"
                      whileTap={{ scale: 0.95 }}
                      disabled={!aiInput.trim() || isAiThinking}
                      className="bg-[#ccd5ae] hover:bg-[#b8c499] text-[#01472e] font-bold p-2.5 rounded-xl cursor-pointer disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </form>

                </div>
              </motion.div>

              {/* STUDENT PROFILE CARD */}
              <motion.div variants={itemVariants} className="bg-white border border-[#01472e]/12 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-sans text-lg font-bold text-[#01472e]">
                    Student Profile
                  </h3>
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="font-sans text-xs font-semibold text-[#01472e] hover:underline cursor-pointer"
                  >
                    View Details
                  </button>
                </div>

                <div className="space-y-3 bg-[#fefae0]/50 border border-[#01472e]/10 rounded-2xl p-4 text-xs font-sans">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#01472e]/10 flex items-center justify-center text-[#01472e]">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-sans text-[11px] font-semibold text-[#01472e]/70 uppercase tracking-[0.1em] block">
                        Full Name
                      </span>
                      <span className="font-bold text-sm text-[#01472e] truncate block">
                        {profileData.fullName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t border-[#01472e]/8 pt-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#01472e]/10 flex items-center justify-center text-[#01472e]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-sans text-[11px] font-semibold text-[#01472e]/70 uppercase tracking-[0.1em] block">
                        Email Address
                      </span>
                      <span className="font-normal text-[#4a5568] truncate block">
                        {profileData.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t border-[#01472e]/8 pt-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#01472e]/10 flex items-center justify-center text-[#01472e]">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-sans text-[11px] font-semibold text-[#01472e]/70 uppercase tracking-[0.1em] block">
                        Academic Grade & Exam
                      </span>
                      <span className="font-normal text-[#4a5568] truncate block">
                        {profileData.examTarget} ({profileData.gradeClass})
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleSignOut}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-[#01472e] text-[#fefae0] font-semibold text-xs py-3 rounded-xl cursor-pointer shadow-xs hover:shadow-md transition-all duration-200 flex justify-center items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of Account
                </motion.button>
              </motion.div>

            </div>

          </div>

        </motion.div>

      </main>

      {/* UPLOAD MATERIAL MODAL */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-center items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="w-full max-w-md bg-white border border-[#01472e]/20 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 text-[#01472e]"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                  setUploadProgress(0);
                  setIsUploading(false);
                }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#fefae0] flex items-center justify-center border border-[#01472e]/10 text-[#01472e] hover:bg-[#ccd5ae]/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-[#01472e] text-[#fefae0] flex items-center justify-center">
                  <UploadCloud className="w-5 h-5 text-[#ccd5ae]" />
                </div>
                <div>
                  <h3 className="font-sans text-xl font-bold text-[#01472e]">
                    Upload Study Material
                  </h3>
                  <span className="font-sans text-[11px] font-semibold text-[#01472e]/70 uppercase tracking-[0.1em] block">
                    Generate New Study Modules
                  </span>
                </div>
              </div>

              {!isUploading && !uploadFile ? (
                <div
                  onClick={() => {
                    const input = document.getElementById("file-upload-input");
                    input?.click();
                  }}
                  className="border-2 border-dashed border-[#01472e]/25 hover:border-[#01472e]/55 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-[#fefae0]/20 hover:bg-[#fefae0]/40 flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-[#ccd5ae]/30 flex items-center justify-center text-[#01472e]">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-bold text-[#01472e]">
                      Click to choose or drag & drop files
                    </p>
                    <p className="font-sans text-xs text-[#4a5568] mt-1">
                      PDF, DOCX, TXT or Syllabus files up to 25MB
                    </p>
                  </div>
                  <input
                    id="file-upload-input"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0];
                        setUploadFile({ name: file.name, size: file.size });
                      }
                    }}
                  />
                </div>
              ) : isUploading ? (
                <div className="space-y-4 py-4 text-center">
                  <div className="text-sm font-bold text-[#01472e]">Parsing syllabus and extracting topics...</div>
                  <div className="w-full bg-[#ccd5ae]/30 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="bg-[#01472e] h-full"
                    />
                  </div>
                  <div className="text-xs text-[#01472e]/70 font-semibold uppercase tracking-wider">{uploadProgress}% complete</div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 bg-[#ccd5ae]/20 p-4 rounded-xl border border-[#01472e]/10">
                    <FileText className="w-8 h-8 text-[#01472e] flex-shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-[#01472e] truncate">{uploadFile?.name}</p>
                      <p className="text-[10px] text-[#4a5568]">{((uploadFile?.size || 0) / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setUploadFile(null)}
                      className="flex-1 bg-transparent hover:bg-[#01472e]/5 border border-[#01472e]/20 text-[#01472e] font-semibold text-xs py-3 rounded-xl cursor-pointer transition-colors"
                    >
                      Clear File
                    </button>
                    <button
                      onClick={handleUploadSubmit}
                      className="flex-1 bg-[#01472e] text-[#fefae0] font-semibold text-xs py-3 rounded-xl cursor-pointer hover:shadow-md transition-all duration-200"
                    >
                      Generate Module
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRACTICE QUIZ MODAL */}
      <AnimatePresence>
        {showQuizModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-center items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="w-full max-w-md bg-white border border-[#01472e]/20 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 text-[#01472e]"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowQuizModal(false);
                  setQuizStep("select");
                  setCurrentQuestionIdx(0);
                  setSelectedAnswerIdx(null);
                  setQuizScore(0);
                }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#fefae0] flex items-center justify-center border border-[#01472e]/10 text-[#01472e] hover:bg-[#ccd5ae]/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-[#01472e] text-[#fefae0] flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#ccd5ae]" />
                </div>
                <div>
                  <h3 className="font-sans text-xl font-bold text-[#01472e]">
                    Practice Quiz Drill
                  </h3>
                  <span className="font-sans text-[11px] font-semibold text-[#01472e]/70 uppercase tracking-[0.1em] block">
                    Active Recall Training
                  </span>
                </div>
              </div>

              {quizStep === "select" ? (
                <div className="space-y-4">
                  <p className="text-xs text-[#4a5568]">
                    Choose an active module to generate a 3-question revision quiz.
                  </p>
                  <div className="space-y-2">
                    {dbSubjects.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setQuizSubject(s.name);
                          setQuizStep("question");
                        }}
                        className="w-full bg-[#fefae0]/40 hover:bg-[#ccd5ae]/35 border border-[#01472e]/10 p-3.5 rounded-xl text-left font-sans text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-between group"
                      >
                        <span>{s.name}</span>
                        <ArrowRight className="w-4 h-4 text-[#01472e]/40 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : quizStep === "question" ? (
                (() => {
                  const questions = getQuizQuestions(quizSubject);
                  const currentQuestion = questions[currentQuestionIdx];
                  const isLastQuestion = currentQuestionIdx === questions.length - 1;

                  return (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold text-[#01472e]/70 border-b border-[#01472e]/10 pb-2">
                        <span>Subject: {quizSubject}</span>
                        <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
                      </div>

                      <h4 className="text-sm font-bold text-[#01472e] leading-snug">
                        {currentQuestion.question}
                      </h4>

                      <div className="space-y-2">
                        {currentQuestion.options.map((option, idx) => {
                          let optionClass = "border-[#01472e]/10 bg-white hover:bg-[#fefae0]/40";
                          if (selectedAnswerIdx !== null) {
                            if (idx === currentQuestion.answer) {
                              optionClass = "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold";
                            } else if (idx === selectedAnswerIdx) {
                              optionClass = "border-red-500 bg-red-50 text-red-950";
                            } else {
                              optionClass = "border-[#01472e]/5 opacity-60 bg-white";
                            }
                          }

                          return (
                            <button
                              key={idx}
                              disabled={selectedAnswerIdx !== null}
                              onClick={() => {
                                setSelectedAnswerIdx(idx);
                                if (idx === currentQuestion.answer) {
                                  setQuizScore((prev) => prev + 1);
                                }
                              }}
                              className={`w-full p-3 text-left rounded-xl border text-xs transition-all duration-150 ${optionClass} ${selectedAnswerIdx === null ? "cursor-pointer" : "cursor-default"}`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      {selectedAnswerIdx !== null && (
                        <button
                          onClick={() => {
                            if (isLastQuestion) {
                              setQuizStep("score");
                            } else {
                              setCurrentQuestionIdx((prev) => prev + 1);
                              setSelectedAnswerIdx(null);
                            }
                          }}
                          className="w-full bg-[#01472e] text-[#fefae0] font-semibold text-xs py-3 rounded-xl cursor-pointer shadow-xs hover:shadow-md transition-all duration-200 text-center"
                        >
                          {isLastQuestion ? "View Scorecard" : "Next Question"}
                        </button>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="space-y-6 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 py-4">
                    <div className="relative w-20 h-20 rounded-full flex items-center justify-center border-4 border-[#ccd5ae]/30">
                      <div className="absolute inset-0 rounded-full border-4 border-[#01472e] border-t-transparent animate-pulse" />
                      <span className="text-2xl font-black text-[#01472e]">
                        {quizScore}/3
                      </span>
                    </div>
                    <div className="pt-2">
                      <h4 className="font-sans text-base font-bold text-[#01472e]">
                        {quizScore === 3 ? "🥇 Perfect Score!" : quizScore === 2 ? "🥈 Great Job!" : "📚 Keep Learning!"}
                      </h4>
                      <p className="text-xs text-[#4a5568] max-w-[240px] mx-auto mt-1">
                        {quizScore === 3
                          ? "You have fully mastered these concepts. Excellent recall speed."
                          : "Reviewing formulas and key concepts will help reinforce remaining gaps."}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setQuizStep("select");
                        setCurrentQuestionIdx(0);
                        setSelectedAnswerIdx(null);
                        setQuizScore(0);
                      }}
                      className="flex-1 bg-transparent hover:bg-[#01472e]/5 border border-[#01472e]/20 text-[#01472e] font-semibold text-xs py-3 rounded-xl cursor-pointer transition-colors"
                    >
                      Try Another Subject
                    </button>
                    <button
                      onClick={() => {
                        setShowQuizModal(false);
                        setQuizStep("select");
                        setCurrentQuestionIdx(0);
                        setSelectedAnswerIdx(null);
                        setQuizScore(0);
                      }}
                      className="flex-1 bg-[#01472e] text-[#fefae0] font-semibold text-xs py-3 rounded-xl cursor-pointer hover:shadow-md transition-all duration-200"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTES MODAL */}
      <AnimatePresence>
        {showNotesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-center items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="w-full max-w-lg bg-white border border-[#01472e]/20 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 text-[#01472e]"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowNotesModal(false);
                  setCopiedNotes(false);
                }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#fefae0] flex items-center justify-center border border-[#01472e]/10 text-[#01472e] hover:bg-[#ccd5ae]/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-[#01472e] text-[#fefae0] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#ccd5ae]" />
                </div>
                <div>
                  <h3 className="font-sans text-xl font-bold text-[#01472e]">
                    Synthesized Study Notes
                  </h3>
                  <span className="font-sans text-[11px] font-semibold text-[#01472e]/70 uppercase tracking-[0.1em] block">
                    AI-Extracted Core Concepts
                  </span>
                </div>
              </div>

              {/* Horizontal Scrollable Tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none border-b border-[#01472e]/10">
                {dbSubjects.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setNotesSubject(s.name);
                      setCopiedNotes(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150 cursor-pointer flex-shrink-0 ${
                      notesSubject === s.name
                        ? "bg-[#01472e] text-[#fefae0] border-[#01472e]"
                        : "bg-[#fefae0]/40 text-[#01472e] border-[#01472e]/10 hover:bg-[#ccd5ae]/30"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              {/* Notes Content */}
              <div className="bg-[#fefae0]/60 border border-[#01472e]/10 rounded-2xl p-5 mb-5 max-h-72 overflow-y-auto space-y-4 font-sans text-xs scrollbar-none">
                <h4 className="text-sm font-bold text-[#01472e] uppercase tracking-wider text-[11px] border-b border-[#01472e]/10 pb-1.5">
                  {notesSubject} Revision Sheet
                </h4>
                {getSubjectNotes(notesSubject).map((bullet, idx) => (
                  <div key={idx} className="flex gap-2.5 leading-relaxed text-[#4a5568]">
                    <span className="text-[#01472e] font-bold">•</span>
                    <p>{bullet}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const textToCopy = getSubjectNotes(notesSubject).join("\n");
                    navigator.clipboard.writeText(textToCopy);
                    setCopiedNotes(true);
                    setTimeout(() => setCopiedNotes(false), 2000);
                  }}
                  className="flex-1 bg-transparent hover:bg-[#01472e]/5 border border-[#01472e]/20 text-[#01472e] font-semibold text-xs py-3 rounded-xl cursor-pointer transition-colors flex justify-center items-center gap-1.5"
                >
                  {copiedNotes ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <span>Copy to Clipboard</span>
                  )}
                </button>
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="flex-1 bg-[#01472e] text-[#fefae0] font-semibold text-xs py-3 rounded-xl cursor-pointer hover:shadow-md transition-all duration-200"
                >
                  Close Notes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROGRESS MODAL */}
      <AnimatePresence>
        {showProgressModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-center items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="w-full max-w-lg bg-white border border-[#01472e]/20 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 text-[#01472e]"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowProgressModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#fefae0] flex items-center justify-center border border-[#01472e]/10 text-[#01472e] hover:bg-[#ccd5ae]/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-[#01472e] text-[#fefae0] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-sans text-xl font-bold text-[#01472e]">
                    Progress & Analytics
                  </h3>
                  <span className="font-sans text-[11px] font-semibold text-[#01472e]/70 uppercase tracking-[0.1em] block">
                    Detailed Learning Statistics
                  </span>
                </div>
              </div>

              {/* Stats Cards Row */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#fefae0]/40 border border-[#01472e]/10 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] font-semibold text-[#01472e]/70 uppercase tracking-wider block mt-0.5">
                    Study Time (Wk)
                  </span>
                  <span className="text-xl font-black text-[#01472e] block mt-1">
                    18.5 hours
                  </span>
                </div>
                <div className="bg-[#fefae0]/40 border border-[#01472e]/10 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] font-semibold text-[#01472e]/70 uppercase tracking-wider block mt-0.5">
                    Active Streak
                  </span>
                  <span className="text-xl font-black text-[#01472e] block mt-1">
                    7 Days 🔥
                  </span>
                </div>
              </div>

              {/* Weekly Chart Container */}
              <div className="bg-[#fefae0]/40 border border-[#01472e]/10 rounded-2xl p-4 mb-5">
                <span className="text-[10px] font-bold text-[#01472e]/70 uppercase tracking-wider block mb-3">
                  Weekly Study Hours (Mon - Sun)
                </span>
                {/* SVG bar chart */}
                <div className="h-28 w-full flex items-end justify-between px-2 pt-2">
                  {[
                    { day: "M", hrs: 2.0, hPercent: "40%" },
                    { day: "T", hrs: 3.0, hPercent: "60%" },
                    { day: "W", hrs: 1.5, hPercent: "30%" },
                    { day: "T", hrs: 4.0, hPercent: "80%" },
                    { day: "F", hrs: 2.5, hPercent: "50%" },
                    { day: "S", hrs: 3.5, hPercent: "70%" },
                    { day: "S", hrs: 2.0, hPercent: "40%" },
                  ].map((d, index) => (
                    <div key={index} className="flex flex-col items-center gap-1.5 w-8">
                      <div className="text-[9px] font-semibold text-[#01472e]/70">{d.hrs}h</div>
                      <div className="w-3.5 bg-[#01472e]/15 rounded-t-sm h-16 relative flex items-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: d.hPercent }}
                          className="w-full bg-[#01472e] rounded-t-sm"
                          transition={{ delay: 0.1 * index, duration: 0.5 }}
                        />
                      </div>
                      <div className="text-[10px] font-bold text-[#01472e]">{d.day}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject Mastery Progress Bars */}
              <div className="space-y-2.5 mb-5 max-h-36 overflow-y-auto pr-1">
                <span className="text-[10px] font-bold text-[#01472e]/70 uppercase tracking-wider block mb-1">
                  Subject Mastery Ratings
                </span>
                {dbSubjects.map((s) => (
                  <div key={s.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#4a5568]">
                      <span>{s.name}</span>
                      <span className="text-[#01472e] font-bold">{s.progress}%</span>
                    </div>
                    <div className="w-full bg-[#ccd5ae]/20 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#01472e] h-full"
                        style={{ width: `${s.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowProgressModal(false)}
                className="w-full bg-[#01472e] text-[#fefae0] font-semibold text-xs py-3 rounded-xl cursor-pointer shadow-xs hover:shadow-md transition-all duration-200"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SETTINGS & PROFILE MODAL */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-center items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="w-full max-w-md bg-white border border-[#01472e]/20 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 text-[#01472e]"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSettingsModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#fefae0] flex items-center justify-center border border-[#01472e]/10 text-[#01472e] hover:bg-[#ccd5ae]/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-[#01472e] text-[#fefae0] flex items-center justify-center">
                  <User className="w-5 h-5 text-[#ccd5ae]" />
                </div>
                <div>
                  <h3 className="font-sans text-xl font-bold text-[#01472e]">
                    Settings & Profile
                  </h3>
                  <span className="font-sans text-[11px] font-semibold text-[#01472e]/70 uppercase tracking-[0.1em] block">
                    Manage Preferences & Details
                  </span>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-[#01472e]/10 mb-4 text-xs font-bold">
                {[
                  { id: "profile", label: "Profile" },
                  { id: "preferences", label: "Preferences" },
                  { id: "account", label: "Account" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSettingsTab(t.id as any)}
                    className={`flex-grow pb-2 border-b-2 transition-all cursor-pointer ${
                      settingsTab === t.id
                        ? "border-[#01472e] text-[#01472e]"
                        : "border-transparent text-[#01472e]/55 hover:text-[#01472e]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-none font-sans text-xs mb-6 text-left">
                {settingsTab === "profile" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="font-semibold text-[#01472e]/70 uppercase text-[10px] tracking-wider block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        className="w-full bg-[#fefae0]/40 border border-[#01472e]/15 rounded-xl px-3 py-2 text-xs text-[#01472e] focus:outline-none focus:border-[#01472e]"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[#01472e]/70 uppercase text-[10px] tracking-wider block mb-1">
                        Email Address (Read-only)
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        readOnly
                        className="w-full bg-[#01472e]/5 border border-[#01472e]/10 rounded-xl px-3 py-2 text-xs text-[#01472e]/60 outline-none cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[#01472e]/70 uppercase text-[10px] tracking-wider block mb-1">
                        Target Exam
                      </label>
                      <input
                        type="text"
                        value={editExamTarget}
                        onChange={(e) => setEditExamTarget(e.target.value)}
                        className="w-full bg-[#fefae0]/40 border border-[#01472e]/15 rounded-xl px-3 py-2 text-xs text-[#01472e] focus:outline-none focus:border-[#01472e]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-[#01472e]/70 uppercase text-[10px] tracking-wider block mb-1">
                          Grade Class
                        </label>
                        <input
                          type="text"
                          value={editGradeClass}
                          onChange={(e) => setEditGradeClass(e.target.value)}
                          className="w-full bg-[#fefae0]/40 border border-[#01472e]/15 rounded-xl px-3 py-2 text-xs text-[#01472e] focus:outline-none focus:border-[#01472e]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-[#01472e]/70 uppercase text-[10px] tracking-wider block mb-1">
                          Exam Date
                        </label>
                        <input
                          type="date"
                          value={editExamDate}
                          onChange={(e) => setEditExamDate(e.target.value)}
                          className="w-full bg-[#fefae0]/40 border border-[#01472e]/15 rounded-xl px-3 py-2 text-xs text-[#01472e] focus:outline-none focus:border-[#01472e]"
                        />
                      </div>
                    </div>
                  </div>
                ) : settingsTab === "preferences" ? (
                  <div className="space-y-4 pt-1">
                    {/* Goal slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span className="text-[#01472e]/70 uppercase text-[10px] tracking-wider">
                          Daily Study Goal Target
                        </span>
                        <span className="text-[#01472e]">{dailyGoalPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={dailyGoalPercent}
                        onChange={(e) => setDailyGoalPercent(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-[#ccd5ae]/30 rounded-lg appearance-none cursor-pointer accent-[#01472e]"
                      />
                    </div>

                    {/* Dark mode toggle */}
                    <div className="flex items-center justify-between py-2 border-t border-[#01472e]/5">
                      <div>
                        <span className="font-bold text-[#01472e] block">Simulate Dark Mode</span>
                        <span className="text-[10px] text-[#4a5568]">Toggle custom darker workspace visual theme</span>
                      </div>
                      <button
                        onClick={() => {
                          setMockDarkMode(!mockDarkMode);
                          alert("Workspace styling updated. Visual elements refreshed.");
                        }}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          mockDarkMode ? "bg-[#01472e]" : "bg-[#ccd5ae]"
                        }`}
                      >
                        <div
                          className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                            mockDarkMode ? "translate-x-4.5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Notifications toggle */}
                    <div className="flex items-center justify-between py-2 border-t border-[#01472e]/5">
                      <div>
                        <span className="font-bold text-[#01472e] block">Email Notifications</span>
                        <span className="text-[10px] text-[#4a5568]">Receive daily study plan reminders via email</span>
                      </div>
                      <button
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          emailNotifications ? "bg-[#01472e]" : "bg-[#ccd5ae]"
                        }`}
                      >
                        <div
                          className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                            emailNotifications ? "translate-x-4.5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2 text-center py-6">
                    <p className="text-xs text-[#4a5568] max-w-[280px] mx-auto">
                      Signed in as <span className="font-bold text-[#01472e]">{profileData.email}</span>. Click below to sign out and clear active session cookies.
                    </p>
                    <button
                      onClick={handleSignOut}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 px-6 rounded-xl cursor-pointer shadow-xs hover:shadow-md transition-all duration-200 flex justify-center items-center gap-2 mx-auto"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out of Account
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {settingsTab !== "account" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="flex-1 bg-transparent hover:bg-[#01472e]/5 border border-[#01472e]/20 text-[#01472e] font-semibold text-xs py-3 rounded-xl cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="flex-1 bg-[#01472e] text-[#fefae0] font-semibold text-xs py-3 rounded-xl cursor-pointer hover:shadow-md transition-all duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}
