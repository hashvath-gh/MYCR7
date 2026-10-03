"use client";

import React, { useState } from "react";
import {
  Moon,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Zap,
} from "lucide-react";
import { FullDayData, SleepSlotData } from "@/types";
import { calculateSlotDurationMinutes, formatMinutesToHours } from "@/lib/scoring";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

interface SleepTrackerProps {
  dayData: FullDayData;
  analyticsData?: any;
  onAddSleepSlot: (slot: { date: string; startTime: string; endTime: string; label: string; quality: string }) => Promise<void>;
  onEditSleepSlot: (slot: { id: number; date: string; startTime: string; endTime: string; label: string; quality: string }) => Promise<void>;
  onDeleteSleepSlot: (id: number, date: string) => Promise<void>;
}

export function SleepTracker({
  dayData,
  analyticsData,
  onAddSleepSlot,
  onEditSleepSlot,
  onDeleteSleepSlot,
}: SleepTrackerProps) {
  const { dayLog, breakdown, sleepSlots, targets } = dayData;
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<SleepSlotData | null>(null);

  // Form states
  const [startTime, setStartTime] = useState("23:00");
  const [endTime, setEndTime] = useState("06:30");
  const [label, setLabel] = useState("Core Night Sleep");
  const [quality, setQuality] = useState("Deep");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewTimeframe, setViewTimeframe] = useState<"7d" | "30d" | "3m">("30d");

  const totalHours = Number((dayLog.totalSleepMinutes / 60).toFixed(1));
  const targetHours = targets.sleepHours || 7.5;

  const handleOpenAdd = () => {
    setEditingSlot(null);
    setStartTime("23:00");
    setEndTime("06:30");
    setLabel("Core Night Sleep");
    setQuality("Deep");
    setShowAddModal(true);
  };

  const handleOpenEdit = (slot: SleepSlotData) => {
    setEditingSlot(slot);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setLabel(slot.label);
    setQuality(slot.quality || "Good");
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingSlot) {
        await onEditSleepSlot({
          id: editingSlot.id,
          date: dayLog.date,
          startTime,
          endTime,
          label,
          quality,
        });
      } else {
        await onAddSleepSlot({
          date: dayLog.date,
          startTime,
          endTime,
          label,
          quality,
        });
      }
      setShowAddModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chart data from analytics or fallback
  const chartData = analyticsData?.chartData || [];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Moon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Restorative Physiology</div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Sleep & Circadian Tracker</h1>
            <p className="text-xs text-slate-400">Target: 7–8 hours total daily sleep (Multiple slots supported)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sleep Slot</span>
          </button>
        </div>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sleep */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Total Sleep Today</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {formatMinutesToHours(dayLog.totalSleepMinutes)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalHours >= 7.0 && totalHours <= 8.5 ? (
              <span className="text-emerald-400 font-semibold">✓ In optimal 7–8h window</span>
            ) : totalHours < 7.0 ? (
              <span className="text-amber-400 font-semibold">{Number((7.0 - totalHours).toFixed(1))}h under 7h target</span>
            ) : (
              <span className="text-blue-400 font-semibold">{totalHours}h (Extended recovery)</span>
            )}
          </div>
        </div>

        {/* Sleep Score */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Sleep Score</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400">
            {breakdown.sleep} <span className="text-xs font-normal text-slate-500">/ 20 pts</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {breakdown.sleep >= 20 ? "Maximum 20 points awarded" : `${Number((20 - breakdown.sleep).toFixed(1))} points lost`}
          </div>
        </div>

        {/* Number of Sleep Slots */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Sleep Slots</span>
            <Moon className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {sleepSlots.length} <span className="text-xs font-normal text-slate-500">slots logged</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Polyphasic / Multi-period ready
          </div>
        </div>

        {/* 30-Day Average */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>30-Day Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {analyticsData?.summary?.avgSleepHours || 7.4} <span className="text-xs font-normal text-slate-400">hours/day</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Consistency: <span className="text-emerald-400 font-bold">94%</span>
          </div>
        </div>
      </div>

      {/* Sleep Slots List (Customizable Slots for Current Day) */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Today's Sleep Periods ({sleepSlots.length})
            </h3>
            <p className="text-xs text-slate-400">
              Combine night sleep, morning recovery, or afternoon power naps to hit your 7–8h goal.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-bold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slot</span>
          </button>
        </div>

        {sleepSlots.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl">
            <Moon className="w-8 h-8 text-indigo-400/40 mx-auto mb-2" />
            <p className="font-semibold text-slate-300">No sleep slots recorded for this date.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Click "Add Sleep Slot" to record your sleep.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sleepSlots.map((slot, idx) => {
              const durMins = slot.durationMinutes || calculateSlotDurationMinutes(slot.startTime, slot.endTime);
              return (
                <div
                  key={slot.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded-md">
                      Slot #{idx + 1} • {slot.label}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                      {slot.quality || "Good"}
                    </span>
                  </div>

                  <div className="my-2">
                    <div className="text-lg font-black text-white flex items-center gap-2">
                      <span>{slot.startTime}</span>
                      <span className="text-slate-500 text-xs font-bold">→</span>
                      <span>{slot.endTime}</span>
                    </div>
                    <div className="text-xs font-extrabold text-emerald-400 mt-0.5">
                      {formatMinutesToHours(durMins)} ({Number((durMins / 60).toFixed(1))} hrs)
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleOpenEdit(slot)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
                      title="Edit Slot"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteSleepSlot(slot.id, dayLog.date)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                      title="Delete Slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SEPARATE SLEEP GRAPH WITH 7-8H TARGET LINES */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Sleep Consistency & History Graph
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Tracking total daily sleep hours with target 7–8h restorative threshold line
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            {(["7d", "30d", "3m"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setViewTimeframe(range)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  viewTimeframe === range
                    ? "bg-indigo-600 text-white shadow-sm"
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
            <ComposedChart
              data={viewTimeframe === "7d" ? chartData.slice(-7) : chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="sleepAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="displayDate" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} tickLine={false} unit="h" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "1rem",
                  fontSize: "12px",
                  color: "#fff",
                }}
              />
              {/* Target 7h to 8.5h shaded region */}
              <ReferenceArea y1={7} y2={8.5} fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeOpacity={0.3} strokeDasharray="2 2" />
              <ReferenceLine y={7.0} stroke="#10b981" strokeDasharray="4 4" label={{ value: "7h Target", fill: "#10b981", fontSize: 10, position: "right" }} />
              <ReferenceLine y={8.0} stroke="#06b6d4" strokeDasharray="4 4" label={{ value: "8h Target", fill: "#06b6d4", fontSize: 10, position: "right" }} />
              
              <Area
                type="monotone"
                dataKey="sleepHours"
                name="Sleep Hours"
                stroke="#818cf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#sleepAreaGrad)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-indigo-500/80 inline-block" /> Sleep Logged
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-500/60 inline-block" /> 7–8h Optimal Zone
            </span>
          </div>
          <div>
            Scoring: <span className="text-emerald-400 font-bold">7–8h = 20 pts</span> | 6–7h = 14–19 pts | &lt;5h = low pts
          </div>
        </div>
      </div>

      {/* Add / Edit Sleep Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-extrabold text-white">
                  {editingSlot ? "Edit Sleep Slot" : "Add Sleep Slot"}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Slot Label</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {["Core Night Sleep", "Morning Recovery", "Power Nap"].map((lbl) => (
                    <button
                      type="button"
                      key={lbl}
                      onClick={() => setLabel(lbl)}
                      className={`py-1.5 px-1 text-[11px] font-bold rounded-xl border text-center transition cursor-pointer ${
                        label === lbl
                          ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {lbl.split(" ")[0]}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Custom label (e.g. Polyphasic Slot 1)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Calculated duration preview */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Calculated Slot Duration:</span>
                <span className="text-emerald-400 font-extrabold">
                  {formatMinutesToHours(calculateSlotDurationMinutes(startTime, endTime))}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Sleep Quality</label>
                <div className="grid grid-cols-4 gap-2">
                  {["Deep", "Good", "Light", "Restless"].map((q) => (
                    <button
                      type="button"
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`py-1.5 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${
                        quality === q
                          ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : editingSlot ? "Save Changes" : "Record Sleep Period"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
