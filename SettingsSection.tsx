"use client";

import React, { useState } from "react";
import {
  Settings,
  Moon,
  Droplet,
  Dumbbell,
  GraduationCap,
  Music,
  Coffee,
  Bell,
  RotateCcw,
  User,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { UserProfile, UserSettingsData } from "@/types";

interface SettingsSectionProps {
  user: UserProfile | null;
  settings: UserSettingsData | null;
  onUpdateSettings: (newSettings: any) => Promise<void>;
  onResetData: () => Promise<void>;
}

export function SettingsSection({
  user,
  settings,
  onUpdateSettings,
  onResetData,
}: SettingsSectionProps) {
  const [userName, setUserName] = useState(user?.name || "Alex Rivera");
  const [userTitle, setUserTitle] = useState(user?.title || "Discipline Architect");
  const [sleepTargetHours, setSleepTargetHours] = useState(settings?.sleepTargetHours || "7.5");
  const [waterTargetMl, setWaterTargetMl] = useState(settings?.waterTargetMl || 4000);
  const [fitnessTargetMin, setFitnessTargetMin] = useState(settings?.fitnessTargetMin || 30);
  const [caffeineCutoffTime, setCaffeineCutoffTime] = useState(settings?.caffeineCutoffTime || "18:00");
  const [academicTargetMin, setAcademicTargetMin] = useState(settings?.academicTargetMin || 60);
  const [musicTargetMin, setMusicTargetMin] = useState(settings?.musicTargetMin || 30);
  const [unitSystem, setUnitSystem] = useState(settings?.unitSystem || "ml");
  const [enableReminders, setEnableReminders] = useState(settings?.enableReminders ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await onUpdateSettings({
        userName,
        userTitle,
        sleepTargetHours,
        waterTargetMl: Number(waterTargetMl),
        fitnessTargetMin: Number(fitnessTargetMin),
        caffeineCutoffTime,
        academicTargetMin: Number(academicTargetMin),
        musicTargetMin: Number(musicTargetMin),
        unitSystem,
        enableReminders,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setShowResetConfirm(false);
    await onResetData();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Configuration</div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Discipline OS Preferences</h1>
            <p className="text-xs text-slate-400">Customize targets, notification timings, units, and system thresholds</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Identity */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
            <User className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              User Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Display Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Discipline Title</label>
              <input
                type="text"
                value={userTitle}
                onChange={(e) => setUserTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Scoring Targets Customization */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Daily Quantitative Goals (Defaults from prompt)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sleep Target */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-indigo-400">
                <Moon className="w-4 h-4" />
                <span>Sleep Target (Hours)</span>
              </div>
              <input
                type="number"
                step="0.5"
                min="5"
                max="10"
                value={sleepTargetHours}
                onChange={(e) => setSleepTargetHours(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 7.5 hours</span>
            </div>

            {/* Water Target */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-cyan-400">
                <Droplet className="w-4 h-4" />
                <span>Water Target (ML)</span>
              </div>
              <input
                type="number"
                step="250"
                min="1000"
                max="8000"
                value={waterTargetMl}
                onChange={(e) => setWaterTargetMl(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 4,000 ml (4L)</span>
            </div>

            {/* Fitness Target */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-400">
                <Dumbbell className="w-4 h-4" />
                <span>Fitness Target (Minutes)</span>
              </div>
              <input
                type="number"
                step="5"
                min="10"
                max="120"
                value={fitnessTargetMin}
                onChange={(e) => setFitnessTargetMin(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 30 minutes</span>
            </div>

            {/* Caffeine Cutoff Time */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-400">
                <Coffee className="w-4 h-4" />
                <span>Caffeine Cutoff Time</span>
              </div>
              <input
                type="time"
                value={caffeineCutoffTime}
                onChange={(e) => setCaffeineCutoffTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 18:00 (6:00 PM)</span>
            </div>

            {/* Academic Target */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-violet-400">
                <GraduationCap className="w-4 h-4" />
                <span>Academic Target (Minutes)</span>
              </div>
              <input
                type="number"
                step="15"
                min="15"
                max="240"
                value={academicTargetMin}
                onChange={(e) => setAcademicTargetMin(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 60 minutes</span>
            </div>

            {/* Music Target */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-indigo-400">
                <Music className="w-4 h-4" />
                <span>Music Target (Minutes)</span>
              </div>
              <input
                type="number"
                step="10"
                min="10"
                max="120"
                value={musicTargetMin}
                onChange={(e) => setMusicTargetMin(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 30 minutes</span>
            </div>
          </div>
        </div>

        {/* Reminders & Preferences */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Smart Reminders & System Units
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">Enable Smart Discipline Reminders</div>
                <div className="text-[11px] text-slate-400">Caffeine cutoff, water milestones & evening reflection</div>
              </div>
              <input
                type="checkbox"
                checked={enableReminders}
                onChange={(e) => setEnableReminders(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">Hydration Volume Units</div>
                <div className="text-[11px] text-slate-400">Millilitres (ml) or Litres (L)</div>
              </div>
              <select
                value={unitSystem}
                onChange={(e) => setUnitSystem(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none"
              >
                <option value="ml">ML (e.g. 4000 ml)</option>
                <option value="litres">Litres (e.g. 4.0 L)</option>
              </select>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition active:scale-95 cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save All Preferences"}
            </button>
          </div>
        </div>
      </form>

      {/* Database Reset & Re-Seed Section */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>Reset & Re-Seed Demo Dataset</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Restores 30 days of realistic discipline tracking logs, badges, and tasks.
            </p>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl text-center">
            <RotateCcw className="w-10 h-10 text-rose-400 mx-auto mb-2" />
            <h3 className="text-base font-extrabold text-white">Reset Database?</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              This will re-seed the full 30-day sample discipline dataset and badges.
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
