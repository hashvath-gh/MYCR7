"use client";

import React, { useState } from "react";
import { format, addDays, subDays, isToday, parseISO } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Flame,
  Zap,
  Plus,
  Bell,
  Sparkles,
  RotateCcw,
  User,
  CheckCircle2,
  Moon,
  Coffee,
  Droplet,
  KeyRound,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { UserProfile, DayBreakdown } from "@/types";

interface NavbarProps {
  currentDate: string;
  onDateChange: (newDate: string) => void;
  user: UserProfile | null;
  score: number;
  breakdown: DayBreakdown | null;
  onOpenFastLog: () => void;
  onOpenAuth: () => void;
  onQuickLoginOptionA: () => void;
  remindersCount?: number;
  caffeineCutoffTime?: string;
  waterMl?: number;
  waterTargetMl?: number;
}

export function Navbar({
  currentDate,
  onDateChange,
  user,
  score,
  breakdown,
  onOpenFastLog,
  onOpenAuth,
  onQuickLoginOptionA,
  remindersCount = 2,
  caffeineCutoffTime = "18:00",
  waterMl = 0,
  waterTargetMl = 4000,
}: NavbarProps) {
  const [showReminders, setShowReminders] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const parsedDate = parseISO(currentDate);
  const isSelectedToday = isToday(parsedDate);

  const handlePrevDay = () => {
    const prev = subDays(parsedDate, 1);
    onDateChange(format(prev, "yyyy-MM-dd"));
  };

  const handleNextDay = () => {
    const next = addDays(parsedDate, 1);
    onDateChange(format(next, "yyyy-MM-dd"));
  };

  const handleToday = () => {
    onDateChange(format(new Date(), "yyyy-MM-dd"));
  };

  const waterRemaining = Math.max(0, waterTargetMl - waterMl);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: App Logo & Date Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-slate-950 font-black" />
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                LIFE<span className="text-emerald-400">MANAGER</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">
                Discipline OS
              </span>
            </div>
          </div>

          {/* Date Picker Controls */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
            <button
              onClick={handlePrevDay}
              aria-label="Previous day"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-2">
              <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
              <input
                type="date"
                value={currentDate}
                onChange={(e) => e.target.value && onDateChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-200 cursor-pointer focus:outline-none w-[115px] sm:w-[125px]"
              />
            </div>

            <button
              onClick={handleNextDay}
              aria-label="Next day"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {!isSelectedToday && (
              <button
                onClick={handleToday}
                className="ml-1 px-2 py-0.5 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded-md transition"
              >
                Today
              </button>
            )}
          </div>
        </div>

        {/* Right: User Switcher / Option A button, Score, Reminders, Quick Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Option A Demo Login Button */}
          <button
            onClick={onQuickLoginOptionA}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition cursor-pointer"
            title="Instant 1-Click Login as Alex Rivera (Option A)"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Option A Login</span>
          </button>

          {/* User Account / Profile Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1 sm:pr-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={user?.name || "User"}
                className="w-7 h-7 rounded-lg object-cover border border-emerald-500/40"
              />
              <span className="text-xs font-bold text-white hidden md:inline truncate max-w-[90px]">
                {user?.name || "Alex Rivera"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            </button>

            {/* Profile Menu Popover */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl p-3 shadow-2xl border border-slate-700 z-50 animate-fade-in">
                <div className="flex items-center gap-2.5 pb-2.5 mb-2 border-b border-slate-800">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt={user?.name || "User"}
                    className="w-9 h-9 rounded-xl object-cover border border-emerald-400"
                  />
                  <div className="overflow-hidden">
                    <div className="font-extrabold text-xs text-white truncate">{user?.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenAuth();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-emerald-400" />
                      <span>Switch Account / Login</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onQuickLoginOptionA();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-indigo-500/20 text-indigo-300 font-bold transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>Option A (Alex Rivera)</span>
                    </div>
                    <span className="text-[10px] bg-indigo-500/20 px-1.5 py-0.5 rounded">Lv 5</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Live Score Chip */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className={`w-2 h-2 rounded-full ${score >= 80 ? "bg-emerald-400 animate-pulse" : score >= 50 ? "bg-amber-400" : "bg-rose-400"}`} />
            <span className="text-xs font-bold text-slate-300 hidden md:inline">Score:</span>
            <span className="text-xs font-extrabold text-white">
              {Math.round(score)}<span className="text-slate-400 text-[10px]">/100</span>
            </span>
          </div>

          {/* Streak Badge */}
          {user && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Flame className="w-4 h-4 fill-orange-400 text-orange-500 animate-pulse" />
              <span className="text-xs font-black tracking-tight">{user.currentStreak}d</span>
            </div>
          )}

          {/* Smart Reminders */}
          <div className="relative">
            <button
              onClick={() => setShowReminders(!showReminders)}
              aria-label="Smart Reminders"
              className="relative p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
            </button>

            {/* Reminders Drawer */}
            {showReminders && (
              <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl p-4 shadow-2xl border border-slate-700 z-50">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Smart Reminders
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-start gap-2.5">
                    <Coffee className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-amber-300">Caffeine Cutoff Reminder</div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        Target cutoff is <span className="font-bold text-amber-200">{caffeineCutoffTime}</span>. Avoid caffeine in the evening for restorative sleep.
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 flex items-start gap-2.5">
                    <Droplet className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-cyan-300">Hydration Progress</div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        {waterRemaining > 0 ? (
                          <>You have <span className="font-bold text-cyan-200">{waterRemaining} ml</span> remaining to hit your 4000 ml goal.</>
                        ) : (
                          <>🎉 4,000 ml Hydration goal reached today!</>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 flex items-start gap-2.5">
                    <Moon className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-indigo-300">7–8h Sleep Target</div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        Multi-slot tracking active. Log your night and morning recovery sleep periods.
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowReminders(false)}
                  className="mt-3 w-full py-1.5 text-center text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Fast Log Button */}
          <button
            onClick={onOpenFastLog}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Fast Log</span>
          </button>
        </div>
      </div>
    </header>
  );
}
