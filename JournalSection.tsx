"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Smile,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Heart,
  Lightbulb,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { FullDayData, JournalEntryData } from "@/types";

interface JournalSectionProps {
  dayData: FullDayData;
  onSaveJournal: (entry: {
    date: string;
    mood: string;
    energyLevel: number;
    thoughts: string;
    gratitude: string;
    learned: string;
    wentWell: string;
    couldImprove: string;
  }) => Promise<void>;
}

export function JournalSection({ dayData, onSaveJournal }: JournalSectionProps) {
  const { dayLog, breakdown, journal } = dayData;

  const [mood, setMood] = useState(journal?.mood || "happy");
  const [energyLevel, setEnergyLevel] = useState(journal?.energyLevel || 4);
  const [thoughts, setThoughts] = useState(journal?.thoughts || "");
  const [gratitude, setGratitude] = useState(journal?.gratitude || "");
  const [learned, setLearned] = useState(journal?.learned || "");
  const [wentWell, setWentWell] = useState(journal?.wentWell || "");
  const [couldImprove, setCouldImprove] = useState(journal?.couldImprove || "");
  const [isSaving, setIsSaving] = useState(false);
  const [pastEntries, setPastEntries] = useState<JournalEntryData[]>([]);

  // Keep in sync when dayData changes
  useEffect(() => {
    if (journal) {
      setMood(journal.mood || "happy");
      setEnergyLevel(journal.energyLevel || 4);
      setThoughts(journal.thoughts || "");
      setGratitude(journal.gratitude || "");
      setLearned(journal.learned || "");
      setWentWell(journal.wentWell || "");
      setCouldImprove(journal.couldImprove || "");
    } else {
      setMood("happy");
      setEnergyLevel(4);
      setThoughts("");
      setGratitude("");
      setLearned("");
      setWentWell("");
      setCouldImprove("");
    }
  }, [journal, dayLog.date]);

  // Fetch past journal timeline
  useEffect(() => {
    async function loadPastEntries() {
      try {
        const res = await fetch("/api/journal");
        const json = await res.json();
        if (json.success && json.entries) {
          setPastEntries(json.entries);
        }
      } catch (err) {
        console.error("Failed to load journal history", err);
      }
    }
    loadPastEntries();
  }, [dayLog.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveJournal({
        date: dayLog.date,
        mood,
        energyLevel,
        thoughts,
        gratitude,
        learned,
        wentWell,
        couldImprove,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const moods = [
    { key: "very_sad", label: "Struggling", emoji: "😞", color: "from-rose-500/20 to-red-500/20" },
    { key: "sad", label: "Low Energy", emoji: "😕", color: "from-amber-500/20 to-orange-500/20" },
    { key: "neutral", label: "Neutral / Calm", emoji: "😐", color: "from-slate-500/20 to-zinc-500/20" },
    { key: "happy", label: "Good / Focused", emoji: "🙂", color: "from-teal-500/20 to-emerald-500/20" },
    { key: "ecstatic", label: "Peak State / Great", emoji: "😄", color: "from-emerald-500/20 to-cyan-500/20" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Mindset & Self-Reflection</div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Daily Journal & Gratitude</h1>
            <p className="text-xs text-slate-400">Mood, gratitude, and 3 reflection prompts (5 points score)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-black border ${
            breakdown.journal > 0
              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
              : "bg-slate-900 text-slate-400 border-slate-800"
          }`}>
            {breakdown.journal > 0 ? "✓ 5/5 Pts Completed" : "0/5 Pts"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Selector & Energy Level */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-2">
            <Smile className="w-4 h-4" />
            <span>Today's Emotional & Energy State</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {moods.map((m) => (
              <button
                type="button"
                key={m.key}
                onClick={() => setMood(m.key)}
                className={`p-3 rounded-2xl border text-center transition active:scale-95 flex flex-col items-center justify-center cursor-pointer ${
                  mood === m.key
                    ? "bg-rose-500/20 border-rose-500/60 shadow-lg shadow-rose-500/10 scale-102"
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400"
                }`}
              >
                <span className="text-3xl mb-1">{m.emoji}</span>
                <span className="text-xs font-extrabold text-white">{m.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-300">Energy & Stamina Rating (1 to 5):</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setEnergyLevel(lvl)}
                  className={`w-9 h-9 rounded-xl font-black text-xs transition cursor-pointer ${
                    energyLevel === lvl
                      ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gratitude & Thoughts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gratitude */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>What am I grateful for today?</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">
              List 2–3 specific moments, people, health wins, or simple joys.
            </p>
            <textarea
              rows={4}
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="e.g. Grateful for clear morning focus, energizing run in the sun, supportive friends..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          {/* Thoughts Free-text */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Stream of Consciousness & Thoughts</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">
              Unpack your mental clutter, strategic thoughts, and breakthroughs.
            </p>
            <textarea
              rows={4}
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="e.g. Felt very locked in today. Handled deep study blocks before noon with zero distraction..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>
        </div>

        {/* 3 Reflection Prompts */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span>Daily 3-Question Reflection</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                1. What did I learn today?
              </label>
              <textarea
                rows={3}
                value={learned}
                onChange={(e) => setLearned(e.target.value)}
                placeholder="Key insight or concept discovered..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                2. What went exceptionally well?
              </label>
              <textarea
                rows={3}
                value={wentWell}
                onChange={(e) => setWentWell(e.target.value)}
                placeholder="Habits kept, challenges overcome..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                3. What could I improve tomorrow?
              </label>
              <textarea
                rows={3}
                value={couldImprove}
                onChange={(e) => setCouldImprove(e.target.value)}
                placeholder="Micro-adjustment to make tomorrow 1% better..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-500/25 transition active:scale-95 cursor-pointer"
            >
              {isSaving ? "Saving Entry..." : "Save Today's Journal (+5 pts)"}
            </button>
          </div>
        </div>
      </form>

      {/* Past Journal Entries Timeline */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Journal Timeline & History ({pastEntries.length})
            </h3>
          </div>
        </div>

        {pastEntries.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            No previous journal entries found.
          </div>
        ) : (
          <div className="space-y-3">
            {pastEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-md">
                      {entry.date}
                    </span>
                    <span className="text-sm font-extrabold text-white capitalize">
                      Mood: {entry.mood}
                    </span>
                  </div>
                  {entry.energyLevel && (
                    <span className="text-[11px] font-bold text-slate-400">
                      ⚡ Energy {entry.energyLevel}/5
                    </span>
                  )}
                </div>

                {entry.thoughts && (
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{entry.thoughts}</p>
                )}

                {entry.gratitude && (
                  <div className="text-[11px] text-slate-400 mt-2">
                    <span className="text-rose-400 font-bold">Gratitude:</span> {entry.gratitude}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
