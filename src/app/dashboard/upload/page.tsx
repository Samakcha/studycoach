"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { 
  ArrowLeft, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Check, 
  ChevronRight,
  BookOpen
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  pdf_uploaded: boolean;
  exam_id: string;
  user_id: string;
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#fefae0] text-[#01472e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#01472e]" />
      </main>
    }>
      <UploadPageContent />
    </Suspense>
  );
}

function UploadPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Selection & Upload States
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extractedCount, setExtractedCount] = useState<number | null>(null);
  
  // Feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
        setCurrentUser(user);

        // 2. Fetch subjects where pdf_uploaded = false
        const { data: subjectsData, error: subjectsError } = await supabase
          .from("subjects")
          .select("*")
          .eq("user_id", user.id)
          .eq("pdf_uploaded", false)
          .order("name");

        if (subjectsError) {
          throw new Error(`Failed to load subjects: ${subjectsError.message}`);
        }

        setSubjects(subjectsData || []);

        // 3. Handle preselected subject via query parameter
        const preselectedId = searchParams.get("subjectId");
        if (preselectedId && subjectsData) {
          const found = subjectsData.find((s) => s.id === preselectedId);
          if (found) {
            setSelectedSubjectId(preselectedId);
          }
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [supabase, router, searchParams]);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf" || ext === "docx") {
      setSelectedFile(file);
      setError(null);
    } else {
      setError("Unsupported file format. Please upload a PDF or DOCX file.");
      setSelectedFile(null);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !selectedFile || !currentUser) {
      setError("Please select a subject and choose a valid file first.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error("Backend API URL (NEXT_PUBLIC_BACKEND_URL) is not configured in the environment.");
      }

      // 1. Prepare Form Data
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("subject_id", selectedSubjectId);
      formData.append("user_id", currentUser.id);

      // 2. Call FastAPI backend
      const response = await fetch(`${backendUrl}/agents/upload/extract`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Backend analytical service failed (Status: ${response.status})`);
      }

      const result = await response.json();
      const topicCount = result.topic_map?.topics?.length || 0;

      // 3. Update Supabase subjects table
      const { error: dbError } = await supabase
        .from("subjects")
        .update({ pdf_uploaded: true })
        .eq("id", selectedSubjectId);

      if (dbError) {
        throw new Error(`Failed to update subject status in database: ${dbError.message}`);
      }

      // Log activity
      const today = new Date().toISOString().split('T')[0];
      const { error: activityError } = await supabase
        .from('study_activity')
        .upsert({
          user_id: currentUser.id,
          activity_date: today,
          activity_type: 'upload'
        }, { onConflict: 'user_id,activity_date' });

      if (activityError) {
        console.error("Failed to log activity:", activityError.message);
      }

      // 4. Show success state
      setExtractedCount(topicCount);
      setSuccess(true);

      // Remove from selection grid list
      setSubjects((prev) => prev.filter((s) => s.id !== selectedSubjectId));
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during document analysis.");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setSelectedSubjectId("");
    setSelectedFile(null);
    setExtractedCount(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-[#fefae0] text-[#01472e] p-6 md:p-12 pb-24 relative select-none">
      {/* Fractal noise overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-[0.03] select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="pageNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#pageNoise)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto relative z-20 space-y-8">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/subjects"
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border border-[#01472e]/10 hover:border-[#01472e]/30 bg-white hover:bg-[#ccd5ae]/10 transition-all duration-200 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            View Subjects
          </Link>
        </div>

        {/* Heading */}
        <div className="space-y-2 text-left">
          <h1 className="font-display text-4xl md:text-5xl tracking-tight uppercase text-[#01472e]">
            Upload Material
          </h1>
          <p className="font-sans text-[#01472e]/70 text-sm md:text-base">
            Select a subject and upload your PDF or DOCX to analyze the syllabus
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl p-4 text-left">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Initial Data */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#01472e]" />
            <p className="text-xs font-semibold text-[#01472e]/60">Loading your subjects...</p>
          </div>
        ) : success ? (
          /* SUCCESS STATE PANEL */
          <div className="bg-white border border-[#01472e]/15 rounded-[2.5rem] p-8 md:p-12 text-center max-w-xl mx-auto space-y-8 shadow-xl">
            <div className="w-20 h-20 rounded-full bg-[#e9edc9] border border-[#01472e] flex items-center justify-center mx-auto text-[#01472e] animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-3xl uppercase tracking-tight text-[#01472e]">
                Analysis Complete!
              </h2>
              <p className="font-sans text-sm text-[#01472e]/80">
                Successfully processed the file and generated a curriculum structure with{" "}
                <span className="font-bold text-[#01472e]">{extractedCount || 0} main topics</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/dashboard/subjects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold px-6 py-3.5 rounded-2xl bg-[#01472e] hover:bg-[#01472e]/95 text-white transition-all shadow-md cursor-pointer"
              >
                <span>View Subjects</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              {subjects.length > 0 && (
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold px-6 py-3.5 rounded-2xl border border-[#01472e]/25 text-[#01472e] bg-white hover:bg-[#ccd5ae]/10 transition-all cursor-pointer"
                >
                  Upload Another
                </button>
              )}
            </div>
          </div>
        ) : subjects.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white border border-[#ccd5ae]/30 rounded-3xl p-12 text-center max-w-md mx-auto space-y-6 shadow-xs">
            <div className="text-4xl">🎉</div>
            <h3 className="font-display text-2xl uppercase text-[#01472e]">All subjects uploaded!</h3>
            <p className="font-sans text-sm text-[#01472e]/70">
              You have uploaded study materials for all of your registered subjects.
            </p>
            <Link
              href="/dashboard/subjects"
              className="inline-flex items-center gap-2 text-xs font-bold px-6 py-3 rounded-2xl bg-[#01472e] hover:bg-[#01472e]/90 text-white transition-all shadow-md cursor-pointer"
            >
              Go to My Subjects
            </Link>
          </div>
        ) : (
          /* MAIN COMPONENT FLOW: STEP 1 & STEP 2 */
          <div className="space-y-10">
            {/* STEP 1: SUBJECT SELECTION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-left">
                <span className="w-6 h-6 rounded-full bg-[#01472e] text-white flex items-center justify-center text-xs font-black">
                  1
                </span>
                <h2 className="font-display text-xl uppercase tracking-wider text-[#01472e]">
                  Select Subject
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {subjects.map((subject) => {
                  const isSelected = selectedSubjectId === subject.id;
                  return (
                    <div
                      key={subject.id}
                      onClick={() => {
                        if (!uploading) setSelectedSubjectId(subject.id);
                      }}
                      className={`relative rounded-2xl p-5 border text-left cursor-pointer transition-all duration-200 select-none flex items-center justify-between ${
                        isSelected 
                          ? "border-[#01472e] bg-[#e9edc9] shadow-sm" 
                          : "border-[#e4e7f0] bg-white hover:border-[#ccd5ae]/60"
                      }`}
                    >
                      <div className="space-y-1 pr-6">
                        <p className="font-sans font-bold text-base text-[#01472e]">
                          {subject.name}
                        </p>
                        <p className="font-sans text-[10px] text-[#01472e]/60">
                          Syllabus Pending
                        </p>
                      </div>

                      {/* Select/Radio Indicator */}
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? "border-[#01472e] bg-[#01472e]" : "border-[#ccd5ae]"
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: FILE UPLOAD ZONE */}
            {selectedSubjectId && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2.5 text-left">
                  <span className="w-6 h-6 rounded-full bg-[#01472e] text-white flex items-center justify-center text-xs font-black">
                    2
                </span>
                  <h2 className="font-display text-xl uppercase tracking-wider text-[#01472e]">
                    Upload Study Material
                  </h2>
                </div>

                {/* Drag and Drop Container */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 relative ${
                    isDragActive 
                      ? "border-[#01472e] bg-[#e9edc9]/50 scale-[1.01]" 
                      : "border-[#01472e]/20 bg-white hover:border-[#01472e]/40 hover:bg-[#ccd5ae]/5"
                  } ${uploading ? "pointer-events-none opacity-50" : ""}`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.docx"
                  />

                  {uploading ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                      <Loader2 className="w-10 h-10 animate-spin text-[#01472e]" />
                      <p className="font-sans font-bold text-sm text-[#01472e] animate-pulse">
                        Analysing your document...
                      </p>
                      <p className="font-sans text-[11px] text-[#01472e]/50 max-w-xs leading-relaxed">
                        This takes a moment as the AI extracts syllabus topics, estimates exam weightage, and creates concept maps.
                      </p>
                    </div>
                  ) : selectedFile ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-2">
                      <div className="w-14 h-14 rounded-2xl bg-[#e9edc9] flex items-center justify-center text-[#01472e] border border-[#01472e]/10">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="font-sans font-bold text-sm text-[#01472e] max-w-md truncate mx-auto">
                          {selectedFile.name}
                        </p>
                        <p className="font-sans text-[10px] text-[#01472e]/50 mt-1">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click to change file
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 py-2">
                      <div className="w-14 h-14 rounded-2xl bg-[#ccd5ae]/10 flex items-center justify-center text-[#01472e]/40 border border-[#01472e]/5">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="font-sans font-bold text-sm text-[#01472e]">
                          Click to upload or drag & drop
                        </p>
                        <p className="font-sans text-[10px] text-[#01472e]/55 mt-1">
                          PDF or DOCX format only (max 15MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Action Button */}
                {selectedFile && !uploading && (
                  <button
                    onClick={handleUploadSubmit}
                    disabled={uploading}
                    className="w-full bg-[#01472e] hover:bg-[#01472e]/95 text-white font-bold text-xs py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Upload & Analyse Syllabus</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
