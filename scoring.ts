export interface SleepSlotInput {
  id?: number;
  startTime: string; // "23:00"
  endTime: string;   // "04:30"
  label?: string;
  quality?: string;
}

/**
 * Calculates duration in minutes between start time and end time.
 * Handles overnight time ranges (e.g., 23:00 to 05:30).
 */
export function calculateSlotDurationMinutes(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;
  
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);
  
  if (isNaN(startHour) || isNaN(startMin) || isNaN(endHour) || isNaN(endMin)) return 0;
  
  let startTotal = startHour * 60 + startMin;
  let endTotal = endHour * 60 + endMin;
  
  if (endTotal < startTotal) {
    // Spans past midnight
    endTotal += 24 * 60;
  }
  
  return Math.max(0, endTotal - startTotal);
}

/**
 * Calculates sleep score out of 20 points based on total minutes.
 * Target: 7–8 hours (420–480 mins) => 20 pts
 */
export function calculateSleepScore(totalMinutes: number, targetHours = 7.5): number {
  const hours = totalMinutes / 60;
  if (hours <= 0) return 0;
  
  if (hours >= 7.0 && hours <= 8.5) {
    return 20.0;
  }
  if (hours > 8.5) {
    // Slight penalty for excessive oversleeping (e.g., 10h+ gets 16 pts)
    const over = hours - 8.5;
    return Math.max(14, Number((20 - over * 2.5).toFixed(1)));
  }
  if (hours >= 6.0) {
    // 6.0h -> 14.0 pts, 6.9h -> 19.4 pts
    const score = 14 + (hours - 6.0) * 6.0;
    return Math.min(20, Number(score.toFixed(1)));
  }
  if (hours >= 5.0) {
    // 5.0h -> 8.0 pts, 5.9h -> 13.4 pts
    const score = 8 + (hours - 5.0) * 6.0;
    return Math.min(14, Number(score.toFixed(1)));
  }
  // Less than 5 hours
  const score = Math.max(1, (hours / 5.0) * 8.0);
  return Number(score.toFixed(1));
}

/**
 * Calculates food score out of 10 points based on meals completed.
 * Breakfast = 3.5, Lunch = 3.5, Dinner = 3.0 => Total 10
 */
export function calculateFoodScore(meals: { breakfast?: boolean; lunch?: boolean; dinner?: boolean }): number {
  let score = 0;
  if (meals.breakfast) score += 3.5;
  if (meals.lunch) score += 3.5;
  if (meals.dinner) score += 3.0;
  return Number(score.toFixed(1));
}

/**
 * Calculates fitness score out of 10 points.
 * 30+ mins = 10 pts, proportional if less.
 */
export function calculateFitnessScore(durationMinutes: number, targetMinutes = 30): number {
  if (durationMinutes <= 0) return 0;
  if (durationMinutes >= targetMinutes) return 10;
  const score = (durationMinutes / targetMinutes) * 10;
  return Number(score.toFixed(1));
}

/**
 * Calculates water hydration score out of 10 points.
 * 4000 ml = 10 pts, proportional if less.
 */
export function calculateWaterScore(waterMl: number, targetMl = 4000): number {
  if (waterMl <= 0) return 0;
  if (waterMl >= targetMl) return 10;
  const score = (waterMl / targetMl) * 10;
  return Number(score.toFixed(1));
}

/**
 * Calculates music learning score out of 10 points.
 */
export function calculateMusicScore(completed: boolean, durationMinutes: number, targetMinutes = 30): number {
  if (completed || durationMinutes >= targetMinutes) return 10;
  if (durationMinutes <= 0) return 0;
  const score = (durationMinutes / targetMinutes) * 10;
  return Number(score.toFixed(1));
}

/**
 * Calculates academic learning score out of 15 points.
 */
export function calculateAcademicScore(durationMinutes: number, targetMinutes = 60, hasCompletedWork = false): number {
  if (durationMinutes >= targetMinutes) return 15;
  if (durationMinutes > 0) {
    const score = (durationMinutes / targetMinutes) * 15;
    return Math.min(15, Number(score.toFixed(1)));
  }
  if (hasCompletedWork) return 10;
  return 0;
}

