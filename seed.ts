import { db } from "@/db";
import { users, userSettings, dailyLogs, sleepSlots, mealLogs, fitnessLogs, waterLogs, musicLogs, academicLogs, journalEntries, tasks, badges } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { format, subDays } from "date-fns";

export async function seedInitialData() {
  // Check if users exist
  const existingUsers = await db.select().from(users).limit(1);
  if (existingUsers.length > 0) {
    return existingUsers[0];
  }

  // 1. User Option A: Alex Rivera (Discipline Master)
  const [userA] = await db.insert(users).values({
    name: "Alex Rivera",
    email: "alex@discipline.os",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "Discipline Architect",
    level: 5,
    xp: 4850,
    currentStreak: 14,
    longestStreak: 21,
  }).returning();

  await seedUserData(userA.id, "alex");

  // 2. User Option B: Sarah Chen (Pre-Med & Athlete)
  const [userB] = await db.insert(users).values({
    name: "Sarah Chen",
    email: "sarah@discipline.os",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    title: "Pre-Med Scholar & Athlete",
    level: 6,
    xp: 6200,
    currentStreak: 28,
    longestStreak: 35,
  }).returning();

  await seedUserData(userB.id, "sarah");

  // 3. User Option C: Marcus Vance (Beginner Consistency)
  const [userC] = await db.insert(users).values({
    name: "Marcus Vance",
    email: "marcus@discipline.os",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    title: "Productivity Engineer",
    level: 2,
    xp: 950,
    currentStreak: 5,
    longestStreak: 8,
  }).returning();

  await seedUserData(userC.id, "marcus");

  return userA;
}

