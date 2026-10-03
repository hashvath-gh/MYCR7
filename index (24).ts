export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  title: string | null;
  level: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
}

export interface UserSettingsData {
  id: number;
  userId: number;
  sleepTargetHours: string;
  waterTargetMl: number;
  fitnessTargetMin: number;
  caffeineCutoffTime: string;
  academicTargetMin: number;
  musicTargetMin: number;
  theme: string;
  unitSystem: string;
  enableReminders: boolean;
  reminderSettings: string | null;
}

export interface DailyLogData {
  id: number;
  userId: number;
  date: string;
  score: string;
  sleepScore: string;
  noOilScore: string;
  noCaffeineScore: string;
  foodScore: string;
  fitnessScore: string;
  waterScore: string;
  musicScore: string;
  academicScore: string;
  journalScore: string;
  totalSleepMinutes: number;
  noOilCompleted: boolean;
  noCaffeineCompleted: boolean;
  waterMl: number;
  fitnessMinutes: number;
  musicMinutes: number;
  academicMinutes: number;
  isPerfectDay: boolean;
  notes: string | null;
}

export interface SleepSlotData {
  id: number;
  userId: number;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  label: string;
  quality: string | null;
}

export interface MealLogData {
  id: number;
  userId: number;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner";
  completed: boolean;
  foodItems: string | null;
  notes: string | null;
  healthRating: number | null;
}

export interface FitnessLogData {
  id: number;
  userId: number;
  date: string;
  workoutType: string;
  durationMinutes: number;
  caloriesBurned: number | null;
  intensity: string | null;
  notes: string | null;
}

export interface WaterLogData {
  id: number;
  userId: number;
  date: string;
  amountMl: number;
  loggedAtTime: string;
}

export interface MusicLogData {
  id: number;
  userId: number;
  date: string;
  instrument: string;
  topic: string;
  durationMinutes: number;
  notes: string | null;
  completed: boolean;
}

export interface AcademicLogData {
  id: number;
  userId: number;
  date: string;
  subject: string;
  topic: string;
  completedWork: string;
  durationMinutes: number;
  difficulty: number;
  notes: string | null;
  referenceUrl: string | null;
}

export interface JournalEntryData {
  id: number;
  userId: number;
  date: string;
  mood: string;
  energyLevel: number | null;
  thoughts: string | null;
  gratitude: string | null;
  learned: string | null;
  wentWell: string | null;
  couldImprove: string | null;
  completed: boolean;
}

export interface TaskData {
  id: number;
  userId: number;
  category: "small" | "big" | "academic";
  title: string;
  description: string | null;
  completed: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string | null;
  dueTime: string | null;
  subject: string | null;
  progress: number | null;
  subtasks: string | null;
  notes: string | null;
}

export interface BadgeData {
  id: number;
  userId: number;
  badgeKey: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt: string | null;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  xpReward: number;
}

export interface DayBreakdown {
  sleep: number;
  noOil: number;
  noCaffeine: number;
  food: number;
  fitness: number;
  water: number;
  music: number;
  academic: number;
  journal: number;
  total: number;
  isPerfectDay: boolean;
}

export interface FullDayData {
  dayLog: DailyLogData;
  breakdown: DayBreakdown;
  sleepSlots: SleepSlotData[];
  meals: MealLogData[];
  fitness: FitnessLogData[];
  water: WaterLogData[];
  music: MusicLogData[];
  academics: AcademicLogData[];
  journal: JournalEntryData | null;
  targets: {
    sleepHours: number;
    waterMl: number;
    fitnessMin: number;
    academicMin: number;
    musicMin: number;
    caffeineCutoffTime: string;
  };
}