export interface DayScoreBreakdown {
  sleep: number;        // /20
  noOil: number;        // /5
  noCaffeine: number;   // /5
  food: number;         // /10
  fitness: number;      // /10
  water: number;        // /10
  music: number;        // /10
  academic: number;     // /15
  journal: number;      // /5
  total: number;        // /100
  isPerfectDay: boolean;
}

export function computeDailyScore(params: {
  totalSleepMinutes: number;
  noOilCompleted: boolean;
  noCaffeineCompleted: boolean;
  breakfastCompleted: boolean;
  lunchCompleted: boolean;
  dinnerCompleted: boolean;
  fitnessMinutes: number;
  waterMl: number;
  musicCompleted: boolean;
  musicMinutes: number;
  academicMinutes: number;
  academicHasWork: boolean;
  journalCompleted: boolean;
  targets?: {
    sleepHours?: number;
    waterMl?: number;
    fitnessMin?: number;
    academicMin?: number;
    musicMin?: number;
  };
}): DayScoreBreakdown {
  const t = params.targets || {};
  
  const sleep = calculateSleepScore(params.totalSleepMinutes, t.sleepHours ?? 7.5);
  const noOil = params.noOilCompleted ? 5 : 0;
  const noCaffeine = params.noCaffeineCompleted ? 5 : 0;
  const food = calculateFoodScore({
    breakfast: params.breakfastCompleted,
    lunch: params.lunchCompleted,
    dinner: params.dinnerCompleted,
  });
  const fitness = calculateFitnessScore(params.fitnessMinutes, t.fitnessMin ?? 30);
  const water = calculateWaterScore(params.waterMl, t.waterMl ?? 4000);
  const music = calculateMusicScore(params.musicCompleted, params.musicMinutes, t.musicMin ?? 30);
  const academic = calculateAcademicScore(params.academicMinutes, t.academicMin ?? 60, params.academicHasWork);
  const journal = params.journalCompleted ? 5 : 0;

  const total = Number((sleep + noOil + noCaffeine + food + fitness + water + music + academic + journal).toFixed(1));
  const isPerfectDay = total >= 100;

  return {
    sleep,
    noOil,
    noCaffeine,
    food,
    fitness,
    water,
    music,
    academic,
    journal,
    total,
    isPerfectDay,
  };
}

// Level System
export const LEVELS = [
  { level: 1, name: "Beginner", minXp: 0, maxXp: 500, color: "from-zinc-500 to-slate-400" },
  { level: 2, name: "Consistent", minXp: 501, maxXp: 1200, color: "from-blue-500 to-cyan-400" },
  { level: 3, name: "Disciplined", minXp: 1201, maxXp: 2200, color: "from-emerald-500 to-teal-400" },
  { level: 4, name: "Strong", minXp: 2201, maxXp: 3500, color: "from-amber-500 to-orange-400" },
  { level: 5, name: "Elite", minXp: 3501, maxXp: 5000, color: "from-purple-500 to-indigo-400" },
  { level: 6, name: "Master", minXp: 5001, maxXp: 7500, color: "from-rose-500 to-pink-400" },
  { level: 7, name: "Grandmaster", minXp: 7501, maxXp: 10000, color: "from-violet-600 to-fuchsia-500" },
  { level: 8, name: "Unstoppable Titan", minXp: 10001, maxXp: 99999, color: "from-amber-400 via-rose-500 to-cyan-400" },
];

export function getLevelInfo(xp: number) {
  const current = LEVELS.find(l => xp >= l.minXp && xp <= l.maxXp) || LEVELS[LEVELS.length - 1];
  const next = LEVELS.find(l => l.level === current.level + 1) || current;
  const xpInLevel = xp - current.minXp;
  const levelRange = (next.minXp - current.minXp) || 1000;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInLevel / levelRange) * 100)));

  return {
    ...current,
    nextLevel: next,
    xpInLevel,
    levelRange,
    progressPercent,
  };
}

export function formatMinutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
