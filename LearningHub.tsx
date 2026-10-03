"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Music,
  Plus,
  Trash2,
  BookOpen,
  Sparkles,
  ExternalLink,
  Clock,
  Flame,
  Award,
  BarChart,
} from "lucide-react";
import { FullDayData, AcademicLogData, MusicLogData } from "@/types";

interface LearningHubProps {
  dayData: FullDayData;
  analyticsData?: any;
  onAddAcademicLog: (log: {
    date: string;
    subject: string;
    topic: string;
    completedWork: string;
    durationMinutes: number;
    difficulty: number;
    notes?: string;
    referenceUrl?: string;
  }) => Promise<void>;
  onDeleteAcademicLog: (id: number, date: string) => Promise<void>;
  onAddMusicLog: (log: {
    date: string;
    instrument: string;
    topic: string;
    durationMinutes: number;
    notes?: string;
    completed: boolean;
  }) => Promise<void>;
  onDeleteMusicLog: (id: number, date: string) => Promise<void>;
}

export function LearningHub({
  dayData,
  analyticsData,
  onAddAcademicLog,
  onDeleteAcademicLog,
  onAddMusicLog,
  onDeleteMusicLog,
}: LearningHubProps) {
  const { dayLog, breakdown, academics, music, targets } = dayData;

  // Academic modal
  const [showAcademicModal, setShowAcademicModal] = useState(false);
  const [academicSubject, setAcademicSubject] = useState("Mathematics");
  const [academicTopic, setAcademicTopic] = useState("Differential Equations");
  const [academicCompleted, setAcademicCompleted] = useState("Unit 3 – Problems 1–20");
  const [academicDuration, setAcademicDuration] = useState("60");
  const [academicDifficulty, setAcademicDifficulty] = useState(3);
  const [academicNotes, setAcademicNotes] = useState("");
  const [academicUrl, setAcademicUrl] = useState("");

  // Music modal
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [musicInstrument, setMusicInstrument] = useState("Piano");
  const [musicTopic, setMusicTopic] = useState("Scales & Arpeggios");
  const [musicDuration, setMusicDuration] = useState("30");
  const [musicNotes, setMusicNotes] = useState("");

  const handleAcademicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddAcademicLog({
      date: dayLog.date,
      subject: academicSubject,
      topic: academicTopic,
      completedWork: academicCompleted,
      durationMinutes: parseInt(academicDuration, 10) || 60,
      difficulty: academicDifficulty,
      notes: academicNotes,
      referenceUrl: academicUrl,
    });
    setShowAcademicModal(false);
    setAcademicNotes("");
    setAcademicUrl("");
  };

  const handleMusicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddMusicLog({
      date: dayLog.date,
      instrument: musicInstrument,
      topic: musicTopic,
      durationMinutes: parseInt(musicDuration, 10) || 30,
      notes: musicNotes,
      completed: true,
    });
    setShowMusicModal(false);
    setMusicNotes("");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-violet-400">Intellectual & Creative Mastery</div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Academics & Music Mastery</h1>
            <p className="text-xs text-slate-400">Academic Study (15 pts) + Music Instrument Practice (10 pts) = 25 pts total</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAcademicModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-500/25 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Study (15 pts)</span>
          </button>
          <button
            onClick={() => setShowMusicModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition active:scale-95 cursor-pointer"
          >
            <Music className="w-4 h-4" />
            <span>Log Music (10 pts)</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Academic Score</div>
          <div className="text-2xl font-black text-violet-400">
            {breakdown.academic} <span className="text-xs font-normal text-slate-500">/ 15 pts</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {dayLog.academicMinutes} / {targets.academicMin} min target
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Music Score</div>
          <div className="text-2xl font-black text-indigo-400">
            {breakdown.music} <span className="text-xs font-normal text-slate-500">/ 10 pts</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {dayLog.musicMinutes} / {targets.musicMin} min target
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Study Output</div>
          <div className="text-2xl font-black text-white">
            {Math.round((analyticsData?.summary?.totalAcademicMinutes || 1800) / 60)} <span className="text-xs font-normal text-slate-400">hours</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across 30 days
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Music Output</div>
          <div className="text-2xl font-black text-white">
            {Math.round((analyticsData?.summary?.totalMusicMinutes || 900) / 60)} <span className="text-xs font-normal text-slate-400">hours</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Instrument practice
          </div>
        </div>
      </div>

      {/* 📚 ACADEMIC STUDY LOG SECTION (15 PTS) */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Daily Academic Study Log ({academics.length})
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Subject, Topic, Completed work, and difficulty tracking
            </p>
          </div>
          <button
            onClick={() => setShowAcademicModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/20 text-xs font-bold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Study Log</span>
          </button>
        </div>

        {academics.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl">
            <GraduationCap className="w-8 h-8 text-violet-400/40 mx-auto mb-2" />
            <p className="font-semibold text-slate-300">No academic study sessions logged today.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Click "New Study Log" to record your study block.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {academics.map((log: AcademicLogData) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-violet-300 bg-violet-500/15 border border-violet-500/30 px-2.5 py-0.5 rounded-lg">
                      {log.subject}
                    </span>
                    <span className="text-sm font-extrabold text-white">{log.topic}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md">
                      ⏱️ {log.durationMinutes} min
                    </span>
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      Difficulty: {log.difficulty}/5
                    </span>
                    <button
                      onClick={() => onDeleteAcademicLog(log.id, dayLog.date)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition cursor-pointer"
                      title="Delete log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-300 mt-1">
                  <span className="text-slate-500 font-semibold">Completed:</span> {log.completedWork}
                </div>

                {log.notes && (
                  <div className="text-[11px] text-slate-400 mt-1.5 bg-slate-950/40 p-2 rounded-xl border border-slate-800/60">
                    {log.notes}
                  </div>
                )}

                {log.referenceUrl && (
                  <div className="mt-2">
                    <a
                      href={log.referenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-violet-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{log.referenceUrl}</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🎵 MUSIC LEARNING LOG SECTION (10 PTS) */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Daily Music Practice Log ({music.length})
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Instrument mastery, repertoire, scales, theory, and ear training
            </p>
          </div>
          <button
            onClick={() => setShowMusicModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-bold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Practice Session</span>
          </button>
        </div>

        {music.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl">
            <Music className="w-8 h-8 text-indigo-400/40 mx-auto mb-2" />
            <p className="font-semibold text-slate-300">No music practice sessions logged today.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Click "New Practice Session" to record your music practice.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {music.map((m: MusicLogData) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                      {m.instrument}
                    </span>
                    <span className="text-[11px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md">
                      {m.durationMinutes} min
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">{m.topic}</h4>
                  {m.notes && <p className="text-[11px] text-slate-400 mt-1">{m.notes}</p>}
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-emerald-400 font-bold">✓ 10 pts Earned</span>
                  <button
                    onClick={() => onDeleteMusicLog(m.id, dayLog.date)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition cursor-pointer"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Academic Log Modal */}
      {showAcademicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">Log Academic Study Session</h3>
              <button onClick={() => setShowAcademicModal(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                Cancel
              </button>
            </div>

            <form onSubmit={handleAcademicSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={academicSubject}
                    onChange={(e) => setAcademicSubject(e.target.value)}
                    required
                    placeholder="e.g. Mathematics"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    min="5"
                    max="360"
                    value={academicDuration}
                    onChange={(e) => setAcademicDuration(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Topic Studied</label>
                <input
                  type="text"
                  value={academicTopic}
                  onChange={(e) => setAcademicTopic(e.target.value)}
                  required
                  placeholder="e.g. Differential Equations - Unit 3"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">What I Completed</label>
                <input
                  type="text"
                  value={academicCompleted}
                  onChange={(e) => setAcademicCompleted(e.target.value)}
                  required
                  placeholder="e.g. Unit 3 – Problems 1–20 & Lecture Review"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Difficulty (1–5)</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setAcademicDifficulty(lvl)}
                      className={`py-1.5 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${
                        academicDifficulty === lvl
                          ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {lvl} {lvl === 5 ? "🔥" : ""}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Notes / Key Takeaways</label>
                <textarea
                  rows={2}
                  value={academicNotes}
                  onChange={(e) => setAcademicNotes(e.target.value)}
                  placeholder="Formulas, key concepts, or references..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Optional Reference / Attachment URL</label>
                <input
                  type="url"
                  value={academicUrl}
                  onChange={(e) => setAcademicUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs transition cursor-pointer"
              >
                Save Academic Study Log (+15 pts)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Music Log Modal */}
      {showMusicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">Log Music Practice Session</h3>
              <button onClick={() => setShowMusicModal(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                Cancel
              </button>
            </div>

            <form onSubmit={handleMusicSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Instrument / Focus</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {["Piano", "Guitar", "Violin", "Drums", "Vocals", "Theory"].map((inst) => (
                    <button
                      type="button"
                      key={inst}
                      onClick={() => setMusicInstrument(inst)}
                      className={`py-1.5 px-1 text-[11px] font-bold rounded-xl border text-center transition cursor-pointer ${
                        musicInstrument === inst
                          ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Topic / Piece Practiced</label>
                <input
                  type="text"
                  value={musicTopic}
                  onChange={(e) => setMusicTopic(e.target.value)}
                  required
                  placeholder="e.g. Chopin Nocturne or Minor Pentatonic scale"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={musicDuration}
                  onChange={(e) => setMusicDuration(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={musicNotes}
                  onChange={(e) => setMusicNotes(e.target.value)}
                  placeholder="Tempo, difficult measures, or breakthroughs..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition cursor-pointer"
              >
                Save Practice Session (+10 pts)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
