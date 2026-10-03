"use client";

import React, { useState } from "react";
import {
  X,
  Droplet,
  Moon,
  Dumbbell,
  CheckCircle2,
  Coffee,
  Salad,
  GraduationCap,
  Music,
  Smile,
  Sparkles,
  Plus
} from "lucide-react";

interface FastLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: string;
  onAddWater: (amountMl: number) => Promise<void>;
  onToggleHabit: (habitKey: "noOil" | "noCaffeine", completed: boolean) => Promise<void>;
  onToggleMeal: (mealType: "breakfast" | "lunch" | "dinner", completed: boolean) => Promise<void>;
  onAddQuickFitness: (workoutType: string, minutes: number) => Promise<void>;
  onAddQuickStudy: (subject: string, topic: string, minutes: number) => Promise<void>;
  onAddQuickMusic: (instrument: string, topic: string, minutes: number) => Promise<void>;
  noOilCompleted: boolean;
  noCaffeineCompleted: boolean;
  breakfastCompleted: boolean;
  lunchCompleted: boolean;
  dinnerCompleted: boolean;
}

export function FastLogModal({
  isOpen,
  onClose,
  currentDate,
  onAddWater,
  onToggleHabit,
  onToggleMeal,
  onAddQuickFitness,
  onAddQuickStudy,
  onAddQuickMusic,
  noOilCompleted,
  noCaffeineCompleted,
  breakfastCompleted,
  lunchCompleted,
  dinnerCompleted,
}: FastLogModalProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAction = async (name: string, fn: () => Promise<void>) => {
    try {
      setLoadingAction(name);
      await fn();
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-5 sm:p-6 border border-slate-700 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Instant 1-Tap Fast Logger</h3>
              <p className="text-xs text-slate-400">Target Date: {currentDate}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close fast log modal"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* 💧 Water Quick-Add */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-cyan-400">
              <Droplet className="w-4 h-4" />
              <span>Quick Hydration (+ml)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[250, 500, 750, 1000].map((ml) => (
                <button
                  key={ml}
                  onClick={() => handleAction(`water_${ml}`, () => onAddWater(ml))}
                  disabled={loadingAction !== null}
                  className="py-2 px-1 text-xs font-bold rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 transition active:scale-95 text-center cursor-pointer"
                >
                  +{ml} ml
                </button>
              ))}
            </div>
          </div>

          {/* 🥗 & ☕ Habits Quick-Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleAction("noOil", () => onToggleHabit("noOil", !noOilCompleted))}
              className={`p-3 rounded-2xl border text-left transition active:scale-95 cursor-pointer flex flex-col justify-between ${
                noOilCompleted
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Salad className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">
                  +5 pts
                </span>
              </div>
              <div className="text-xs font-bold text-white">No Added Oil</div>
              <div className="text-[10px] opacity-80">{noOilCompleted ? "✓ Completed" : "Tap to complete"}</div>
            </button>

            <button
              onClick={() => handleAction("noCaffeine", () => onToggleHabit("noCaffeine", !noCaffeineCompleted))}
              className={`p-3 rounded-2xl border text-left transition active:scale-95 cursor-pointer flex flex-col justify-between ${
                noCaffeineCompleted
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Coffee className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-bold bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">
                  +5 pts
                </span>
              </div>
              <div className="text-xs font-bold text-white">No Caffeine &gt; 6 PM</div>
              <div className="text-[10px] opacity-80">{noCaffeineCompleted ? "✓ Completed" : "Tap to complete"}</div>
            </button>
          </div>

          {/* 🍽️ Meals Quick-Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-300">
              <span>Track 3 Daily Meals</span>
              <span className="text-[10px] text-emerald-400">10 pts total</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAction("breakfast", () => onToggleMeal("breakfast", !breakfastCompleted))}
                className={`py-2 px-1 text-xs font-bold rounded-xl border transition text-center cursor-pointer ${
                  breakfastCompleted
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white"
                }`}
              >
                Breakfast {breakfastCompleted ? "✓" : "(3.5)"}
              </button>
              <button
                onClick={() => handleAction("lunch", () => onToggleMeal("lunch", !lunchCompleted))}
                className={`py-2 px-1 text-xs font-bold rounded-xl border transition text-center cursor-pointer ${
                  lunchCompleted
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white"
                }`}
              >
                Lunch {lunchCompleted ? "✓" : "(3.5)"}
              </button>
              <button
                onClick={() => handleAction("dinner", () => onToggleMeal("dinner", !dinnerCompleted))}
                className={`py-2 px-1 text-xs font-bold rounded-xl border transition text-center cursor-pointer ${
                  dinnerCompleted
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white"
                }`}
              >
                Dinner {dinnerCompleted ? "✓" : "(3.0)"}
              </button>
            </div>
          </div>

          {/* 🏋️ Fitness Quick-Add */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2 text-xs font-bold text-amber-400">
              <div className="flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4" />
                <span>Log 30m Workout (+10 pts)</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["Gym Session", "Endurance Run", "Home Calisthenics"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleAction(type, () => onAddQuickFitness(type, 30))}
                  className="py-2 px-1 text-[11px] font-bold rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition active:scale-95 text-center cursor-pointer truncate"
                >
                  +30m {type.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* 📚 & 🎵 Study & Music Quick-Add */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleAction("study_quick", () => onAddQuickStudy("Mathematics", "Problem set & core review", 60))}
              className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/40 hover:bg-violet-500/10 text-left transition active:scale-95 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <GraduationCap className="w-4 h-4 text-violet-400" />
                <span className="text-[10px] font-bold text-violet-300">+15 pts</span>
              </div>
              <div className="text-xs font-bold text-white">+60m Study Block</div>
              <div className="text-[10px] text-slate-400">Log Academic Session</div>
            </button>

            <button
              onClick={() => handleAction("music_quick", () => onAddQuickMusic("Piano", "Scales & Repertoire", 30))}
              className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 hover:bg-indigo-500/10 text-left transition active:scale-95 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <Music className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-bold text-indigo-300">+10 pts</span>
              </div>
              <div className="text-xs font-bold text-white">+30m Music Practice</div>
              <div className="text-[10px] text-slate-400">Instrument Session</div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition cursor-pointer"
          >
            Done Logging
          </button>
        </div>
      </div>
    </div>
  );
}
