"use client";

import React, { useState, useEffect } from "react";
import {
  Dumbbell,
  Play,
  Square,
  RotateCcw,
  Plus,
  Trash2,
  Utensils,
  Salad,
  Coffee,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  Award,
  Edit2,
} from "lucide-react";
import { FullDayData, FitnessLogData, MealLogData } from "@/types";

interface FitnessAndFoodProps {
  dayData: FullDayData;
  analyticsData?: any;
  onAddFitness: (workout: {
    date: string;
    workoutType: string;
    durationMinutes: number;
    notes?: string;
    intensity?: string;
    caloriesBurned?: number;
  }) => Promise<void>;
  onDeleteFitness: (id: number, date: string) => Promise<void>;
  onUpdateMeal: (meal: {
    date: string;
    mealType: "breakfast" | "lunch" | "dinner";
    completed: boolean;
    foodItems?: string;
    notes?: string;
  }) => Promise<void>;
  onToggleHabit: (habitKey: "noOil" | "noCaffeine", completed: boolean) => Promise<void>;
}

export function FitnessAndFood({
  dayData,
  analyticsData,
  onAddFitness,
  onDeleteFitness,
  onUpdateMeal,
  onToggleHabit,
}: FitnessAndFoodProps) {
  const { dayLog, breakdown, fitness, meals, targets } = dayData;

  // Stopwatch timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Manual workout modal & state
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [workoutType, setWorkoutType] = useState("Gym");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [intensity, setIntensity] = useState("High");
  const [notes, setNotes] = useState("");

  // Meal modal state
  const [editingMeal, setEditingMeal] = useState<MealLogData | null>(null);
  const [mealFoodItems, setMealFoodItems] = useState("");
  const [mealNotes, setMealNotes] = useState("");

  // Stopwatch interval
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStopAndSaveTimer = async () => {
    setTimerRunning(false);
    const mins = Math.max(1, Math.round(timerSeconds / 60));
    await onAddFitness({
      date: dayLog.date,
      workoutType: "Live Workout Session",
      durationMinutes: mins,
      intensity: "High",
      notes: `Recorded via live stopwatch (${mins} mins)`,
    });
    setTimerSeconds(0);
  };

  const handleManualWorkoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(durationMinutes, 10) || 30;
    await onAddFitness({
      date: dayLog.date,
      workoutType,
      durationMinutes: mins,
      intensity,
      notes,
    });
    setShowAddWorkout(false);
    setNotes("");
  };

  const handleSaveMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeal) return;
    await onUpdateMeal({
      date: dayLog.date,
      mealType: editingMeal.mealType,
      completed: true,
      foodItems: mealFoodItems,
      notes: mealNotes,
    });
    setEditingMeal(null);
  };

  const breakfast = meals.find((m) => m.mealType === "breakfast");
  const lunch = meals.find((m) => m.mealType === "lunch");
  const dinner = meals.find((m) => m.mealType === "dinner");

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Physical Conditioning & Nutrition</div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Fitness & Clean Nutrition</h1>
            <p className="text-xs text-slate-400">Workout (10 pts) + 3 Meals (10 pts) + Zero Oil (5 pts) + Caffeine Cutoff (5 pts)</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddWorkout(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Log Workout</span>
        </button>
      </div>

      {/* Fitness Live Stopwatch & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stopwatch & Live Logger */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                Stopwatch Workout Timer
              </span>
              <span className="text-xs font-bold text-slate-400">Goal: 30 min (10 pts)</span>
            </div>

            <div className="text-center py-6">
              <div className="text-5xl sm:text-6xl font-black text-white tracking-widest font-mono">
                {formatTimer(timerSeconds)}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {timerRunning ? "Timer active... stay in the zone!" : "Ready for your training session"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
            {!timerRunning ? (
              <button
                onClick={() => setTimerRunning(true)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Start Workout</span>
              </button>
            ) : (
              <button
                onClick={handleStopAndSaveTimer}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Complete & Save ({Math.max(1, Math.round(timerSeconds / 60))}m)</span>
              </button>
            )}

            {timerSeconds > 0 && !timerRunning && (
              <button
                onClick={() => setTimerSeconds(0)}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Fitness Stats & Today's Workouts List */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Today's Workout Sessions ({fitness.length})
                </h3>
              </div>
              <div className="text-xs font-extrabold text-amber-400">
                {dayLog.fitnessMinutes} / {targets.fitnessMin} min ({breakdown.fitness}/10 pts)
              </div>
            </div>

            {fitness.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No workouts recorded today. Use the timer or click "Log Workout".
              </div>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {fitness.map((w: FitnessLogData) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">{w.workoutType}</span>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                          {w.durationMinutes} min
                        </span>
                        {w.caloriesBurned && (
                          <span className="text-[10px] text-slate-400">~{w.caloriesBurned} kcal</span>
                        )}
                      </div>
                      {w.notes && <p className="text-[11px] text-slate-400 mt-1">{w.notes}</p>}
                    </div>
                    <button
                      onClick={() => onDeleteFitness(w.id, dayLog.date)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition cursor-pointer"
                      title="Delete workout"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Weekly Training</div>
              <div className="text-sm font-black text-amber-400">{analyticsData?.summary?.totalWorkoutMinutes || 210} min</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Training Streak</div>
              <div className="text-sm font-black text-emerald-400">14 Days</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Score Earned</div>
              <div className="text-sm font-black text-white">{breakdown.fitness} / 10 pts</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Meals System (10 Points) */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              3 Daily Meals (Breakfast 3.5 + Lunch 3.5 + Dinner 3.0 = 10 Pts)
            </h3>
          </div>
          <span className="text-xs font-extrabold text-emerald-400">{breakdown.food} / 10 pts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Breakfast */}
          <div
            className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
              breakfast?.completed
                ? "bg-slate-900/90 border-emerald-500/40"
                : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-white">Breakfast (3.5 pts)</span>
                <button
                  onClick={() =>
                    onUpdateMeal({
                      date: dayLog.date,
                      mealType: "breakfast",
                      completed: !breakfast?.completed,
                    })
                  }
                  className={`text-xs font-bold px-2.5 py-1 rounded-xl transition cursor-pointer ${
                    breakfast?.completed
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {breakfast?.completed ? "✓ Done" : "Mark Done"}
                </button>
              </div>

              <div className="text-xs text-slate-300 mt-2 min-h-[36px]">
                {breakfast?.foodItems || <span className="text-slate-500 italic">No food items added yet</span>}
              </div>
              {breakfast?.notes && <div className="text-[11px] text-slate-400 mt-1">{breakfast.notes}</div>}
            </div>

            <button
              onClick={() => {
                setEditingMeal(breakfast || { id: 0, userId: 1, date: dayLog.date, mealType: "breakfast", completed: false, foodItems: "", notes: "", healthRating: 5 });
                setMealFoodItems(breakfast?.foodItems || "");
                setMealNotes(breakfast?.notes || "");
              }}
              className="mt-3 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit Details</span>
            </button>
          </div>

          {/* Lunch */}
          <div
            className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
              lunch?.completed
                ? "bg-slate-900/90 border-emerald-500/40"
                : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-white">Lunch (3.5 pts)</span>
                <button
                  onClick={() =>
                    onUpdateMeal({
                      date: dayLog.date,
                      mealType: "lunch",
                      completed: !lunch?.completed,
                    })
                  }
                  className={`text-xs font-bold px-2.5 py-1 rounded-xl transition cursor-pointer ${
                    lunch?.completed
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {lunch?.completed ? "✓ Done" : "Mark Done"}
                </button>
              </div>

              <div className="text-xs text-slate-300 mt-2 min-h-[36px]">
                {lunch?.foodItems || <span className="text-slate-500 italic">No food items added yet</span>}
              </div>
              {lunch?.notes && <div className="text-[11px] text-slate-400 mt-1">{lunch.notes}</div>}
            </div>

            <button
              onClick={() => {
                setEditingMeal(lunch || { id: 0, userId: 1, date: dayLog.date, mealType: "lunch", completed: false, foodItems: "", notes: "", healthRating: 5 });
                setMealFoodItems(lunch?.foodItems || "");
                setMealNotes(lunch?.notes || "");
              }}
              className="mt-3 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit Details</span>
            </button>
          </div>

          {/* Dinner */}
          <div
            className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
              dinner?.completed
                ? "bg-slate-900/90 border-emerald-500/40"
                : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-white">Dinner (3.0 pts)</span>
                <button
                  onClick={() =>
                    onUpdateMeal({
                      date: dayLog.date,
                      mealType: "dinner",
                      completed: !dinner?.completed,
                    })
                  }
                  className={`text-xs font-bold px-2.5 py-1 rounded-xl transition cursor-pointer ${
                    dinner?.completed
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {dinner?.completed ? "✓ Done" : "Mark Done"}
                </button>
              </div>

              <div className="text-xs text-slate-300 mt-2 min-h-[36px]">
                {dinner?.foodItems || <span className="text-slate-500 italic">No food items added yet</span>}
              </div>
              {dinner?.notes && <div className="text-[11px] text-slate-400 mt-1">{dinner.notes}</div>}
            </div>

            <button
              onClick={() => {
                setEditingMeal(dinner || { id: 0, userId: 1, date: dayLog.date, mealType: "dinner", completed: false, foodItems: "", notes: "", healthRating: 5 });
                setMealFoodItems(dinner?.foodItems || "");
                setMealNotes(dinner?.notes || "");
              }}
              className="mt-3 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Habits: No Oil & No Caffeine After 6 PM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* No Oil */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Salad className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">🥗 No Added Oil Habit</h3>
                <span className="text-[10px] font-bold text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-md">
                  5 pts
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Zero fried or greasy added oil foods for clean metabolic health.
              </p>
              <div className="text-[11px] text-slate-500 mt-2">
                Status: <span className={dayLog.noOilCompleted ? "text-emerald-400 font-bold" : "text-slate-400"}>{dayLog.noOilCompleted ? "Clean Eating Maintained ✓" : "Not yet checked"}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onToggleHabit("noOil", !dayLog.noOilCompleted)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              dayLog.noOilCompleted
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            {dayLog.noOilCompleted ? "✓ 5/5 pts" : "Complete (5 pts)"}
          </button>
        </div>

        {/* No Caffeine */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">☕ No Caffeine &gt; 6 PM</h3>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md">
                  5 pts
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cutoff target: <span className="font-bold text-amber-300">{targets.caffeineCutoffTime || "18:00"}</span>. Eliminates adenosine receptor blocking.
              </p>
              <div className="text-[11px] text-slate-500 mt-2">
                Status: <span className={dayLog.noCaffeineCompleted ? "text-amber-400 font-bold" : "text-slate-400"}>{dayLog.noCaffeineCompleted ? "Zero Caffeine Evening ✓" : "Not yet checked"}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onToggleHabit("noCaffeine", !dayLog.noCaffeineCompleted)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              dayLog.noCaffeineCompleted
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            {dayLog.noCaffeineCompleted ? "✓ 5/5 pts" : "Complete (5 pts)"}
          </button>
        </div>
      </div>

      {/* Manual Workout Logger Modal */}
      {showAddWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">Log Workout Session</h3>
              <button onClick={() => setShowAddWorkout(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                Cancel
              </button>
            </div>

            <form onSubmit={handleManualWorkoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Workout Type</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {["Gym", "Running", "Walking", "Cycling", "Home workout", "Sports"].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setWorkoutType(t)}
                      className={`py-1.5 px-1 text-[11px] font-bold rounded-xl border text-center transition cursor-pointer ${
                        workoutType === t
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Workout Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Sets, reps, distance, or target muscle group..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs transition cursor-pointer"
              >
                Save Workout (+10 pts)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Meal Modal */}
      {editingMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white capitalize">
                Edit {editingMeal.mealType} Details
              </h3>
              <button onClick={() => setEditingMeal(null)} className="text-slate-400 hover:text-white text-xs font-bold">
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveMeal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">What did you eat?</label>
                <input
                  type="text"
                  value={mealFoodItems}
                  onChange={(e) => setMealFoodItems(e.target.value)}
                  placeholder="e.g. Oatmeal with chia seeds & protein shake"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Notes (Nutrition, oils, recipe)</label>
                <textarea
                  rows={2}
                  value={mealNotes}
                  onChange={(e) => setMealNotes(e.target.value)}
                  placeholder="e.g. Zero added oil, seasoned with fresh lemon & herbs"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition cursor-pointer"
              >
                Save Meal Log
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
