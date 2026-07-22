"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function UploadPage() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-8 bg-[#fefae0] min-h-screen text-[#01472e] select-none relative">
      {/* Fractal noise overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-[0.03] select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="pageNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#pageNoise)" />
        </svg>
      </div>

      <div className="max-w-md w-full text-center space-y-6 z-20 relative">
        <div className="inline-block p-4 rounded-full bg-[#ccd5ae]/20 border border-[#01472e]/10 text-4xl">
          📄
        </div>
        
        <h1 className="font-display text-4xl tracking-tight uppercase">
          Upload Material
        </h1>
        
        <p className="font-sans text-[#01472e]/80 text-sm leading-relaxed max-w-xs mx-auto">
          We are currently preparing your materials uploading pipeline. This feature will be available shortly.
        </p>

        <div className="h-[1px] bg-[#01472e]/15 w-24 mx-auto" />

        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl border border-[#01472e]/25 hover:border-[#01472e] bg-white hover:bg-[#ccd5ae]/10 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
