"use client";

import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Navbar } from "@/components/Navbar";
import { Sidebar, TabType } from "@/components/Sidebar";
import { FastLogModal } from "@/components/FastLogModal";
import { AuthModal } from "@/components/AuthModal";
import { InstallPrompt } from "@/components/InstallPrompt";
import { HomeDashboard } from "@/components/tabs/HomeDashboard";
import { SleepTracker } from "@/components/tabs/SleepTracker";
import { HydrationHub } from "@/components/tabs/HydrationHub";
import { FitnessAndFood } from "@/components/tabs/FitnessAndFood";
import { LearningHub } from "@/components/tabs/LearningHub";
import { JournalSection } from "@/components/tabs/JournalSection";
import { AnalyticsSection } from "@/components/tabs/AnalyticsSection";
import { CalendarSection } from "@/components/tabs/CalendarSection";
import { TasksHub } from "@/components/tabs/TasksHub";
import { ChallengesSection } from "@/components/tabs/ChallengesSection";
import { SettingsSection } from "@/components/tabs/SettingsSection";
import { FullDayData, UserProfile, UserSettingsData, TaskData } from "@/types";
import { Loader2 } from "lucide-react";

export default function LifeManagerApp() {
  const [currentDate, setCurrentDate] = useState<string>(() => format(new Date(), "yyyy-MM-dd"));
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettingsData | null>(null);
  const [dayData, setDayData] = useState<FullDayData | null>(null);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [challengesData, setChallengesData] = useState<any>(null);
  const [analyticsRange, setAnalyticsRange] = useState("30d");
  const [showFastLogModal, setShowFastLogModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize app
  const initApp = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/init");
      const json = await res.json();
      if (json.success) {
        setUser(json.user);
        setSettings(json.settings);
        setDayData(json.todayData);
        if (json.todayStr) {
          setCurrentDate(json.todayStr);
        }
      }
    } catch (err) {
      console.error("Init failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch full day data
  const loadDayData = useCallback(async (date: string) => {
    try {
      const res = await fetch(`/api/day?date=${date}`);
      const json = await res.json();
      if (json.success) {
        setDayData(json);
        if (json.user) setUser(json.user);
      }
    } catch (err) {
      console.error("Load day data failed", err);
    }
  }, []);

  // Fetch tasks
  const loadTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      const json = await res.json();
      if (json.success) {
        setTasks(json.tasks);
      }
    } catch (err) {
      console.error("Load tasks failed", err);
    }
  }, []);

  // Fetch analytics
  const loadAnalytics = useCallback(async (range = "30d", from?: string, to?: string) => {
    try {
      let url = `/api/analytics?range=${range}`;
      if (from && to) url += `&from=${from}&to=${to}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setAnalyticsData(json);
      }
    } catch (err) {
      console.error("Load analytics failed", err);
    }
  }, []);

  // Fetch challenges
  const loadChallenges = useCallback(async () => {
    try {
      const res = await fetch("/api/challenges");
      const json = await res.json();
      if (json.success) {
        setChallengesData(json);
        if (json.user) setUser(json.user);
      }
    } catch (err) {
      console.error("Load challenges failed", err);
    }
  }, []);

  useEffect(() => {
    initApp();
  }, [initApp]);

  useEffect(() => {
    if (currentDate) {
      loadDayData(currentDate);
    }
  }, [currentDate, loadDayData]);

  useEffect(() => {
    loadTasks();
    loadAnalytics(analyticsRange);
    loadChallenges();
  }, [loadTasks, loadAnalytics, loadChallenges, analyticsRange]);

  // Actions
  const handleDateChange = (newDate: string) => {
    setCurrentDate(newDate);
  };

  // Option A Quick Login
  const handleQuickLoginOptionA = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option: "option_a" }),
      });
      const json = await res.json();
      if (json.success && json.user) {
        setUser(json.user);
        if (json.settings) setSettings(json.settings);
        await loadDayData(currentDate);
        await loadTasks();
        await loadAnalytics(analyticsRange);
        await loadChallenges();
      }
    } catch (err) {
      console.error("Option A login failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (newUser: UserProfile) => {
    setUser(newUser);
    await loadDayData(currentDate);
    await loadTasks();
    await loadAnalytics(analyticsRange);
    await loadChallenges();
  };

  const handleAddWater = async (amountMl: number) => {
    try {
      const res = await fetch("/api/water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: currentDate, amountMl }),
      });
      const json = await res.json();
      if (json.success) {
        setDayData(json);
        loadAnalytics(analyticsRange);
        loadChallenges();
      }
    } catch (err) {
      console.error("Add water failed", err);
    }
  };

  const handleDeleteWater = async (id?: number, date?: string) => {
    try {
      const url = id ? `/api/water?id=${id}&date=${date}` : `/api/water?date=${date}`;
      const res = await fetch(url, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setDayData(json);
        loadAnalytics(analyticsRange);
      }
    } catch (err) {
      console.error("Delete water failed", err);
    }
  };

  const handleToggleHabit = async (habitKey: "noOil" | "noCaffeine", completed: boolean) => {
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: currentDate, habitKey, completed }),
      });
      const json = await res.json();
      if (json.success) {
        setDayData(json);
        loadAnalytics(analyticsRange);
        loadChallenges();
      }
    } catch (err) {
      console.error("Toggle habit failed", err);
    }
  };

  const handleUpdateMeal = async (meal: {
    date: string;
    mealType: "breakfast" | "lunch" | "dinner";
    completed: boolean;
    foodItems?: string;
    notes?: string;
  }) => {
    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meal),
      });
      const json = await res.json();
      if (json.success) {
        setDayData(json);
        loadAnalytics(analyticsRange);
      }
    } catch (err) {
      console.error("Update meal failed", err);
    }
  };

  const handleAddFitness = async (workout: {
    date: string;
    workoutType: string;
    durationMinutes: number;
    notes?: string;
    intensity?: string;
    caloriesBurned?: number;
  }) => {
    try {
      const res = await fetch("/api/fitness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workout),
      });
      const json = await res.json();
      if (json.success) {
        setDayData(json);
        loadAnalytics(analyticsRange);
        loadChallenges();
      }
    } catch (err) {
      console.error("Add fitness failed", err);
    }
  };

  const handleDeleteFitness = async (id: number, date: string) => {
    try {
      const res = await fetch(`/api/fitness?id=${id}&date=${date}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setDayData(json);
        loadAnalytics(analyticsRange);
      }
    } catch (err) {
      console.error("Delete fitness failed", err);
    }
  };

  const handleAddSleepSlot = async (slot: {
    date: string;
    startTime: string;
    endTime: string;
    label: string;
    quality: string;
  }) => {
    try {
      const res = await fetch("/api/sleep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slot),
      });
      const json = await res.json();
      if (json.success) {
        setDayData(json);
        loadAnalytics(analyticsRange);
        loadChallenges();
      }
    } catch (err) {
      console.error("Add sleep slot failed", err);
    }
  };

  const handleEditSleepSlot = async (slot: {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    label: string;
    quality: string;
  }) => {
    try {
      const res = await fetch("/api/sleep", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slot),
      });
      const json = await res.json();
      if (json.success) {
        setDayData(json);
        loadAnalytics(analyticsRange);
      }
    } catch (err) {
      console.error("Edit sleep slot failed", err);
    }
  };

  const handleDeleteSleepSlot = async (id: number, date: string) => {
    try {
      const res = await fetch(`/api/sleep?id=${id}&date=${date}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setDayData(json);
        loadAnalytics(analyticsRange);
      }
    } catch (err) {
      console.error("Delete sleep slot failed", err);
    }
  };

  const handleAddAcademicLog = async (log: {
    date: string;
    subject: string;
    topic: string;
    completedWork: string;
    durationMinutes: number;
    difficulty: number;
    notes?: string;
    referenceUrl?: string;
  }) => {
    try {
      const res = await fetch("/api/academics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log),
      });
      const json = await res.json();
      if (json.success) {
        setDayData(json);
        loadAnalytics(analyticsRange);
        loadChallenges();
      }
    } catch (err) {
      console.error("Add academic log failed", err);
    }
  };

  const handleDeleteAcademicLog = async (id: number, date: string) => {
    try {
      const res = await fetch(`/api/academics?id=${id}&date=${date}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setDayData(json);
        loadAnalytics(analyticsRange);
      }
    } catch (err) {
      console.error("Delete academic log failed", err);
    }
  };

  const handleAddMusicLog = async (log: {
    date: string;
    instrument: string;
    topic: string;
    durationMinutes: number;
    notes?: string;
    completed: boolean;
  }) => {
    try {
      const res = await fetch("/api/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log),
      });
      const json = await res.json();
      if (json.success) {
        setDayData(json);
        loadAnalytics(analyticsRange);
        loadChallenges();
      }
    } catch (err) {
      console.error("Add music log failed", err);
    }
  };

  const handleDeleteMusicLog = async (id: number, date: string) => {
    try {
      const res = await fetch(`/api/music?id=${id}&date=${date}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setDayData(json);
        loadAnalytics(analyticsRange);
      }
    } catch (err) {
      console.error("Delete music log failed", err);
    }
  };

  const handleSaveJournal = async (entry: {
    date: string;
    mood: string;
    energyLevel: number;
    thoughts: string;
    gratitude: string;
    learned: string;
    wentWell: string;
    couldImprove: string;
  }) => {
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      const json = await res.json();
      if (json.success) {
        setDayData(json);
        loadAnalytics(analyticsRange);
        loadChallenges();
      }
    } catch (err) {
      console.error("Save journal failed", err);
    }
  };

  const handleAddTask = async (task: any) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      const json = await res.json();
      if (json.success) {
        loadTasks();
      }
    } catch (err) {
      console.error("Add task failed", err);
    }
  };

  const handleUpdateTask = async (task: any) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      const json = await res.json();
      if (json.success) {
        loadTasks();
      }
    } catch (err) {
      console.error("Update task failed", err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        loadTasks();
      }
    } catch (err) {
      console.error("Delete task failed", err);
    }
  };

  const handleUpdateSettings = async (newSettings: any) => {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      const json = await res.json();
      if (json.success) {
        setSettings(json.settings);
        loadDayData(currentDate);
      }
    } catch (err) {
      console.error("Update settings failed", err);
    }
  };

  const handleResetData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reset", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        await initApp();
        loadTasks();
        loadAnalytics("30d");
        loadChallenges();
      }
    } catch (err) {
      console.error("Reset data failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dayData) {
    return (
      <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-3" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Life Manager OS...</p>
      </div>
    );
  }

  const score = dayData ? Number(dayData.dayLog.score) : 0;
  const breakdown = dayData?.breakdown || {
    sleep: 0,
    noOil: 0,
    noCaffeine: 0,
    food: 0,
    fitness: 0,
    water: 0,
    music: 0,
    academic: 0,
    journal: 0,
    total: 0,
    isPerfectDay: false,
  };

  const meals = dayData?.meals || [];
  const breakfast = meals.find((m) => m.mealType === "breakfast");
  const lunch = meals.find((m) => m.mealType === "lunch");
  const dinner = meals.find((m) => m.mealType === "dinner");

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      {/* Top sticky navigation bar */}
      <Navbar
        currentDate={currentDate}
        onDateChange={handleDateChange}
        user={user}
        score={score}
        breakdown={breakdown}
        onOpenFastLog={() => setShowFastLogModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onQuickLoginOptionA={handleQuickLoginOptionA}
        caffeineCutoffTime={settings?.caffeineCutoffTime || "18:00"}
        waterMl={dayData?.dayLog.waterMl || 0}
        waterTargetMl={settings?.waterTargetMl || 4000}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          user={user}
          score={score}
          onOpenAuth={() => setShowAuthModal(true)}
          onQuickLoginOptionA={handleQuickLoginOptionA}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pb-24 lg:pb-8">
          {activeTab === "dashboard" && dayData && (
            <HomeDashboard
              dayData={dayData}
              user={user}
              tasks={tasks}
              onNavigateTab={setActiveTab}
              onAddWater={handleAddWater}
              onToggleHabit={handleToggleHabit}
              onToggleMeal={(mealType, completed) =>
                handleUpdateMeal({ date: currentDate, mealType, completed })
              }
              onOpenFastLog={() => setShowFastLogModal(true)}
            />
          )}

          {activeTab === "sleep" && dayData && (
            <SleepTracker
              dayData={dayData}
              analyticsData={analyticsData}
              onAddSleepSlot={handleAddSleepSlot}
              onEditSleepSlot={handleEditSleepSlot}
              onDeleteSleepSlot={handleDeleteSleepSlot}
            />
          )}

          {activeTab === "hydration" && dayData && (
            <HydrationHub
              dayData={dayData}
              analyticsData={analyticsData}
              onAddWater={handleAddWater}
              onDeleteWater={handleDeleteWater}
            />
          )}

          {activeTab === "fitness-food" && dayData && (
            <FitnessAndFood
              dayData={dayData}
              analyticsData={analyticsData}
              onAddFitness={handleAddFitness}
              onDeleteFitness={handleDeleteFitness}
              onUpdateMeal={handleUpdateMeal}
              onToggleHabit={handleToggleHabit}
            />
          )}

          {activeTab === "learning" && dayData && (
            <LearningHub
              dayData={dayData}
              analyticsData={analyticsData}
              onAddAcademicLog={handleAddAcademicLog}
              onDeleteAcademicLog={handleDeleteAcademicLog}
              onAddMusicLog={handleAddMusicLog}
              onDeleteMusicLog={handleDeleteMusicLog}
            />
          )}

          {activeTab === "journal" && dayData && (
            <JournalSection
              dayData={dayData}
              onSaveJournal={handleSaveJournal}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsSection
              analyticsData={analyticsData}
              currentRange={analyticsRange}
              onRangeChange={(range, from, to) => {
                setAnalyticsRange(range);
                loadAnalytics(range, from, to);
              }}
            />
          )}

          {activeTab === "calendar" && (
            <CalendarSection
              currentDate={currentDate}
              onSelectDate={(date) => {
                handleDateChange(date);
                setActiveTab("dashboard");
              }}
            />
          )}

          {activeTab === "tasks" && (
            <TasksHub
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === "challenges" && (
            <ChallengesSection
              challengesData={challengesData}
              onRefresh={loadChallenges}
            />
          )}

          {activeTab === "settings" && (
            <SettingsSection
              user={user}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* 1-Tap Fast Logger Modal */}
      {dayData && (
        <FastLogModal
          isOpen={showFastLogModal}
          onClose={() => setShowFastLogModal(false)}
          currentDate={currentDate}
          onAddWater={handleAddWater}
          onToggleHabit={handleToggleHabit}
          onToggleMeal={(mealType, completed) =>
            handleUpdateMeal({ date: currentDate, mealType, completed })
          }
          onAddQuickFitness={(type, mins) =>
            handleAddFitness({
              date: currentDate,
              workoutType: type,
              durationMinutes: mins,
              intensity: "High",
            })
          }
          onAddQuickStudy={(subject, topic, mins) =>
            handleAddAcademicLog({
              date: currentDate,
              subject,
              topic,
              completedWork: "Fast study block completed",
              durationMinutes: mins,
              difficulty: 3,
            })
          }
          onAddQuickMusic={(inst, topic, mins) =>
            handleAddMusicLog({
              date: currentDate,
              instrument: inst,
              topic,
              durationMinutes: mins,
              completed: true,
            })
          }
          noOilCompleted={dayData.dayLog.noOilCompleted}
          noCaffeineCompleted={dayData.dayLog.noCaffeineCompleted}
          breakfastCompleted={Boolean(breakfast?.completed)}
          lunchCompleted={Boolean(lunch?.completed)}
          dinnerCompleted={Boolean(dinner?.completed)}
        />
      )}

      {/* Auth / Profile Switcher Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={user}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* PWA Install Prompt (shows after 3s on supported devices) */}
      <InstallPrompt />
    </div>
  );
}
