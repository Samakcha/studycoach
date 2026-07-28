"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  ChevronRight,
  Loader2
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  pdf_uploaded: boolean;
  exam_id: string;
  exam_date?: string;
  user_id: string;
  created_at?: string;
}

interface Exam {
  id: string;
  title: string;
}

export default function SubjectsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push("/sign-in");
          return;
        }

        // 2. Fetch subjects
        const { data: subjectsData, error: subjectsError } = await supabase
          .from("subjects")
          .select("*")
          .eq("user_id", user.id)
          .order("name");

        if (subjectsError) {
          throw new Error(`Failed to load subjects: ${subjectsError.message}`);
        }

        // 3. Fetch exams
        const { data: examsData, error: examsError } = await supabase
          .from("exams")
          .select("*");

        if (examsError) {
          throw new Error(`Failed to load exams: ${examsError.message}`);
        }

        setSubjects(subjectsData || []);
        setExams(examsData || []);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [supabase, router]);

  return (
    <main className="min-h-screen bg-[#E6E8C2] text-[#01472e] p-6 md:p-12 pb-24 relative select-none">
      {/* Fractal noise overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-[0.03] select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="pageNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#pageNoise)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-20 space-y-8">
        {/* Back link */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border border-[#01472e]/10 hover:border-[#01472e]/30 bg-white hover:bg-[#ccd5ae]/10 transition-all duration-200 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        {/* Header section */}
        <div className="space-y-2 text-left">
          <h1 className="font-display text-4xl md:text-5xl tracking-tight uppercase text-[#01472e]">
            My Subjects
          </h1>
          <p className="font-sans text-[#01472e]/70 text-sm md:text-base max-w-xl">
            Upload PDFs to unlock AI-powered study features for each subject
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl p-4 max-w-2xl text-left">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#01472e]" />
            <p className="text-xs font-semibold text-[#01472e]/60">Loading your subjects...</p>
          </div>
        ) : subjects.length === 0 ? (
          /* Empty state */
          <div className="bg-white border border-[#ccd5ae]/30 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-6 shadow-xs">
            <div className="text-4xl">📚</div>
            <h3 className="font-display text-2xl uppercase text-[#01472e]">No subjects set up</h3>
            <p className="font-sans text-sm text-[#01472e]/70 max-w-md mx-auto">
              Please complete onboarding or update your settings to target an exam and initialize your subjects.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 text-xs font-bold px-6 py-3 rounded-2xl bg-[#01472e] hover:bg-[#01472e]/90 text-white transition-all shadow-md cursor-pointer"
            >
              Go to Onboarding
            </Link>
          </div>
        ) : (
          /* Grid of subjects */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              const exam = exams.find((e) => e.id === subject.exam_id);
              const examName = exam ? exam.title : "General Exam";

              return (
                <div
                  key={subject.id}
                  className={`bg-white border border-[#e4e7f0] rounded-[20px] p-6 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:shadow-lg hover:border-[#ccd5ae] group ${
                    !subject.pdf_uploaded ? "opacity-80" : ""
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Tag & Subject Title */}
                    <div className="space-y-2 text-left">
                      <span className="inline-block text-[9px] font-bold tracking-wider uppercase bg-[#ccd5ae]/20 text-[#01472e] px-2.5 py-1 rounded-md">
                        {examName}
                      </span>
                      <h3 className="font-sans font-bold text-xl md:text-2xl text-[#01472e] group-hover:text-[#01472e]/95 transition-colors">
                        {subject.name}
                      </h3>
                    </div>

                    {/* Status badge */}
                    <div className="flex text-left">
                      {subject.pdf_uploaded ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight bg-[#e9edc9] border border-[#01472e] text-[#01472e]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#01472e]" />
                          PDF Uploaded ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight bg-[#01472e]/5 border border-[#01472e]/10 text-[#01472e]/60">
                          <FileText className="w-3.5 h-3.5 text-[#01472e]/40" />
                          No PDF yet
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6">
                    {subject.pdf_uploaded ? (
                      <Link
                        href={`/dashboard/notes?subjectId=${subject.id}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-bold border border-[#01472e]/25 text-[#01472e] bg-transparent hover:bg-[#ccd5ae]/15 hover:border-[#01472e] transition-all duration-200 cursor-pointer text-center"
                      >
                        <span>View Topics</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/upload?subjectId=${subject.id}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-bold bg-[#01472e] hover:bg-[#01472e]/90 text-white transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md text-center"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload PDF</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
