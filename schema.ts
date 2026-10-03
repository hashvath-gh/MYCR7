import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Alex Rivera"),
  email: text("email").notNull().default("alex@discipline.os"),
  password: text("password").default("password123"),
  avatar: text("avatar").default("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"),
  title: text("title").default("Discipline Architect"),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(340),
  currentStreak: integer("current_streak").notNull().default(12),
  longestStreak: integer("longest_streak").notNull().default(19),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sleepTargetHours: numeric("sleep_target_hours", { precision: 3, scale: 1 }).notNull().default("7.5"),
  waterTargetMl: integer("water_target_ml").notNull().default(4000),
  fitnessTargetMin: integer("fitness_target_min").notNull().default(30),
  caffeineCutoffTime: text("caffeine_cutoff_time").notNull().default("18:00"),
  academicTargetMin: integer("academic_target_min").notNull().default(60),
  musicTargetMin: integer("music_target_min").notNull().default(30),
  theme: text("theme").notNull().default("dark"),
  unitSystem: text("unit_system").notNull().default("ml"),
  enableReminders: boolean("enable_reminders").notNull().default(true),
  reminderSettings: text("reminder_settings").default('{"sleep":true,"water":true,"caffeine":true,"fitness":true,"meals":true,"journal":true,"study":true}'),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dailyLogs = pgTable("daily_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // Format: YYYY-MM-DD
  score: numeric("score", { precision: 5, scale: 1 }).notNull().default("0"),
  sleepScore: numeric("sleep_score", { precision: 4, scale: 1 }).notNull().default("0"),
  noOilScore: numeric("no_oil_score", { precision: 4, scale: 1 }).notNull().default("0"),
  noCaffeineScore: numeric("no_caffeine_score", { precision: 4, scale: 1 }).notNull().default("0"),
  foodScore: numeric("food_score", { precision: 4, scale: 1 }).notNull().default("0"),
  fitnessScore: numeric("fitness_score", { precision: 4, scale: 1 }).notNull().default("0"),
  waterScore: numeric("water_score", { precision: 4, scale: 1 }).notNull().default("0"),
  musicScore: numeric("music_score", { precision: 4, scale: 1 }).notNull().default("0"),
  academicScore: numeric("academic_score", { precision: 4, scale: 1 }).notNull().default("0"),
  journalScore: numeric("journal_score", { precision: 4, scale: 1 }).notNull().default("0"),
  totalSleepMinutes: integer("total_sleep_minutes").notNull().default(0),
  noOilCompleted: boolean("no_oil_completed").notNull().default(false),
  noCaffeineCompleted: boolean("no_caffeine_completed").notNull().default(false),
  waterMl: integer("water_ml").notNull().default(0),
  fitnessMinutes: integer("fitness_minutes").notNull().default(0),
  musicMinutes: integer("music_minutes").notNull().default(0),
  academicMinutes: integer("academic_minutes").notNull().default(0),
  isPerfectDay: boolean("is_perfect_day").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sleepSlots = pgTable("sleep_slots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // YYYY-MM-DD
  startTime: text("start_time").notNull(), // e.g. "23:00"
  endTime: text("end_time").notNull(), // e.g. "04:30"
  durationMinutes: integer("duration_minutes").notNull().default(0),
  label: text("label").notNull().default("Main Sleep"), // e.g. "Main Night Sleep", "Afternoon Power Nap"
  quality: text("quality").default("Good"), // Deep, Good, Restless, Light
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mealLogs = pgTable("meal_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  mealType: text("meal_type").notNull(), // 'breakfast' | 'lunch' | 'dinner'
  completed: boolean("completed").notNull().default(false),
  foodItems: text("food_items").default(""),
  notes: text("notes").default(""),
  healthRating: integer("health_rating").default(5), // 1-5
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fitnessLogs = pgTable("fitness_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  workoutType: text("workout_type").notNull().default("Gym"), // Gym, Running, Walking, Cycling, Home workout, Sports, Custom, HIIT, Yoga
  durationMinutes: integer("duration_minutes").notNull().default(30),
  caloriesBurned: integer("calories_burned").default(250),
  intensity: text("intensity").default("Moderate"), // Low, Moderate, High, Max
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const waterLogs = pgTable("water_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  amountMl: integer("amount_ml").notNull(),
  loggedAtTime: text("logged_at_time").notNull().default("12:00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const musicLogs = pgTable("music_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  instrument: text("instrument").notNull().default("Piano"), // Piano, Guitar, Violin, Drums, Vocals, Music Theory, Production
  topic: text("topic").notNull().default("Scales & Arpeggios"),
  durationMinutes: integer("duration_minutes").notNull().default(30),
  notes: text("notes").default(""),
  completed: boolean("completed").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const academicLogs = pgTable("academic_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  subject: text("subject").notNull(), // e.g. "Mathematics", "Computer Science", "Physics"
  topic: text("topic").notNull(), // e.g. "Differential Equations - Unit 3"
  completedWork: text("completed_work").notNull(), // e.g. "Problems 1-20 & Lecture Review"
  durationMinutes: integer("duration_minutes").notNull().default(60),
  difficulty: integer("difficulty").notNull().default(3), // 1-5 scale
  notes: text("notes").default(""),
  referenceUrl: text("reference_url").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  mood: text("mood").notNull().default("happy"), // 'very_sad', 'sad', 'neutral', 'happy', 'ecstatic'
  energyLevel: integer("energy_level").default(4), // 1-5
  thoughts: text("thoughts").default(""),
  gratitude: text("gratitude").default(""),
  learned: text("learned").default(""),
  wentWell: text("went_well").default(""),
  couldImprove: text("could_improve").default(""),
  completed: boolean("completed").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(), // 'small' | 'big' | 'academic'
  title: text("title").notNull(),
  description: text("description").default(""),
  completed: boolean("completed").notNull().default(false),
  priority: text("priority").notNull().default("medium"), // 'low', 'medium', 'high', 'urgent'
  dueDate: text("due_date"), // YYYY-MM-DD
  dueTime: text("due_time"), // HH:mm
  subject: text("subject"), // For academic tasks (e.g. "Computer Networks")
  progress: integer("progress").default(0), // 0-100% for big/academic tasks
  subtasks: text("subtasks").default("[]"), // JSON stringified array of {id, title, completed}
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  badgeKey: text("badge_key").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(),
  unlockedAt: timestamp("unlocked_at"),
  unlocked: boolean("unlocked").notNull().default(false),
  progress: integer("progress").notNull().default(0), // 0-100
  maxProgress: integer("max_progress").notNull().default(100),
  xpReward: integer("xp_reward").notNull().default(100),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
  dailyLogs: many(dailyLogs),
  sleepSlots: many(sleepSlots),
  mealLogs: many(mealLogs),
  fitnessLogs: many(fitnessLogs),
  waterLogs: many(waterLogs),
  musicLogs: many(musicLogs),
  academicLogs: many(academicLogs),
  journalEntries: many(journalEntries),
  tasks: many(tasks),
  badges: many(badges),
}));
