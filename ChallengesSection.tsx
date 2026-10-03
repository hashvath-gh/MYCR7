"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Zap,
  Flame,
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  TrendingUp,
  Star,
  Shield,
  Crown,
} from "lucide-react";
import confetti from "canvas-confetti";

interface ChallengesSectionProps {
  challengesData: any;
  onRefresh?: () => void;
}

export function ChallengesSection({ challengesData, onRefresh }: ChallengesSectionProps) {
  const user = challengesData?.user || {};
  const levelInfo = challengesData?.levelInfo || {};
  const allLevels = challengesData?.allLevels || [];
  const badges = challengesData?.badges || [];
  const milestones = challengesData?.milestones || [];
  const stats = challengesData?.stats || {};

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#06b6d4", "#6366f1", "#f59e0b", "#ec4899"],
    });
  };

  const unlockedCount = badges.filter((b: any) => b.unlocked).length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Hero Level Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 p-0.5 shadow-xl shadow-orange-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Crown className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Level {user.level || 1} • {levelInfo.name || "Disciplined"}
              </span>
              <button
                onClick={triggerConfetti}
                className="text-[11px] font-bold text-slate-400 hover:text-amber-300 flex items-center gap-1 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Celebrate</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {user.name || "Alex Rivera"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Total Discipline XP: <span className="text-indigo-400 font-extrabold">{user.xp || 1840} XP</span> • Earned from daily scores & badges
            </p>
          </div>
        </div>

        {/* Level Progress Meter */}
        <div className="lg:w-80 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 relative z-10">
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-slate-300">Level {user.level} Progress</span>
            <span className="text-indigo-400">{levelInfo.progressPercent || 65}%</span>
          </div>

          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-700"
              style={{ width: `${levelInfo.progressPercent || 65}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
            <span>Current: {user.xp} XP</span>
            <span>Next: Level {(user.level || 1) + 1} ({levelInfo.nextLevel?.minXp || 2200} XP)</span>
          </div>
        </div>
      </div>

      {/* Level Progression Track */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Discipline Level Hierarchy</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {allLevels.map((lvl: any) => {
            const isCurrent = user.level === lvl.level;
            const isUnlocked = user.level >= lvl.level;
            return (
              <div
                key={lvl.level}
                className={`p-3 rounded-2xl border text-center transition ${
                  isCurrent
                    ? "bg-indigo-500/20 border-indigo-500/60 shadow-lg shadow-indigo-500/20 scale-102"
                    : isUnlocked
                    ? "bg-slate-900/90 border-slate-800 text-slate-300"
                    : "bg-slate-950/40 border-slate-900 text-slate-600 opacity-60"
                }`}
              >
                <div className="text-[10px] font-extrabold uppercase text-slate-400">Lv {lvl.level}</div>
                <div className={`text-xs font-black mt-1 ${isCurrent ? "text-indigo-300" : isUnlocked ? "text-white" : "text-slate-500"}`}>
                  {lvl.name}
                </div>
                <div className="text-[9px] text-slate-400 mt-1">{lvl.minXp} XP</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Collection Grid */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Badges & Achievements ({unlockedCount}/{badges.length})
            </h3>
          </div>
          <span className="text-xs font-bold text-amber-400">{unlockedCount} Unlocked</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {badges.map((badge: any) => (
            <div
              key={badge.id}
              className={`p-4 rounded-3xl border transition flex items-start gap-3.5 ${
                badge.unlocked
                  ? "bg-slate-900/90 border-amber-500/30 hover:border-amber-500/60 shadow-md shadow-amber-500/5"
                  : "bg-slate-950/50 border-slate-850 opacity-60"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  badge.unlocked
                    ? "bg-amber-500/20 border border-amber-500/30 shadow-inner"
                    : "bg-slate-900 border border-slate-800"
                }`}
              >
                {badge.icon}
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-bold truncate ${badge.unlocked ? "text-white" : "text-slate-400"}`}>
                    {badge.title}
                  </h4>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                    +{badge.xpReward} XP
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{badge.description}</p>

                {/* Progress */}
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className={badge.unlocked ? "text-emerald-400 font-bold" : "text-slate-500"}>
                    {badge.unlocked ? "✓ Unlocked" : `Progress: ${badge.progress}/${badge.maxProgress}`}
                  </span>
                  {!badge.unlocked && <Lock className="w-3 h-3 text-slate-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Long-Term Milestones */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
          <Award className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
            Discipline Milestones
          </h3>
        </div>

        <div className="space-y-3">
          {milestones.map((m: any) => (
            <div
              key={m.id}
              className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{m.title}</h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Target: {m.current} / {m.target} {m.completed ? "✓ Completed" : "in progress"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:w-64">
                <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      m.completed ? "bg-emerald-400" : "bg-indigo-500"
                    }`}
                    style={{ width: `${Math.min(100, Math.round((m.current / m.target) * 100))}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-amber-400 shrink-0">+{m.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
