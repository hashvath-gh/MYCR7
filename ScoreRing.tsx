"use client";

import React from "react";
import { DayBreakdown } from "@/types";
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

interface ScoreRingProps {
  score: number;
  breakdown: DayBreakdown;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({ score, breakdown, size = 200, strokeWidth = 14 }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Determine score color theme
  let strokeGradient = "url(#emerald-gradient)";
  let textColor = "text-emerald-400";
  let tierLabel = "Elite Discipline";
  let tierBadgeBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

  if (clampedScore >= 90) {
    strokeGradient = "url(#emerald-gradient)";
    textColor = "text-emerald-400";
    tierLabel = clampedScore >= 99 ? "💎 100/100 Master Day" : "🌟 Elite Performance";
    tierBadgeBg = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  } else if (clampedScore >= 75) {
    strokeGradient = "url(#cyan-gradient)";
    textColor = "text-cyan-400";
    tierLabel = "🔥 Strong Discipline";
    tierBadgeBg = "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
  } else if (clampedScore >= 50) {
    strokeGradient = "url(#amber-gradient)";
    textColor = "text-amber-400";
    tierLabel = "⚡ Making Progress";
    tierBadgeBg = "bg-amber-500/20 text-amber-300 border-amber-500/30";
  } else {
    strokeGradient = "url(#rose-gradient)";
    textColor = "text-rose-400";
    tierLabel = "⚠️ Needs Focus";
    tierBadgeBg = "bg-rose-500/20 text-rose-300 border-rose-500/30";
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="amber-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="rose-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
          </defs>

          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated active progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeGradient}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-0.5">Today's Score</span>
          <div className="flex items-baseline justify-center">
            <span className={`text-5xl font-black tracking-tight ${textColor}`}>
              {Math.round(clampedScore)}
            </span>
            <span className="text-slate-400 text-lg font-bold ml-1">/100</span>
          </div>
          <div className={`mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${tierBadgeBg}`}>
            {tierLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
