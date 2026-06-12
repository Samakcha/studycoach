"use client"

import * as React from "react"
import AnimatedDownloadButton from "@/components/ui/download-hover-button"

function DemoAnimatedDownloadButton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <AnimatedDownloadButton />
    </div>
  )
}

export { DemoAnimatedDownloadButton }
