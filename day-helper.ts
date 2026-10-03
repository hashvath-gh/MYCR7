import { db } from "@/db";
import { users, userSettings, dailyLogs, sleepSlots, mealLogs, fitnessLogs, waterLogs, musicLogs, academicLogs, journalEntries, tasks } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { computeDailyScore, calculateSlotDurationMinutes } from "./scoring";

export async function getOrCreateDailyLog(userId: number, date: string) {
  // Ensure user settings are loaded
  const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1);
  const sleepTargetHours = settings ? Number(settings.sleepTargetHours) : 7.5;
  const waterTargetMl = settings ? settings.waterTargetMl : 4000;
  const fitnessTargetMin = settings ? settings.fitnessTargetMin : 30;
  const academicTargetMin = settings ? settings.academicTargetMin : 60;
  const musicTargetMin = settings ? settings.musicTargetMin : 30;

  // Fetch or create daily_logs entry
  let [dayLog] = await db.select().from(dailyLogs).where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, date))).limit(1);

  if (!dayLog) {
    const [inserted] = await db.insert(dailyLogs).values({
      userId,
      date,
      score: "0",
      totalSleepMinutes: 0,
      noOilCompleted: false,
      noCaffeineCompleted: false,
      waterMl: 0,
      fitnessMinutes: 0,
      musicMinutes: 0,
      academicMinutes: 0,
    }).returning();
    dayLog = inserted;

    // Ensure 3 meal rows exist
    await db.insert(mealLogs).values([
      { userId, date, mealType: "breakfast", completed: false, foodItems: "", notes: "" },
      { userId, date, mealType: "lunch", completed: false, foodItems: "", notes: "" },
      { userId, date, mealType: "dinner", completed: false, foodItems: "", notes: "" },
    ]);
  }

  // Fetch all related entities for this date
  const slots = await db.select().from(sleepSlots).where(and(eq(sleepSlots.userId, userId), eq(sleepSlots.date, date)));
  const meals = await db.select().from(mealLogs).where(and(eq(mealLogs.userId, userId), eq(mealLogs.date, date)));
  const fitness = await db.select().from(fitnessLogs).where(and(eq(fitnessLogs.userId, userId), eq(fitnessLogs.date, date))).orderBy(desc(fitnessLogs.id));
  const water = await db.select().from(waterLogs).where(and(eq(waterLogs.userId, userId), eq(waterLogs.date, date))).orderBy(desc(waterLogs.id));
  const music = await db.select().from(musicLogs).where(and(eq(musicLogs.userId, userId), eq(musicLogs.date, date))).orderBy(desc(musicLogs.id));
  const academics = await db.select().from(academicLogs).where(and(eq(academicLogs.userId, userId), eq(academicLogs.date, date))).orderBy(desc(academicLogs.id));
  const [journal] = await db.select().from(journalEntries).where(and(eq(journalEntries.userId, userId), eq(journalEntries.date, date))).limit(1);

  // Compute aggregate numbers
  const totalSleepMinutes = slots.reduce((acc, slot) => acc + (slot.durationMinutes || calculateSlotDurationMinutes(slot.startTime, slot.endTime)), 0);
  const totalWaterMl = water.reduce((acc, w) => acc + w.amountMl, 0);
  const totalFitnessMinutes = fitness.reduce((acc, f) => acc + f.durationMinutes, 0);
  const totalMusicMinutes = music.reduce((acc, m) => acc + m.durationMinutes, 0);
  const musicCompleted = music.some(m => m.completed) || totalMusicMinutes >= musicTargetMin;
  const totalAcademicMinutes = academics.reduce((acc, a) => acc + a.durationMinutes, 0);
  const academicHasWork = academics.length > 0;

  const breakfast = meals.find(m => m.mealType === "breakfast");
  const lunch = meals.find(m => m.mealType === "lunch");
  const dinner = meals.find(m => m.mealType === "dinner");

  const journalCompleted = Boolean(journal && (journal.thoughts || journal.gratitude || journal.learned || journal.wentWell || journal.couldImprove));

  // Compute 100-pt breakdown
  const breakdown = computeDailyScore({
    totalSleepMinutes,
    noOilCompleted: dayLog.noOilCompleted,
    noCaffeineCompleted: dayLog.noCaffeineCompleted,
    breakfastCompleted: Boolean(breakfast?.completed),
    lunchCompleted: Boolean(lunch?.completed),
    dinnerCompleted: Boolean(dinner?.completed),
    fitnessMinutes: totalFitnessMinutes,
    waterMl: totalWaterMl,
    musicCompleted,
    musicMinutes: totalMusicMinutes,
    academicMinutes: totalAcademicMinutes,
    academicHasWork,
    journalCompleted,
    targets: {
      sleepHours: sleepTargetHours,
      waterMl: waterTargetMl,
      fitnessMin: fitnessTargetMin,
      academicMin: academicTargetMin,
      musicMin: musicTargetMin,
    },
  });

  // Sync back to dailyLogs table
  const [updatedDayLog] = await db.update(dailyLogs)
    .set({
      score: String(breakdown.total),
      sleepScore: String(breakdown.sleep),
      noOilScore: String(breakdown.noOil),
      noCaffeineScore: String(breakdown.noCaffeine),
      foodScore: String(breakdown.food),
      fitnessScore: String(breakdown.fitness),
      waterScore: String(breakdown.water),
      musicScore: String(breakdown.music),
      academicScore: String(breakdown.academic),
      journalScore: String(breakdown.journal),
      totalSleepMinutes,
      waterMl: totalWaterMl,
      fitnessMinutes: totalFitnessMinutes,
      musicMinutes: totalMusicMinutes,
      academicMinutes: totalAcademicMinutes,
      isPerfectDay: breakdown.isPerfectDay,
      updatedAt: new Date(),
    })
    .where(eq(dailyLogs.id, dayLog.id))
    .returning();

  return {
    dayLog: updatedDayLog,
    breakdown,
    sleepSlots: slots,
    meals,
    fitness,
    water,
    music,
    academics,
    journal: journal || null,
    targets: {
      sleepHours: sleepTargetHours,
      waterMl: waterTargetMl,
      fitnessMin: fitnessTargetMin,
      academicMin: academicTargetMin,
      musicMin: musicTargetMin,
      caffeineCutoffTime: settings?.caffeineCutoffTime || "18:00",
    },
  };
}
