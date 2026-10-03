"use client";

import React from "react";
import { format, parseISO } from "date-fns";
import {
  Moon,
  Droplet,
  Dumbbell,
  Salad,
  Coffee,
  GraduationCap,
  Music,
  BookOpen,
  Utensils,
  Plus,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Flame,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { FullDayData, UserProfile, TaskData } from "@/types";
import { ScoreRing } from "@/components/ScoreRing";
import { formatMinutesToHours } from "@/lib/scoring";

interface HomeDashboardProps {
  dayData: FullDayData;
  user: UserProfile | null;
  tasks: TaskData[];
  onNavigateTab: (tab: any) => void;
  onAddWater: (amountMl: number) => Promise<void>;
  onToggleHabit: (habitKey: "noOil" | "noCaffeine", completed: boolean) => Promise<void>;
  onToggleMeal: (mealType: "breakfast" | "lunch" | "dinner", completed: boolean) => Promise<void>;
  onOpenFastLog: () => void;
}

export function HomeDashboard({
  dayData,
  user,
  tasks,
  onNavigateTab,
  onAddWater,
  onToggleHabit,
  onToggleMeal,
  onOpenFastLog,
}: HomeDashboardProps) {
  const { dayLog, breakdown, sleepSlots, meals, fitness, water, music, academics, journal, targets } = dayData;
  const score = Number(dayLog.score);

  // Time of day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Meal statuses
  const breakfast = meals.find((m) => m.mealType === "breakfast");
  const lunch = meals.find((m) => m.mealType === "lunch");
  const dinner = meals.find((m) => m.mealType === "dinner");

  // Tasks summary
  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* First-Time User Guide Banner */}
      <a
        href="/guide"
        className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-500/30 hover:border-amber-500/50 transition cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/10">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black text-white group-hover:text-amber-200 transition">
              📖 New here? Read the "How to Use" guide
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">
              Learn how to log habits, earn 100 pts/day, track streaks, and unlock badges in under 2 minutes
            </div>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition shrink-0" />
      </a>

      {/* Hero Greeting & Streak Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personal Operating System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {greeting}, <span className="bg-gradient-to-r from-white via-slate-200 to-emerald-300 bg-clip-text text-transparent">{user?.name || "Alex"}</span> 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tracking discipline for <span className="text-slate-200 font-semibold">{format(parseISO(dayLog.date), "EEEE, MMMM d, yyyy")}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Consistency Streak</div>
              <div className="text-base font-black text-white">
                {user?.currentStreak || 14} <span className="text-xs font-normal text-slate-400">days active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 100-Point Score Section & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Score Gauge */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col items-center justify-center border border-slate-800 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <ScoreRing score={score} breakdown={breakdown} size={220} strokeWidth={15} />

          <div className="w-full mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Points Earned</div>
              <div className="text-lg font-black text-emerald-400">{score.toFixed(1)} <span className="text-xs font-medium text-slate-400">/ 100</span></div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Points Missing</div>
              <div className="text-lg font-black text-rose-400">{Math.max(0, Number((100 - score).toFixed(1)))} <span className="text-xs font-medium text-slate-400">pts</span></div>
            </div>
          </div>
        </div>

        {/* Right: Score Breakdown Analysis (Where you gained & where you missed points) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Daily Points Breakdown</h3>
              </div>
              <span className="text-xs font-bold text-slate-400">100 Pts Max</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Sleep */}
              <div
                onClick={() => onNavigateTab("sleep")}
                className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/30 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">😴 Sleep Target</div>
                    <div className="text-[11px] text-slate-400">{formatMinutesToHours(dayLog.totalSleepMinutes)} / {targets.sleepHours}h</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-indigo-400">{breakdown.sleep}</span>
                  <span className="text-[10px] text-slate-500">/20</span>
                </div>
              </div>

              {/* Water */}
              <div
                onClick={() => onNavigateTab("hydration")}
                className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">💧 Water Target</div>
                    <div className="text-[11px] text-slate-400">{dayLog.waterMl} / {targets.waterMl} ml</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-cyan-400">{breakdown.water}</span>
                  <span className="text-[10px] text-slate-500">/10</span>
                </div>
              </div>

              {/* Fitness */}
              <div
                onClick={() => onNavigateTab("fitness-food")}
                className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300">🏋️ Fitness Exercise</div>
                    <div className="text-[11px] text-slate-400">{dayLog.fitnessMinutes} / {targets.fitnessMin} min</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-amber-400">{breakdown.fitness}</span>
                  <span className="text-[10px] text-slate-500">/10</span>
                </div>
              </div>

              {/* 3 Meals */}
              <div
                onClick={() => onNavigateTab("fitness-food")}
                className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">🍽️ 3 Daily Meals</div>
                    <div className="text-[11px] text-slate-400">
                      {[breakfast?.completed ? "B" : null, lunch?.completed ? "L" : null, dinner?.completed ? "D" : null].filter(Boolean).length || 0}/3 meals
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-400">{breakdown.food}</span>
                  <span className="text-[10px] text-slate-500">/10</span>
                </div>
              </div>

              {/* Academics */}
              <div
                onClick={() => onNavigateTab("learning")}
                className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-violet-500/30 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-violet-300">📚 Academic Study</div>
                    <div className="text-[11px] text-slate-400">{dayLog.academicMinutes} / {targets.academicMin} min</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-violet-400">{breakdown.academic}</span>
                  <span className="text-[10px] text-slate-500">/15</span>
                </div>
              </div>

              {/* Music */}
              <div
                onClick={() => onNavigateTab("learning")}
                className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/30 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">🎵 Music Practice</div>
                    <div className="text-[11px] text-slate-400">{dayLog.musicMinutes} / {targets.musicMin} min</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-indigo-400">{breakdown.music}</span>
                  <span className="text-[10px] text-slate-500">/10</span>
                </div>
              </div>

              {/* Habits: No Oil & Caffeine */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                    <Salad className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">🥗 No Added Oil</div>
                    <div className="text-[11px] text-slate-400">{dayLog.noOilCompleted ? "Completed" : "Not yet"}</div>
                  </div>
                </div>
                <button
                  onClick={() => onToggleHabit("noOil", !dayLog.noOilCompleted)}
                  className={`text-xs font-bold px-2 py-1 rounded-lg transition cursor-pointer ${
                    dayLog.noOilCompleted
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {dayLog.noOilCompleted ? "+5 pts ✓" : "0 / 5"}
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">☕ Caffeine &lt; 6PM</div>
                    <div className="text-[11px] text-slate-400">{dayLog.noCaffeineCompleted ? "Completed" : "Cutoff 18:00"}</div>
                  </div>
                </div>
                <button
                  onClick={() => onToggleHabit("noCaffeine", !dayLog.noCaffeineCompleted)}
                  className={`text-xs font-bold px-2 py-1 rounded-lg transition cursor-pointer ${
                    dayLog.noCaffeineCompleted
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {dayLog.noCaffeineCompleted ? "+5 pts ✓" : "0 / 5"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold text-slate-300">📖 Daily Journal:</span>
              <span className={`text-xs font-extrabold ${breakdown.journal > 0 ? "text-rose-400" : "text-slate-500"}`}>
                {breakdown.journal}/5 pts
              </span>
            </div>
            <button
              onClick={() => onNavigateTab("journal")}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition cursor-pointer"
            >
              <span>{journal?.completed ? "Edit Journal" : "Write Journal"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Hydration & Quick Meal Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hydration Quick Controller */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Quick Water Intake</h3>
            </div>
            <span className="text-xs font-extrabold text-cyan-400">
              {dayLog.waterMl} / {targets.waterMl} ml
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-800 mb-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((dayLog.waterMl / targets.waterMl) * 100))}%` }}
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[200, 300, 500, 750].map((ml) => (
              <button
                key={ml}
                onClick={() => onAddWater(ml)}
                className="py-2 text-xs font-bold rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 transition active:scale-95 text-center cursor-pointer"
              >
                +{ml} ml
              </button>
            ))}
          </div>
        </div>

        {/* 3 Meals Quick Check */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Daily Meals</h3>
            </div>
            <span className="text-xs font-extrabold text-emerald-400">{breakdown.food}/10 pts</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onToggleMeal("breakfast", !breakfast?.completed)}
              className={`p-2.5 rounded-2xl border text-center transition active:scale-95 cursor-pointer ${
                breakfast?.completed
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="text-xs font-bold">Breakfast</div>
              <div className="text-[10px] mt-0.5 opacity-80">{breakfast?.completed ? "✓ 3.5 pts" : "3.5 pts"}</div>
            </button>

            <button
              onClick={() => onToggleMeal("lunch", !lunch?.completed)}
              className={`p-2.5 rounded-2xl border text-center transition active:scale-95 cursor-pointer ${
                lunch?.completed
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="text-xs font-bold">Lunch</div>
              <div className="text-[10px] mt-0.5 opacity-80">{lunch?.completed ? "✓ 3.5 pts" : "3.5 pts"}</div>
            </button>

            <button
              onClick={() => onToggleMeal("dinner", !dinner?.completed)}
              className={`p-2.5 rounded-2xl border text-center transition active:scale-95 cursor-pointer ${
                dinner?.completed
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="text-xs font-bold">Dinner</div>
              <div className="text-[10px] mt-0.5 opacity-80">{dinner?.completed ? "✓ 3.0 pts" : "3.0 pts"}</div>
            </button>
          </div>
        </div>
      </div>

      {/* Active Tasks Snapshot */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Active Priorities & To-Dos</h3>
          </div>
          <button
            onClick={() => onNavigateTab("tasks")}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition cursor-pointer"
          >
            <span>View All Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            🎉 All active tasks completed for today!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onNavigateTab("tasks")}
                className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      task.category === "academic" ? "bg-violet-400" : task.category === "big" ? "bg-rose-400" : "bg-emerald-400"
                    }`}
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                      {task.title}
                    </div>
                    {task.subject && (
                      <span className="text-[10px] text-violet-400 font-semibold">{task.subject}</span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      task.priority === "urgent"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : task.priority === "high"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