export async function seedUserData(userId: number, variant: "alex" | "sarah" | "marcus" = "alex") {
  // Create settings
  await db.insert(userSettings).values({
    userId,
    sleepTargetHours: "7.5",
    waterTargetMl: 4000,
    fitnessTargetMin: 30,
    caffeineCutoffTime: "18:00",
    academicTargetMin: 60,
    musicTargetMin: 30,
    theme: "dark",
    unitSystem: "ml",
    enableReminders: true,
  });

  // Badges
  const defaultBadges = [
    { badgeKey: "streak_7", title: "7-Day Streak", description: "Maintained a 7-day consistency streak", icon: "🔥", category: "Streak", unlocked: true, progress: 100, maxProgress: 100, xpReward: 150 },
    { badgeKey: "streak_30", title: "30-Day Legend", description: "Reach a continuous 30-day streak", icon: "🏆", category: "Streak", unlocked: variant === "sarah", progress: variant === "sarah" ? 30 : 14, maxProgress: 30, xpReward: 500 },
    { badgeKey: "hydration_master", title: "Hydration Master", description: "Drank 4000ml water for 10 days", icon: "💧", category: "Health", unlocked: true, progress: 10, maxProgress: 10, xpReward: 200 },
    { badgeKey: "sleep_optima", title: "Sleep Architect", description: "Hit 7-8 hours sleep target 15 times", icon: "😴", category: "Sleep", unlocked: true, progress: 15, maxProgress: 15, xpReward: 250 },
    { badgeKey: "fitness_warrior", title: "Iron Will", description: "Completed 30+ min workouts 20 days", icon: "🏋️", category: "Fitness", unlocked: true, progress: 20, maxProgress: 20, xpReward: 300 },
    { badgeKey: "study_champion", title: "Scholar Supreme", description: "Logged 50+ hours of academic study", icon: "📚", category: "Academics", unlocked: true, progress: 50, maxProgress: 50, xpReward: 400 },
    { badgeKey: "music_virtuoso", title: "Melody Maker", description: "Practiced musical instrument 15 days", icon: "🎵", category: "Music", unlocked: true, progress: 15, maxProgress: 15, xpReward: 200 },
    { badgeKey: "journal_zen", title: "Reflective Mind", description: "Wrote daily gratitude and reflections 20 days", icon: "📖", category: "Mindset", unlocked: true, progress: 20, maxProgress: 20, xpReward: 150 },
    { badgeKey: "perfect_100", title: "100/100 Perfect Day", description: "Achieved maximum 100 points in a single day", icon: "💎", category: "Mastery", unlocked: true, progress: 1, maxProgress: 1, xpReward: 300 },
    { badgeKey: "clean_fuel", title: "Pure Energy", description: "Zero oil & no caffeine after 6 PM for 14 days", icon: "🥗", category: "Habits", unlocked: true, progress: 14, maxProgress: 14, xpReward: 250 },
  ];

  for (const b of defaultBadges) {
    await db.insert(badges).values({
      userId,
      ...b,
      unlockedAt: b.unlocked ? new Date() : null,
    });
  }

  // Tasks
  const initialTasks = [
    // 🟢 Small Things
    { category: "small", title: "Reply to Prof. Miller regarding research draft", description: "Send updated lab bibliography", completed: false, priority: "high", dueDate: format(new Date(), "yyyy-MM-dd"), dueTime: "16:00" },
    { category: "small", title: "Clean and reorganize workspace desk", description: "Cable management and clear desk surface", completed: true, priority: "medium", dueDate: format(new Date(), "yyyy-MM-dd"), dueTime: "11:30" },
    { category: "small", title: "Refill vitamins & electrolyte supply", description: "Pick up magnesium and zinc", completed: false, priority: "low", dueDate: format(new Date(), "yyyy-MM-dd"), dueTime: "19:00" },
    { category: "small", title: "Backup study notes to cloud archive", description: "Sync Notion and Obsidian vaults", completed: true, priority: "medium", dueDate: format(new Date(), "yyyy-MM-dd"), dueTime: "14:00" },

    // 🔴 Big Things
    { category: "big", title: "Complete Distributed Systems Final Project", description: "Implement Raft consensus algorithm in Go with fault-tolerant state machine", completed: false, priority: "urgent", dueDate: format(subDays(new Date(), -5), "yyyy-MM-dd"), progress: 75, subtasks: JSON.stringify([
      { id: "1", title: "Leader election state transitions", completed: true },
      { id: "2", title: "Log replication RPCs", completed: true },
      { id: "3", title: "Snapshotting & network partition handling", completed: false },
      { id: "4", title: "Benchmarking & performance report", completed: false }
    ]), notes: "Test under 30% packet loss simulation." },
    { category: "big", title: "Finish Stanford Algorithms Specialization - Part 2", description: "Graph search, shortest paths, and data structures", completed: false, priority: "high", dueDate: format(subDays(new Date(), -10), "yyyy-MM-dd"), progress: 60, subtasks: JSON.stringify([
      { id: "1", title: "Dijkstra and A* algorithm implementations", completed: true },
      { id: "2", title: "Union-Find & Kruskal MST", completed: true },
      { id: "3", title: "Dynamic programming knapsack variations", completed: false }
    ]), notes: "Lectures 14 to 20 left." },

    // 📚 Academic / Assignment
    { category: "academic", title: "Differential Equations - Unit 4 Boundary Problems", subject: "Mathematics", description: "Complete Unit 4 Problem set #1 through #25 with proofs", completed: false, priority: "high", dueDate: format(subDays(new Date(), -3), "yyyy-MM-dd"), dueTime: "23:59", progress: 65, notes: "Focus on Laplace transforms and step functions." },
    { category: "academic", title: "Computer Networks - TCP Congestion Control Lab", subject: "Computer Science", description: "Wireshark packet analysis and congestion window growth graph", completed: true, priority: "medium", dueDate: format(subDays(new Date(), -1), "yyyy-MM-dd"), dueTime: "17:00", progress: 100, notes: "Submitted on Canvas with PDF report." },
  ];

  for (const t of initialTasks) {
    await db.insert(tasks).values({
      userId,
      ...t,
    });
  }

  // Generate 30 days of daily logs
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const targetDate = subDays(today, i);
    const dateStr = format(targetDate, "yyyy-MM-dd");
    const isToday = i === 0;

    const sleepVariation = (i % 7 === 0 || i % 7 === 6) ? 465 : (420 + (i * 13) % 45);
    const waterVariation = isToday ? 2750 : Math.min(4200, 3800 + ((i * 150) % 600));
    const fitnessMins = (i % 5 === 0) ? 45 : (i % 3 === 0) ? 35 : 30;
    const academicMins = (i % 6 === 0) ? 90 : (i % 4 === 0) ? 75 : 60;
    const musicMins = (i % 4 === 0) ? 45 : 30;
    
    const noOil = isToday ? true : (i % 11 !== 0);
    const noCaffeine = isToday ? true : (i % 9 !== 0);
    const bk = true;
    const lu = true;
    const dn = isToday ? false : (i % 13 !== 0);

    const sleepScoreVal = sleepVariation >= 420 ? 20.0 : 17.5;
    const noOilScoreVal = noOil ? 5.0 : 0.0;
    const noCaffeineScoreVal = noCaffeine ? 5.0 : 0.0;
    const foodScoreVal = (bk ? 3.5 : 0) + (lu ? 3.5 : 0) + (dn ? 3.0 : 0);
    const fitnessScoreVal = fitnessMins >= 30 ? 10.0 : Number(((fitnessMins / 30) * 10).toFixed(1));
    const waterScoreVal = waterVariation >= 4000 ? 10.0 : Number(((waterVariation / 4000) * 10).toFixed(1));
    const musicScoreVal = 10.0;
    const academicScoreVal = academicMins >= 60 ? 15.0 : Number(((academicMins / 60) * 15).toFixed(1));
    const journalScoreVal = 5.0;

    const totalScoreVal = Number((sleepScoreVal + noOilScoreVal + noCaffeineScoreVal + foodScoreVal + fitnessScoreVal + waterScoreVal + musicScoreVal + academicScoreVal + (isToday ? 0 : journalScoreVal)).toFixed(1));

    await db.insert(dailyLogs).values({
      userId,
      date: dateStr,
      score: String(totalScoreVal),
      sleepScore: String(sleepScoreVal),
      noOilScore: String(noOilScoreVal),
      noCaffeineScore: String(noCaffeineScoreVal),
      foodScore: String(foodScoreVal),
      fitnessScore: String(fitnessScoreVal),
      waterScore: String(waterScoreVal),
      musicScore: String(musicScoreVal),
      academicScore: String(academicScoreVal),
      journalScore: String(isToday ? "0" : journalScoreVal),
      totalSleepMinutes: sleepVariation,
      noOilCompleted: noOil,
      noCaffeineCompleted: noCaffeine,
      waterMl: waterVariation,
      fitnessMinutes: fitnessMins,
      musicMinutes: musicMins,
      academicMinutes: academicMins,
      isPerfectDay: totalScoreVal >= 99,
      notes: isToday ? "High energy morning, on track to hit 100/100 today." : "Great discipline and consistency maintained.",
    });

    // Sleep slots
    if (i % 3 === 0) {
      await db.insert(sleepSlots).values([
        {
          userId,
          date: dateStr,
          startTime: "23:00",
          endTime: "04:30",
          durationMinutes: 330,
          label: "Core Night Sleep",
          quality: "Deep",
        },
        {
          userId,
          date: dateStr,
          startTime: "07:00",
          endTime: "09:00",
          durationMinutes: 120,
          label: "Morning Recovery Sleep",
          quality: "Good",
        }
      ]);
    } else {
      await db.insert(sleepSlots).values({
        userId,
        date: dateStr,
        startTime: "23:15",
        endTime: "06:45",
        durationMinutes: 450,
        label: "Main Night Sleep",
        quality: "Deep",
      });
    }

    // Meal logs
    await db.insert(mealLogs).values([
      { userId, date: dateStr, mealType: "breakfast", completed: bk, foodItems: "Oatmeal with chia seeds, blueberries & protein shake", notes: "Zero added oil, clean whole foods", healthRating: 5 },
      { userId, date: dateStr, mealType: "lunch", completed: lu, foodItems: "Grilled lemon chicken breast, steamed quinoa, roasted broccoli", notes: "No oil, seasoned with herbs & lemon", healthRating: 5 },
      { userId, date: dateStr, mealType: "dinner", completed: dn, foodItems: dn ? "Salmon filet, avocado salad, sweet potato" : "", notes: dn ? "Clean and light dinner" : "Planned for 7:30 PM", healthRating: 5 },
    ]);

    // Fitness log
    await db.insert(fitnessLogs).values({
      userId,
      date: dateStr,
      workoutType: i % 2 === 0 ? "Gym" : "Running",
      durationMinutes: fitnessMins,
      caloriesBurned: fitnessMins * 8 + 40,
      intensity: "High",
      notes: "Consistent discipline training session",
    });

    // Water logs
    await db.insert(waterLogs).values([
      { userId, date: dateStr, amountMl: 750, loggedAtTime: "07:30" },
      { userId, date: dateStr, amountMl: 500, loggedAtTime: "10:15" },
      { userId, date: dateStr, amountMl: 750, loggedAtTime: "13:00" },
      { userId, date: dateStr, amountMl: 500, loggedAtTime: "15:45" },
      ...(waterVariation > 2500 ? [{ userId, date: dateStr, amountMl: waterVariation - 2500, loggedAtTime: "18:30" }] : [])
    ]);

    // Music log
    await db.insert(musicLogs).values({
      userId,
      date: dateStr,
      instrument: "Piano",
      topic: "Chopin Nocturne in C Minor",
      durationMinutes: musicMins,
      notes: "Practiced rubato and arpeggio phrasing",
      completed: true,
    });

    // Academic log
    await db.insert(academicLogs).values({
      userId,
      date: dateStr,
      subject: variant === "sarah" ? "Human Physiology" : "Computer Science",
      topic: variant === "sarah" ? "Cardiovascular Regulation" : "Distributed Consensus",
      completedWork: "Problem set and lecture review completed",
      durationMinutes: academicMins,
      difficulty: 4,
      notes: "Core concepts reviewed",
      referenceUrl: "",
    });

    // Journal
    if (!isToday) {
      await db.insert(journalEntries).values({
        userId,
        date: dateStr,
        mood: "happy",
        energyLevel: 4,
        thoughts: "Locked-in discipline and clean focus throughout the day.",
        gratitude: "Grateful for good health, family, and intellectual curiosity.",
        learned: "Discipline is the bridge between goals and accomplishment.",
        wentWell: "Hit all water and sleep milestones without friction.",
        couldImprove: "Sleep 15 minutes earlier.",
        completed: true,
      });
    }
  }
}
