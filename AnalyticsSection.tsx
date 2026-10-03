"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Flame,
  Calendar,
  Droplet,
  Moon,
  Dumbbell,
  GraduationCap,
  Music,
  BookOpen,
  Utensils,
  Salad,
  Award,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

interface AnalyticsSectionProps {
  analyticsData: any;
  currentRange: string;
  onRangeChange: (range: string, from?: string, to?: string) => void;
}

export function AnalyticsSection({
  analyticsData,
  currentRange,
  onRangeChange,
}: AnalyticsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<
    "overall" | "sleep" | "water" | "fitness" | "food" | "academic" | "music" | "journal"
  >("overall");

  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const chartData = analyticsData?.chartData || [];
  const summary = analyticsData?.summary || {};
  const globalStats = analyticsData?.globalStats || {};
  const categoryAverages = analyticsData?.categoryAverages || {};
  const insights = analyticsData?.insights || [];

  const handleCustomFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (customFrom && customTo) {
      onRangeChange("custom", customFrom, customTo);
    }
  };

  const ranges = [
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "3m", label: "3 Months" },
    { id: "6m", label: "6 Months" },
    { id: "1y", label: "1 Year" },
    { id: "all", label: "All Time" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner & Timeframe Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Quantitative Self</div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Progress Analytics & Graphs</h1>
            <p className="text-xs text-slate-400">100-point discipline curves, category correlations, and data trends</p>
          </div>
        </div>

        {/* Range Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl">
          {ranges.map((r) => (
            <button
              key={r.id}
              onClick={() => onRangeChange(r.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                currentRange === r.id
                  ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Global Long-Term Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Days Tracked</div>
          <div className="text-xl font-black text-white mt-0.5">{globalStats.totalDaysTracked || 30}</div>
          <div className="text-[10px] text-emerald-400 font-semibold">100% active</div>
        </div>

        <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Current Streak</div>
          <div className="text-xl font-black text-orange-400 mt-0.5">{globalStats.currentStreak || 14}d</div>
          <div className="text-[10px] text-slate-400">Best: {globalStats.longestStreak || 21}d</div>
        </div>

        <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Average Score</div>
          <div className="text-xl font-black text-emerald-400 mt-0.5">{summary.avgScore || 81.4}</div>
          <div className="text-[10px] text-slate-400">/ 100 max</div>
        </div>

        <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Best Score</div>
          <div className="text-xl font-black text-cyan-400 mt-0.5">{summary.bestScore || 99}</div>
          <div className="text-[10px] text-slate-400">Peak performance</div>
        </div>

        <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Workout Time</div>
          <div className="text-xl font-black text-amber-400 mt-0.5">
            {Math.round((globalStats.allTimeWorkoutMinutes || 1050) / 60)}h
          </div>
          <div className="text-[10px] text-slate-400">All-time fitness</div>
        </div>

        <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Total Water</div>
          <div className="text-xl font-black text-blue-400 mt-0.5">
            {Math.round((globalStats.allTimeWaterMl || 118000) / 1000)}L
          </div>
          <div className="text-[10px] text-slate-400">Hydration volume</div>
        </div>
      </div>

      {/* Smart Personal Insights Engine */}
      {insights.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Data-Driven Personal Insights
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {insights.map((insight: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3"
              >
                <span className="text-2xl shrink-0 mt-0.5">{insight.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{insight.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Interactive Graphs */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        {/* Category Chart Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              {activeCategory === "overall"
                ? "Overall 100-Point Daily Score Curve"
                : activeCategory === "sleep"
                ? "Sleep Hours vs Target (7–8h)"
                : activeCategory === "water"
                ? "Hydration Intake vs Target (4,000ml)"
                : activeCategory === "fitness"
                ? "Daily Workout Minutes"
                : activeCategory === "academic"
                ? "Academic Study Minutes"
                : activeCategory === "music"
                ? "Music Practice Minutes"
                : "Category Breakdown"}
            </h3>
            <p className="text-xs text-slate-400">
              Hover over points to inspect individual dates
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            {[
              { id: "overall", label: "Overall (100)", color: "text-emerald-400" },
              { id: "sleep", label: "Sleep (20)", color: "text-indigo-400" },
              { id: "water", label: "Water (10)", color: "text-cyan-400" },
              { id: "fitness", label: "Fitness (10)", color: "text-amber-400" },
              { id: "academic", label: "Academic (15)", color: "text-violet-400" },
              { id: "music", label: "Music (10)", color: "text-blue-400" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Chart Render */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeCategory === "overall" ? (
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="overallScoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="displayDate" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "1rem",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                />
                <ReferenceLine y={80} stroke="#10b981" strokeDasharray="4 4" label={{ value: "80+ Benchmark", fill: "#10b981", fontSize: 10, position: "right" }} />
                <Area type="monotone" dataKey="score" name="Daily Score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#overallScoreGrad)" />
                <Line type="monotone" dataKey="score" stroke="#34d399" strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} />
              </ComposedChart>
            ) : activeCategory === "sleep" ? (
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="displayDate" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} tickLine={false} unit="h" />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "1rem", fontSize: "12px", color: "#fff" }} />
                <ReferenceLine y={7.0} stroke="#10b981" strokeDasharray="4 4" label={{ value: "7h Target", fill: "#10b981", fontSize: 10, position: "right" }} />
                <ReferenceLine y={8.0} stroke="#06b6d4" strokeDasharray="4 4" label={{ value: "8h Target", fill: "#06b6d4", fontSize: 10, position: "right" }} />
                <Bar dataKey="sleepHours" name="Sleep (Hours)" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </ComposedChart>
            ) : activeCategory === "water" ? (
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="displayDate" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 4500]} stroke="#64748b" fontSize={11} tickLine={false} unit="ml" />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "1rem", fontSize: "12px", color: "#fff" }} />
                <ReferenceLine y={4000} stroke="#06b6d4" strokeDasharray="4 4" label={{ value: "4000ml Target", fill: "#06b6d4", fontSize: 10, position: "right" }} />
                <Bar dataKey="waterMl" name="Water (ml)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </ComposedChart>
            ) : activeCategory === "fitness" ? (
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="displayDate" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 60]} stroke="#64748b" fontSize={11} tickLine={false} unit="m" />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "1rem", fontSize: "12px", color: "#fff" }} />
                <ReferenceLine y={30} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "30m Target", fill: "#f59e0b", fontSize: 10, position: "right" }} />
                <Bar dataKey="fitnessMinutes" name="Workout (Min)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </ComposedChart>
            ) : activeCategory === "academic" ? (
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="displayDate" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 120]} stroke="#64748b" fontSize={11} tickLine={false} unit="m" />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "1rem", fontSize: "12px", color: "#fff" }} />
                <ReferenceLine y={60} stroke="#8b5cf6" strokeDasharray="4 4" label={{ value: "60m Target", fill: "#8b5cf6", fontSize: 10, position: "right" }} />
                <Bar dataKey="academicMinutes" name="Study (Min)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </ComposedChart>
            ) : (
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="displayDate" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 60]} stroke="#64748b" fontSize={11} tickLine={false} unit="m" />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "1rem", fontSize: "12px", color: "#fff" }} />
                <ReferenceLine y={30} stroke="#3b82f6" strokeDasharray="4 4" label={{ value: "30m Target", fill: "#3b82f6", fontSize: 10, position: "right" }} />
                <Bar dataKey="musicMinutes" name="Music (Min)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
