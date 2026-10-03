"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Home,
  Moon,
  Droplet,
  Dumbbell,
  Utensils,
  GraduationCap,
  Music,
  BookOpen,
  BarChart3,
  Calendar,
  CheckSquare,
  Trophy,
  Settings as SettingsIcon,
  KeyRound,
  Plus,
  Flame,
  Zap,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Target,
  Clock,
  TrendingUp,
  Download,
  Rocket,
  LogIn,
  MousePointer2,
  Bell,
  RotateCcw,
  Coffee,
  Salad,
  LucideIcon,
} from "lucide-react";

interface StepProps {
  num: number;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
}

function Step({ num, title, children, icon, color = "emerald" }: StepProps) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-500 text-slate-950 shadow-emerald-500/20",
    cyan: "bg-cyan-500 text-slate-950 shadow-cyan-500/20",
    indigo: "bg-indigo-500 text-white shadow-indigo-500/20",
    amber: "bg-amber-500 text-slate-950 shadow-amber-500/20",
    rose: "bg-rose-500 text-white shadow-rose-500/20",
    violet: "bg-violet-500 text-white shadow-violet-500/20",
  };

  return (
    <div className="flex gap-4">
      <div className="shrink-0">
        <div className={`w-9 h-9 rounded-xl ${colorMap[color]} font-black text-sm flex items-center justify-center shadow-lg`}>
          {num}
        </div>
        <div className="w-0.5 bg-gradient-to-b from-slate-700 to-transparent h-full mx-auto mt-2" />
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          {icon}
          <h4 className="text-sm font-black text-white">{title}</h4>
        </div>
        <div className="text-xs text-slate-300 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  color,
  title,
  points,
  description,
  badge,
}: {
  icon: LucideIcon;
  color: string;
  title: string;
  points: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition">
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <h4 className="text-sm font-black text-white">{title}</h4>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
              {points}
            </span>
          </div>
          {badge && (
            <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">{badge}</span>
          )}
          <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<"start" | "tracking" | "features" | "faq">("start");

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <Link
            href="/app"
            className="flex items-center gap-2 text-slate-300 hover:text-white text-sm font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to App</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <span className="font-extrabold text-sm text-white hidden sm:inline">
              LIFE<span className="text-emerald-400">MANAGER</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-emerald-900/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-black uppercase tracking-wider mb-3">
              <Rocket className="w-3.5 h-3.5" />
              <span>Website User Guide</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              How to Use <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Life Manager</span>
            </h1>

            <p className="text-sm text-slate-300 mt-4 leading-relaxed max-w-2xl">
              A complete step-by-step walkthrough of your 100-point daily discipline operating system — from first login to building unstoppable streaks.
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              <Link
                href="/app"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Open the App</span>
              </Link>
              <Link
                href="/install"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Install on Phone</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          {[
            { id: "start", label: "🚀 Getting Started" },
            { id: "tracking", label: "📊 Daily Tracking" },
            { id: "features", label: "✨ All Features" },
            { id: "faq", label: "❓ FAQ & Tips" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Getting Started */}
        {activeTab === "start" && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-panel rounded-3xl p-6 border border-slate-800">
              <h2 className="text-xl font-black text-white mb-5 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-emerald-400" />
                <span>Quick Start in 5 Steps (Under 2 Minutes)</span>
              </h2>

              <div>
                <Step num={1} title="Open the Website" icon={<Home className="w-4 h-4 text-emerald-400" />} color="emerald">
                  Visit the Life Manager URL in <span className="text-emerald-400 font-bold">any modern browser</span> — Chrome, Edge, Safari, Firefox, or Brave all work great on desktop, tablet, and mobile. The app loads instantly with your dashboard.
                </Step>

                <Step num={2} title="Log In with Option A (Fastest)" icon={<LogIn className="w-4 h-4 text-cyan-400" />} color="cyan">
                  Click the <span className="text-cyan-400 font-bold">"Option A Login"</span> button in the top-right of the Navbar, or open any user menu and tap <span className="text-cyan-400 font-bold">"Option A: Alex Rivera"</span>. You're instantly logged in with 30 days of realistic demo data to explore every feature.
                  <div className="mt-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                    💡 <span className="text-emerald-400 font-bold">Try all 3 demo profiles:</span> Option A (Alex, Level 5), Option B (Sarah, Pre-Med Level 6), or Option C (Marcus, Beginner Level 2). You can also register your own account.
                  </div>
                </Step>

                <Step num={3} title="Explore Your Dashboard" icon={<BarChart3 className="w-4 h-4 text-indigo-400" />} color="indigo">
                  Once logged in, you'll see your <span className="text-indigo-400 font-bold">100-point daily score</span> as a large circular ring at the top. Below it, you'll see the breakdown of all 9 categories (Sleep, Water, Fitness, Meals, Academics, Music, Journal, No-Oil, No-Caffeine).
                </Step>

                <Step num={4} title="Start Logging Your First Habit" icon={<MousePointer2 className="w-4 h-4 text-amber-400" />} color="amber">
                  Click the big green <span className="text-emerald-400 font-bold">"+ Fast Log"</span> button in the top-right. A modal opens with 1-tap options to add water (+500ml), toggle no-oil, mark meals complete, or log a quick workout. Your score updates instantly.
                </Step>

                <Step num={5} title="Navigate Between Tabs" icon={<ArrowRight className="w-4 h-4 text-violet-400" />} color="violet">
                  Use the <span className="text-violet-400 font-bold">left sidebar</span> (desktop) or <span className="text-violet-400 font-bold">bottom navigation bar</span> (mobile) to switch between the 11 sections: Dashboard, Sleep, Hydration, Fitness & Food, Learning, Journal, Analytics, Calendar, Tasks, Challenges, and Settings.
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold text-[11px]">That's it — you're ready to track discipline!</span>
                  </div>
                </Step>
              </div>
            </div>

            {/* Visual Interface Map */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <span>Visual Interface Map</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-1">Top Navbar</div>
                  <h4 className="text-sm font-bold text-white mb-2">Date & Quick Actions</h4>
                  <ul className="space-y-1.5 text-[11px] text-slate-400">
                    <li>• 📅 Date picker (←/→ to switch days)</li>
                    <li>• 🔔 Smart reminders bell</li>
                    <li>• 👤 Profile switcher dropdown</li>
                    <li>• 🔥 Streak badge</li>
                    <li>• ⚡ Live score counter</li>
                    <li>• ➕ Fast Log button</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-wider mb-1">Left Sidebar (Desktop)</div>
                  <h4 className="text-sm font-bold text-white mb-2">11 Navigation Tabs</h4>
                  <ul className="space-y-1.5 text-[11px] text-slate-400">
                    <li>• 🏠 Dashboard overview</li>
                    <li>• 😴 Sleep (20 pts)</li>
                    <li>• 💧 Hydration (10 pts)</li>
                    <li>• 🏋️ Fitness & Food (30 pts)</li>
                    <li>• 📚 Learning & Music (25 pts)</li>
                    <li>• 📖 Daily Journal (5 pts)</li>
                    <li>• 📊 Analytics graphs</li>
                    <li>• 📅 Calendar heatmap</li>
                    <li>• ✅ To-do tasks</li>
                    <li>• 🏆 Challenges & XP</li>
                    <li>• ⚙️ Settings</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-1">Main Content Area</div>
                  <h4 className="text-sm font-bold text-white mb-2">Interactive Tracking</h4>
                  <ul className="space-y-1.5 text-[11px] text-slate-400">
                    <li>• Score ring with breakdown</li>
                    <li>• 1-tap habit toggles</li>
                    <li>• Interactive charts</li>
                    <li>• Add/edit/delete modals</li>
                    <li>• Streak & badges display</li>
                    <li>• Full data persistence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Daily Tracking */}
        {activeTab === "tracking" && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-panel rounded-3xl p-6 border border-slate-800">
              <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <span>Your Daily 100-Point Scoring Breakdown</span>
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                Every day you can earn up to 100 points across 9 discipline categories. Here's exactly what each one tracks and how to log it:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SectionCard
                  icon={Moon}
                  color="bg-indigo-500/20 text-indigo-400"
                  title="Sleep"
                  points="20 pts"
                  description="Click 'Sleep' tab → tap '+ Add Sleep Slot' → enter start/end times (e.g., 11PM–7AM). Supports multiple slots per day (night sleep + naps). Full 20 pts for 7–8h."
                />
                <SectionCard
                  icon={Droplet}
                  color="bg-cyan-500/20 text-cyan-400"
                  title="Hydration"
                  points="10 pts"
                  description="Open 'Hydration' tab → tap quick-add chips (+100, +250, +500, +750, +1000 ml) or use custom amount. Goal: 4000 ml/day. Watch the animated bottle fill up."
                />
                <SectionCard
                  icon={Dumbbell}
                  color="bg-amber-500/20 text-amber-400"
                  title="Fitness"
                  points="10 pts"
                  description="Go to 'Fitness & Food' → tap 'Log Workout' or use the Live Stopwatch Timer. Select workout type (Gym, Running, etc.) + duration. 30+ mins = full 10 pts."
                />
                <SectionCard
                  icon={Utensils}
                  color="bg-emerald-500/20 text-emerald-400"
                  title="3 Daily Meals"
                  points="10 pts"
                  description="Toggle meals on dashboard or in 'Fitness & Food' tab. Breakfast 3.5 + Lunch 3.5 + Dinner 3.0 pts. Click 'Edit Details' to add food items & nutrition notes."
                />
                <SectionCard
                  icon={Salad}
                  color="bg-teal-500/20 text-teal-400"
                  title="No Added Oil"
                  points="5 pts"
                  badge="Daily Habit"
                  description="On your dashboard, toggle the '🥗 No Added Oil' button when you've eaten clean (no fried / oily food) all day. One tap = 5 pts."
                />
                <SectionCard
                  icon={Coffee}
                  color="bg-amber-500/20 text-amber-400"
                  title="No Caffeine After 6PM"
                  points="5 pts"
                  badge="Daily Habit"
                  description="Toggle '☕ No Caffeine' when you've avoided coffee/tea/energy drinks past 6PM. Configure cutoff time in Settings."
                />
                <SectionCard
                  icon={GraduationCap}
                  color="bg-violet-500/20 text-violet-400"
                  title="Academic Learning"
                  points="15 pts"
                  description="Open 'Learning' tab → tap 'Log Study (15 pts)' → enter Subject, Topic, Duration, Difficulty (1-5), and Notes. 60+ mins = full 15 pts. Builds a chronological study log."
                />
                <SectionCard
                  icon={Music}
                  color="bg-indigo-500/20 text-indigo-400"
                  title="Music Practice"
                  points="10 pts"
                  description="On 'Learning' tab → tap 'Log Music (10 pts)' → pick instrument (Piano, Guitar, etc.) + topic + duration. Logs your practice history."
                />
                <SectionCard
                  icon={BookOpen}
                  color="bg-rose-500/20 text-rose-400"
                  title="Daily Journal"
                  points="5 pts"
                  description="Open 'Journal' tab → pick mood (😞😕😐🙂😄) + energy level (1-5) → write gratitude, thoughts, and 3 reflection prompts. Click 'Save' for 5 pts."
                />
              </div>
            </div>

            {/* Fast Log Workflow */}
            <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-emerald-500/5">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                <span>⚡ The Fast Log Shortcut (Logs in 1 Tap)</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">What is Fast Log?</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Click the <span className="text-emerald-400 font-bold">green "+ Fast Log"</span> button in the top navbar from anywhere in the app. A modal opens with 1-tap buttons for every habit — so you can mark 5–7 items complete in under 10 seconds.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">What's inside:</h4>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    <li>💧 Water quick-add (+250/500/750/1000 ml)</li>
                    <li>🥗 No-Oil toggle (+5 pts)</li>
                    <li>☕ No-Caffeine toggle (+5 pts)</li>
                    <li>🍽️ Mark Breakfast/Lunch/Dinner done</li>
                    <li>🏋️ Log 30m workout (3 types)</li>
                    <li>📚 Log 60m study block (+15 pts)</li>
                    <li>🎵 Log 30m music practice (+10 pts)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: All Features */}
        {activeTab === "features" && (
          <div className="space-y-6 animate-fade-in">
            {/* Analytics */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">📊 Analytics & Progress Graphs</h3>
                  <p className="text-xs text-slate-400">See trends, patterns, and consistency over time</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p>• Click <span className="text-emerald-400 font-bold">"Analytics & Graphs"</span> in the sidebar</p>
                <p>• Choose a timeframe: <span className="text-emerald-400 font-bold">7 Days / 30 Days / 3 Months / 6 Months / 1 Year / All Time</span></p>
                <p>• Switch chart focus: <span className="text-emerald-400 font-bold">Overall Score, Sleep, Water, Fitness, Academics, or Music</span></p>
                <p>• Read <span className="text-emerald-400 font-bold">Smart Insights</span> — AI-generated based on your real logged data</p>
                <p>• See global stats: total days tracked, best score, longest streak, workout hours, water liters, perfect days</p>
              </div>
            </div>

            {/* Calendar */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">📅 Calendar Heatmap</h3>
                  <p className="text-xs text-slate-400">Monthly view with color-coded discipline scores</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p>• Click <span className="text-indigo-400 font-bold">"Calendar & Days"</span> in the sidebar</p>
                <p>• See color-coded tiles: 🟢 Excellent (85+), 🔵 Good (70-84), 🟡 Average (50-69), 🔴 Low (&lt;50)</p>
                <p>• 💎 diamond badge = Perfect 100/100 day</p>
                <p>• Tap any date to jump into that day's full log and edit historical records</p>
                <p>• Navigate months with the ◄ ► arrows at the top</p>
              </div>
            </div>

            {/* Tasks */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">✅ To-Do System (3 Categories)</h3>
                  <p className="text-xs text-slate-400">Organize tasks by scope and importance</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-xs font-black text-emerald-300 mb-1">🟢 Small Things</div>
                  <p className="text-[11px] text-slate-400">10-min tasks: replies, errands, quick fixes. Simple checkbox + due time.</p>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <div className="text-xs font-black text-rose-300 mb-1">🔴 Big Projects</div>
                  <p className="text-[11px] text-slate-400">Long-term projects with subtasks, progress %, deadlines, and notes.</p>
                </div>
                <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30">
                  <div className="text-xs font-black text-violet-300 mb-1">📚 Academic</div>
                  <p className="text-[11px] text-slate-400">College assignments with Subject, deadline, progress, and priority levels.</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-4">
                → Click <span className="text-emerald-400 font-bold">"New Task"</span>, choose category, fill in details, add subtasks (for Big/Academic), and save. Toggle done with a single click. Filter by category or status.
              </p>
            </div>

            {/* Challenges */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">🏆 Challenges, Badges & XP Levels</h3>
                  <p className="text-xs text-slate-400">Gamified progression system</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p>• <span className="text-amber-400 font-bold">8 Levels</span>: Beginner → Consistent → Disciplined → Strong → Elite → Master → Grandmaster → Unstoppable Titan</p>
                <p>• <span className="text-amber-400 font-bold">10 Badges</span> to unlock: 7-Day Streak 🔥, Hydration Master 💧, Sleep Architect 😴, Iron Will 🏋️, Scholar Supreme 📚, Perfect Day 💎, and more</p>
                <p>• <span className="text-amber-400 font-bold">7 Milestones</span>: 7-day, 30-day, 100-day tracking • 500/1000/2500 total points • 10 perfect days</p>
                <p>• XP automatically earned from daily scores + badge rewards</p>
                <p>• Watch your level progress bar fill in real-time</p>
              </div>
            </div>

            {/* Settings */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-slate-500/20 text-slate-400 flex items-center justify-center">
                  <SettingsIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">⚙️ Customize Your Targets</h3>
                  <p className="text-xs text-slate-400">Tailor the 100-point system to your personal goals</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p>• Open <span className="text-slate-200 font-bold">"Settings"</span> tab</p>
                <p>• Adjust your <span className="text-emerald-400 font-bold">Sleep hours target</span> (default 7.5h)</p>
                <p>• Change <span className="text-cyan-400 font-bold">Water target</span> (default 4000 ml)</p>
                <p>• Set <span className="text-amber-400 font-bold">Fitness duration</span> target (default 30 min)</p>
                <p>• Configure <span className="text-amber-400 font-bold">Caffeine cutoff time</span> (default 6:00 PM)</p>
                <p>• Set <span className="text-violet-400 font-bold">Academic/Music minute targets</span></p>
                <p>• Edit your display name and discipline title</p>
                <p>• 🔄 <span className="text-rose-400 font-bold">Reset Demo Data</span> button restores fresh 30-day sample dataset anytime</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FAQ */}
        {activeTab === "faq" && (
          <div className="space-y-4 animate-fade-in">
            {[
              {
                q: "Do I need to sign up to use the website?",
                a: "No! Just click 'Option A Login' in the top-right and you're instantly logged in with Alex Rivera's demo profile. You can also tap Option B (Sarah Chen) or Option C (Marcus Vance) for different starting points. Or register your own account from the Auth modal.",
              },
              {
                q: "Is my data saved?",
                a: "Yes — everything is stored in a secure PostgreSQL database. Your logs, scores, streaks, badges, and tasks persist across sessions. Logging back in with the same account loads all your historical data.",
              },
              {
                q: "Can I use this on my phone?",
                a: "Absolutely! The entire website is mobile-responsive and uses a bottom navigation bar on small screens. You can also install it as a Progressive Web App (PWA) — visit the /install page or click '📲 Install as APK / PWA' in the sidebar. It then behaves like a native app with its own home-screen icon.",
              },
              {
                q: "Can I switch between dates to log past days?",
                a: "Yes. Use the ← / → arrows next to the date picker in the Navbar, or click the date field to pick any day. All data for that day loads automatically. You can edit historical logs anytime.",
              },
              {
                q: "What happens if I miss a day?",
                a: "Your streak will reset, but all your historical data stays intact. You can always go back and log past days if you forgot — your overall average and best score are still preserved.",
              },
              {
                q: "How do I log multiple sleep slots (naps)?",
                a: "On the Sleep tab, click '+ Add Sleep Slot' as many times as needed. For example: 11:00 PM → 4:00 AM (5h) + 7:00 AM → 9:00 AM (2h) = 7h total sleep. Each slot has its own label (Core Sleep, Power Nap, etc.) and quality rating.",
              },
              {
                q: "What's the fastest way to log everything?",
                a: "Click the big green '+ Fast Log' button in the top-right. One modal gives you 1-tap access to add water, toggle habits, mark meals done, and log workouts — all in under 10 seconds.",
              },
              {
                q: "Can I create my own account?",
                a: "Yes. Click the user avatar in the top-right → 'Switch Account / Login' → tap 'New Account' tab. Enter your name, email, title, and password. Your account is created instantly with personalized seed data (30 days of starter history).",
              },
              {
                q: "How do levels and XP work?",
                a: "XP = total daily scores earned + badge rewards. Every point you log contributes 1 XP. Unlock badges to earn 150–500 bonus XP each. Level up from Beginner (0 XP) → Unstoppable Titan (10,000+ XP). See full progression on the Challenges tab.",
              },
              {
                q: "Does it work offline?",
                a: "If you install it as a PWA (via the /install page), yes — a service worker caches the app for offline access. New logs sync automatically when you reconnect. In regular browser mode, you need an internet connection for live syncing.",
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="glass-panel rounded-2xl p-4 border border-slate-800 group open:border-emerald-500/40 transition"
              >
                <summary className="cursor-pointer flex items-center justify-between gap-3 text-sm font-bold text-white group-open:text-emerald-300">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400 group-open:rotate-45 transition inline-block">+</span>
                    {item.q}
                  </span>
                </summary>
                <p className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}

            {/* Pro Tips */}
            <div className="glass-panel rounded-3xl p-6 border border-amber-500/30 bg-amber-500/5">
              <h3 className="text-base font-black text-white flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>💡 Pro Tips for Maximum Discipline</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><span className="text-amber-400 font-bold">Log in the morning</span> — mark your sleep from last night first to start the day with points on the board.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><span className="text-amber-400 font-bold">Use Fast Log 2–3x per day</span> — morning, lunch, and evening check-ins keep your score accurate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><span className="text-amber-400 font-bold">Review Analytics weekly</span> — identify your weakest category and target it next week.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><span className="text-amber-400 font-bold">Journal before bed</span> — mood + gratitude + 3 reflections = guaranteed 5 pts to close your day.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><span className="text-amber-400 font-bold">Target 80+ daily</span> — anything above 80 maintains "Elite" status and compounds streaks fast.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><span className="text-amber-400 font-bold">Install as PWA</span> for 1-tap home-screen access — makes daily logging 5x faster.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-emerald-950/40 border border-indigo-500/30 shadow-2xl text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Ready to Start Your Discipline Journey?
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
              Open the Life Manager dashboard, log your first habit, and watch your 100-point score climb in real-time.
            </p>

            <div className="flex flex-wrap gap-2 justify-center mt-5">
              <Link
                href="/app"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Rocket className="w-4 h-4" />
                <span>Launch Life Manager</span>
              </Link>
              <Link
                href="/install"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Install on Phone</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
