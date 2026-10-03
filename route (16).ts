import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userSettings, dailyLogs, sleepSlots, mealLogs, fitnessLogs, waterLogs, musicLogs, academicLogs, journalEntries, tasks, badges } from "@/db/schema";
import { seedInitialData } from "@/lib/seed";

export async function POST() {
  try {
    // Clear existing data
    await db.delete(tasks);
    await db.delete(journalEntries);
    await db.delete(academicLogs);
    await db.delete(musicLogs);
    await db.delete(waterLogs);
    await db.delete(fitnessLogs);
    await db.delete(mealLogs);
    await db.delete(sleepSlots);
    await db.delete(dailyLogs);
    await db.delete(badges);
    await db.delete(userSettings);
    await db.delete(users);

    const user = await seedInitialData();

    return NextResponse.json({
      success: true,
      message: "Database reset and seeded successfully",
      user,
    });
  } catch (error: any) {
    console.error("Error in /api/reset POST:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
