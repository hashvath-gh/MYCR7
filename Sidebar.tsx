"use client";

import React from "react";
import {
  Home,
  Moon,
  Droplet,
  Dumbbell,
  GraduationCap,
  BookOpen,
  BarChart3,
  Calendar,
  CheckSquare,
  Trophy,
  Settings,
  Flame,
  Zap,
  KeyRound,
  Sparkles,
  Download,
  BookOpenCheck,
} from "lucide-react";
import { UserProfile } from "@/types";

export type TabType =
  | "dashboard"
  | "sleep"
  | "hydration"
  | "fitness-food"
  | "learning"
  | "journal"
  | "analytics"
  | "calendar"
  | "tasks"
  | "challenges"
  | "settings";

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  user: UserProfile | null;
  score: number;
  onOpenAuth: () => void;
  onQuickLoginOptionA: () => void;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  user,
  score,
  onOpenAuth,
  onQuickLoginOptionA,
}: SidebarProps) {
  const navItems: Array<{ id: TabType; label: string; icon: React.ReactNode; points?: string; badgeColor?: string }> = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
    { id: "sleep", label: "Sleep", icon: <Moon className="w-4 h-4" />, points: "20 pts", badgeColor: "text-indigo-400 bg-indigo-500/10" },
    { id: "hydration", label: "Hydration", icon: <Droplet className="w-4 h-4" />, points: "10 pts", badgeColor: "text-cyan-400 bg-cyan-500/10" },
    { id: "fitness-food", label: "Fitness & Food", icon: <Dumbbell className="w-4 h-4" />, points: "30 pts", badgeColor: "text-amber-400 bg-amber-500/10" },
    { id: "learning", label: "Learning & Music", icon: <GraduationCap className="w-4 h-4" />, points: "25 pts", badgeColor: "text-violet-400 bg-violet-500/10" },
    { id: "journal", label: "Daily Journal", icon: <BookOpen className="w-4 h-4" />, points: "5 pts", badgeColor: "text-rose-400 bg-rose-500/10" },
    { id: "analytics", label: "Analytics & Graphs", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "calendar", label: "Calendar & Days", icon: <Calendar className="w-4 h-4" /> },
    { id: "tasks", label: "To-Do System", icon: <CheckSquare className="w-4 h-4" /> },
    { id: "challenges", label: "Challenges & XP", icon: <Trophy className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const mobileNavItems: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: "dashboard", label: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "sleep", label: "Sleep", icon: <Moon className="w-5 h-5" /> },
    { id: "hydration", label: "Water", icon: <Droplet className="w-5 h-5" /> },
    { id: "analytics", label: "Progress", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "tasks", label: "Tasks", icon: <CheckSquare className="w-5 h-5" /> },
    { id: "challenges", label: "XP", icon: <Trophy className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 glass-panel border-r border-slate-800/80 p-4 min-h-[calc(100vh-65px)]">
        {/* User Profile Card with Fast Switch trigger */}
        {user ? (
          <div
            onClick={onOpenAuth}
            className="mb-4 p-3 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex items-center justify-between group"
            title="Click to Switch User / Option A Login"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative shrink-0">
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 text-[9px] font-black px-1 rounded-md">
                  L{user.level}
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-xs text-white truncate group-hover:text-emerald-300">
                  {user.name}
                </div>
                <div className="text-[11px] text-slate-400 font-medium truncate">
                  {user.title || "Discipline Architect"}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center text-[10px] text-orange-400 font-bold">
                    <Flame className="w-3 h-3 mr-0.5 fill-orange-400" /> {user.currentStreak}d
                  </span>
                  <span className="flex items-center text-[10px] text-indigo-400 font-bold">
                    <Zap className="w-3 h-3 mr-0.5 fill-indigo-400" /> {user.xp} XP
                  </span>
                </div>
              </div>
            </div>

            <KeyRound className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0 ml-1 transition" />
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="mb-4 w-full p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>Option A / Log In</span>
          </button>
        )}

        {/* Navigation list */}
        <nav className="flex-1 space-y-1">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Habit Tracking
          </div>
          {navItems.slice(0, 6).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? "text-emerald-400" : "text-slate-400"}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.points && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${item.badgeColor || "text-slate-400 bg-slate-800"}`}>
                    {item.points}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Management & Insights
          </div>
          {navItems.slice(6).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? "text-emerald-400" : "text-slate-400"}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Scoring summary footer with Option A Quick Switch */}
        <div className="mt-auto pt-3 border-t border-slate-800/80 space-y-2">
          <a
            href="/"
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>🌟 Visit Landing Site</span>
          </a>

          <a
            href="/guide"
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>📖 How to Use Guide</span>
          </a>

          <a
            href="/install"
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>📲 Install as APK / PWA</span>
          </a>

          <button
            onClick={onQuickLoginOptionA}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-indigo-500/20 text-indigo-300 border border-slate-800 hover:border-indigo-500/40 text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Option A: Alex Rivera</span>
          </button>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <div className="flex justify-between items-center text-slate-300 font-semibold mb-1">
              <span>Daily Target</span>
              <span className="text-emerald-400 font-bold">100 Pts</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-slate-800/90 px-2 py-2 backdrop-blur-2xl">
        <div className="flex items-center justify-around">
          {mobileNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition cursor-pointer ${
                  isActive
                    ? "text-emerald-400 font-bold scale-105"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="mb-0.5">{item.icon}</span>
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
