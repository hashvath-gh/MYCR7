"use client";

import React, { useState } from "react";
import {
  Droplet,
  Plus,
  Trash2,
  TrendingUp,
  Sparkles,
  Flame,
  Award,
  Clock,
  RotateCcw,
} from "lucide-react";
import { FullDayData, WaterLogData } from "@/types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

interface HydrationHubProps {
  dayData: FullDayData;
  analyticsData?: any;
  onAddWater: (amountMl: number) => Promise<void>;
  onDeleteWater: (id?: number, date?: string) => Promise<void>;
}

export function HydrationHub({
  dayData,
  analyticsData,
  onAddWater,
  onDeleteWater,
}: HydrationHubProps) {
  const { dayLog, breakdown, water, targets } = dayData;
  const [customMl, setCustomMl] = useState("350");
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [viewTimeframe, setViewTimeframe] = useState<"7d" | "30d" | "3m">("30d");

  const targetMl = targets.waterMl || 4000;
  const currentMl = dayLog.waterMl;
  const percentage = Math.min(100, Math.round((currentMl / targetMl) * 100));

  const handleQuickAdd = async (amount: number) => {
    await onAddWater(amount);
  };

  const handleCustomAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMl, 10);
    if (!isNaN(val) && val > 0) {
      await onAddWater(val);
      setShowCustomModal(false);
      setCustomMl("350");
    }
  };

  const chartData = analyticsData?.chartData || [];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Biological Optimal Hydration</div>
            <h1 className="text-xl sm:text-2xl font-black text-white">4 Litres Water Hub</h1>
            <p className="text-xs text-slate-400">Daily Goal: 4,000 ml (10 points total score)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Custom ML</span>
          </button>
        </div>
      </div>

      {/* Main Water Visualizer Card & Quick Chips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Bottle / Wave Card */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col items-center justify-between relative overflow-hidden">
          <div className="text-center w-full">
            <span className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider">Hydration Level</span>
            <div className="text-4xl sm:text-5xl font-black text-white mt-1">
              {currentMl.toLocaleString()} <span className="text-slate-400 text-base font-bold">/ {targetMl.toLocaleString()} ml</span>
            </div>
            <div className="text-xs font-semibold text-slate-400 mt-1">
              {(currentMl / 1000).toFixed(2)}L / {(targetMl / 1000).toFixed(1)}L Daily Target
            </div>
          </div>

          {/* Liquid Vessel Display */}
          <div className="my-6 relative w-36 h-56 rounded-3xl border-2 border-cyan-500/40 bg-slate-900/90 overflow-hidden shadow-inner flex flex-col justify-end p-1">
            {/* Liquid Fill Level */}
            <div
              className="w-full rounded-2xl bg-gradient-to-t from-cyan-600 via-cyan-500 to-blue-400 transition-all duration-700 relative"
              style={{ height: `${percentage}%` }}
            >
              {/* Wave shimmer */}
              <div className="absolute inset-0 bg-white/15 animate-pulse-subtle" />
            </div>

            {/* Vessel Percentage Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-white drop-shadow-md">{percentage}%</span>
              <span className="text-[10px] font-bold text-cyan-200 uppercase tracking-wider drop-shadow">
                {currentMl >= targetMl ? "Goal Achieved 🎉" : `${Math.max(0, targetMl - currentMl)} ml left`}
              </span>
            </div>
          </div>

          {/* Score Badge */}
          <div className="w-full p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Hydration Score:</span>
            <span className="text-sm font-black text-cyan-400">{breakdown.water} / 10 pts</span>
          </div>
        </div>

        {/* Right: Quick ML Add Chips & Water Log History */}
        <div className="lg:col-span-7 space-y-4">
          {/* Quick-Add ML Chips */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  1-Tap Instant Water Logging
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Tap to add</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[100, 200, 250, 300, 500, 750, 1000].map((ml) => (
                <button
                  key={ml}
                  onClick={() => handleQuickAdd(ml)}
                  className="py-3 px-2 rounded-2xl bg-slate-900/80 hover:bg-cyan-500/20 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-extrabold transition active:scale-95 text-center flex flex-col items-center justify-center cursor-pointer group"
                >
                  <Droplet className="w-4 h-4 text-cyan-400 mb-1 group-hover:scale-110 transition" />
                  <span>+{ml} ml</span>
                </button>
              ))}

              <button
                onClick={() => setShowCustomModal(true)}
                className="py-3 px-2 rounded-2xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 border border-cyan-500/30 text-xs font-extrabold transition active:scale-95 text-center flex flex-col items-center justify-center cursor-pointer"
              >
                <Plus className="w-4 h-4 text-cyan-300 mb-1" />
                <span>+ Custom</span>
              </button>
            </div>
          </div>

          {/* Today's Water Log Timeline */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Today's Logs ({water.length})
                </h3>
              </div>
              {water.length > 0 && (
                <button
                  onClick={() => onDeleteWater(undefined, dayLog.date)}
                  className="text-[11px] font-bold text-slate-400 hover:text-rose-400 transition cursor-pointer"
                >
                  Reset Today's Water
                </button>
              )}
            </div>

            {water.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No water entries logged yet for this date.
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {water.map((entry: WaterLogData) => (
                  <div
                    key={entry.id}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="font-extrabold text-white">+{entry.amountMl} ml</span>
                      <span className="text-slate-500">at {entry.loggedAtTime}</span>
                    </div>
                    <button
                      onClick={() => onDeleteWater(entry.id, dayLog.date)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition cursor-pointer"
                      title="Remove entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEPARATE WATER GRAPH */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Hydration Analytics & Intake Graph
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Daily water consumption against the 4,000 ml target benchmark
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            {(["7d", "30d", "3m"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setViewTimeframe(range)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  viewTimeframe === range
                    ? "bg-cyan-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "3 Months"}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={viewTimeframe === "7d" ? chartData.slice(-7) : chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="displayDate" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 4500]} stroke="#64748b" fontSize={11} tickLine={false} unit="ml" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "1rem",
                  fontSize: "12px",
                  color: "#fff",
                }}
              />
              <ReferenceLine y={4000} stroke="#06b6d4" strokeDasharray="4 4" label={{ value: "4000ml Target", fill: "#06b6d4", fontSize: 10, position: "right" }} />
              <Bar dataKey="waterMl" name="Water (ml)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Average Intake</div>
            <div className="text-base font-black text-cyan-400">{analyticsData?.summary?.avgWaterMl || 3850} ml</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Best Day</div>
            <div className="text-base font-black text-emerald-400">{analyticsData?.summary?.bestWaterMl || 4200} ml</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Goal Hit Rate</div>
            <div className="text-base font-black text-indigo-400">92%</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Consumed</div>
            <div className="text-base font-black text-white">{Math.round((analyticsData?.summary?.totalWaterConsumed || 115000) / 1000)} Litres</div>
          </div>
        </div>
      </div>

      {/* Custom ML Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">Custom Water Amount</h3>
              <button onClick={() => setShowCustomModal(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                Cancel
              </button>
            </div>

            <form onSubmit={handleCustomAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Amount (ml)</label>
                <input
                  type="number"
                  min="10"
                  max="3000"
                  step="10"
                  value={customMl}
                  onChange={(e) => setCustomMl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs transition cursor-pointer"
              >
                Log +{customMl} ml
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
