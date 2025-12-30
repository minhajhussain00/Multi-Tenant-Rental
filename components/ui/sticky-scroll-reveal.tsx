"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

interface StickyScrollItem {
  title: string;
  description: string;
  content?: React.ReactNode;
}

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: StickyScrollItem[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const cardLength = content.length;

  // 🔥 Logic from your code: closest breakpoint calculation
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const breakpoints = content.map((_, i) => i / cardLength);
    const closestIndex = breakpoints.reduce((acc, bp, i) => {
      const distance = Math.abs(latest - bp);
      if (distance < Math.abs(latest - breakpoints[acc])) return i;
      return acc;
    }, 0);
    setActiveCard(closestIndex);
  });

  // Background gradient changes per step
  const linearGradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)", // cyan→emerald
    "linear-gradient(to bottom right, #ec4899, #6366f1)", // pink→indigo
    "linear-gradient(to bottom right, #f97316, #eab308)", // orange→yellow
    "linear-gradient(to bottom right, #22d3ee, #a78bfa)", // cyan→purple
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(linearGradients[0]);

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex max-w-6xl gap-16 py-24"
    >
      {/* LEFT COLUMN — TEXT + timeline dots */}
      <div className="flex w-full flex-col gap-24 md:w-1/2">
        {content.map((item, index) => (
          <motion.div
            key={item.title + index}
            animate={{
              opacity: activeCard === index ? 1 : 0.3,
            }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            {/* Timeline dot */}
            <span
              className={cn(
                "absolute -left-8 top-2 h-3 w-3 rounded-full transition-all",
                activeCard === index
                  ? "bg-cyan-400 shadow-[0_0_18px_#22d3ee]"
                  : "bg-gray-600"
              )}
            />

            <h4 className="mb-3 text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              {item.title}
            </h4>
            <p className="text-gray-300 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>

      {/* RIGHT COLUMN — STICKY CONTENT */}
      <div className="relative hidden md:block md:w-1/2">
        <div className="sticky top-[38vh] translate-y-1/6">
          <motion.div
            key={activeCard}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ background: backgroundGradient }}
            className={cn(
              "h-[420px] w-full rounded-2xl overflow-hidden flex items-center justify-center",
              contentClassName
            )}
          >
            {content[activeCard]?.content ?? null}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
