"use client";

import React from "react";

const skeletonStyle = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  .skeleton-element {
    background: linear-gradient(
      90deg,
      #e9edc9 25%,
      #f5f5e8 50%,
      #e9edc9 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
  }
`;

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8 w-full">
      <style dangerouslySetInnerHTML={{ __html: skeletonStyle }} />

      {/* 1. WELCOME BANNER SKELETON */}
      <div className="w-full lg:h-[160px] min-h-[160px] rounded-[12px] bg-white/20 border border-[#01472e]/15 p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Left Side: title + subtitle lines */}
        <div className="space-y-2 max-w-xl">
          <div className="skeleton-element w-48 h-8 rounded-md" />
          <div className="skeleton-element w-32 h-6 rounded-md" />
        </div>

        {/* Right Side: 3 stat boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          {/* Stat Card 1 */}
          <div className="skeleton-element w-full lg:w-[130px] h-[75px] rounded-[12px]" />
          {/* Stat Card 2 */}
          <div className="skeleton-element w-full lg:w-[130px] h-[75px] rounded-[12px]" />
          {/* Stat Card 3 */}
          <div className="skeleton-element col-span-2 sm:col-span-1 w-full lg:w-[130px] h-[75px] rounded-[12px]" />
        </div>
      </div>

      {/* 2. CARDS ROW SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Card 1 */}
        <div className="skeleton-element w-full h-[180px] rounded-[12px]" />
        {/* Card 2 */}
        <div className="skeleton-element w-full h-[180px] rounded-[12px]" />
        {/* Card 3 */}
        <div className="skeleton-element w-full h-[180px] rounded-[12px]" />
      </div>

      {/* 3. BOTTOM ROW SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6">
        {/* Heatmap Placeholder */}
        <div className="col-span-2 skeleton-element w-full h-[180px] rounded-[12px]" />
        {/* Breakdown Placeholder */}
        <div className="col-span-1 skeleton-element w-full h-[180px] rounded-[12px]" />
      </div>
    </div>
  );
}
