"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const hashItems = items.filter((item) => item.url.startsWith("#"))
    if (hashItems.length === 0) return

    const triggers: ScrollTrigger[] = []

    gsap.registerPlugin(ScrollTrigger)

    hashItems.forEach((item) => {
      const id = item.url.substring(1)
      const element = document.getElementById(id)
      if (element) {
        const trigger = ScrollTrigger.create({
          trigger: element,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveTab(item.name)
            }
          },
          invalidateOnRefresh: true,
        })
        triggers.push(trigger)
      }
    })

    ScrollTrigger.refresh()

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, [items])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
        className,
      )}
    >
      <div className="flex items-center gap-3 bg-forest/10 border border-forest/15 backdrop-blur-md py-1.5 px-2 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={(e) => {
                setActiveTab(item.name)
                if (item.url.startsWith("#")) {
                  e.preventDefault()
                  const targetId = item.url.substring(1)
                  const el = document.getElementById(targetId)
                  if (el) {
                    const lenis = window.lenis;
                    if (lenis) {
                      lenis.scrollTo(el);
                    } else {
                      el.scrollIntoView({ behavior: "smooth" })
                    }
                  }
                }
              }}
              className={cn(
                "relative cursor-pointer text-xs md:text-sm font-semibold px-4 md:px-6 py-2 rounded-full transition-colors select-none",
                "text-forest/70 hover:text-forest",
                isActive && "text-forest font-bold",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={16} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-forest/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-forest rounded-t-full">
                    <div className="absolute w-12 h-6 bg-forest/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-forest/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-forest/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
