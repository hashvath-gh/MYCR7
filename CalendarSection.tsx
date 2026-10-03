"use client";

import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  Droplet,
  Moon,
  Dumbbell,
  GraduationCap,
} from "lucide-react";

interface CalendarSectionProps {
  currentDate: string;
  onSelectDate: (date: string) => void;
}

export function CalendarSection({ currentDate, onSelectDate }: CalendarSectionProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthData, setMonthData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const monthStr = format(currentMonth, "yyyy-MM");

  useEffect(() => {
    async function fetchMonthData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/calendar?month=${monthStr}`);
        const json = await res.json();
        if (json.success && json.days) {
          setMonthData(json.days);
        }
      } catch (err) {
        console.error("Failed to load calendar month", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMonthData();
  }, [monthStr]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Historical Archive</div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Discipline Calendar Heatmap</h1>
            <p className="text-xs text-slate-400">Tap any date to inspect and edit its complete daily record</p>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={handlePrevMonth}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-black text-white px-3 min-w-[130px] text-center">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl glass-panel border border-slate-800 text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <span className="w-3 h-3 rounded-md bg-emerald-500" /> 85–100 (Elite)
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <span className="w-3 h-3 rounded-md bg-cyan-500" /> 70–84 (Good)
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <span className="w-3 h-3 rounded-md bg-amber-500" /> 50–69 (Average)
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <span className="w-3 h-3 rounded-md bg-rose-500" /> &lt;50 (Low)
          </span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Selected: <span className="text-white font-bold">{currentDate}</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        {/* Days of week headers */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-extrabold text-slate-400 uppercase tracking-wider">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7 gap-2">
          {allDays.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const isSelected = currentDate === dateStr;
            const inCurrentMonth = isSameMonth(day, currentMonth);
            const data = monthData[dateStr];
            const score = data ? Math.round(data.score) : null;

            let badgeBg = "bg-slate-900/60 border-slate-800 text-slate-400";
            let scoreColor = "text-slate-400";

            if (score !== null) {
              if (score >= 85) {
                badgeBg = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:border-emerald-500";
                scoreColor = "text-emerald-400";
              } else if (score >= 70) {
                badgeBg = "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:border-cyan-500";
                scoreColor = "text-cyan-400";
              } else if (score >= 50) {
                badgeBg = "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:border-amber-500";
                scoreColor = "text-amber-400";
              } else {
                badgeBg = "bg-rose-500/10 border-rose-500/30 text-rose-300 hover:border-rose-500";
                scoreColor = "text-rose-400";
              }
            }

            return (
              <button
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
                className={`min-h-[85px] p-2.5 rounded-2xl border text-left transition relative flex flex-col justify-between cursor-pointer ${badgeBg} ${
                  !inCurrentMonth ? "opacity-30" : "opacity-100"
                } ${isSelected ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 scale-102 z-10" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? "text-emerald-400 font-black" : "text-slate-300"}`}>
                    {format(day, "d")}
                  </span>
                  {data?.isPerfectDay && <span className="text-[11px]">💎</span>}
                </div>

                {score !== null ? (
                  <div className="my-1">
                    <div className={`text-sm sm:text-base font-black ${scoreColor}`}>
                      {score} <span className="text-[10px] text-slate-400 font-normal">/100</span>
                    </div>

                    {/* Miniature category dots */}
                    <div className="flex items-center gap-1 mt-1">
                      {data.sleepHours >= 7 && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" title="Sleep met" />}
                      {data.waterMl >= 3500 && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" title="Water met" />}
                      {data.fitnessMinutes >= 30 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Fitness met" />}
                      {data.noOil && <span className="w-1.5 h-1.5 rounded-full bg-teal-400" title="No oil met" />}
                    </div>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-600 italic">No log</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
