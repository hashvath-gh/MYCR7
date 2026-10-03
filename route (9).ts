import { NextResponse } from "next/server";
import { db } from "@/db";
import { fitnessLogs } from "@/db/schema";
import { getOrCreateDailyLog } from "@/lib/day-helper";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, workoutType, durationMinutes, notes, intensity, caloriesBurned } = body;

    const user = await getCurrentUser(req);

    const [workout] = await db.insert(fitnessLogs).values({
      userId: user.id,
      date,
      workoutType: workoutType || "Gym",
      durationMinutes: Number(durationMinutes) || 30,
      caloriesBurned: caloriesBurned ? Number(caloriesBurned) : Math.round((Number(durationMinutes) || 30) * 8),
      intensity: intensity || "Moderate",
      notes: notes || "",
    }).returning();

    const dayData = await getOrCreateDailyLog(user.id, date);

    return NextResponse.json({
      success: true,
      workout,
      ...dayData,
    });
  } catch (error: any) {
    console.error("Error in /api/fitness POST:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const date = searchParams.get("date");

    const user = await getCurrentUser(req);

    await db.delete(fitnessLogs).where(and(eq(fitnessLogs.id, id), eq(fitnessLogs.userId, user.id)));

    const dayData = await getOrCreateDailyLog(user.id, date!);

    return NextResponse.json({
      success: true,
      ...dayData,
    });
  } catch (error: any) {
    console.error("Error in /api/fitness DELETE:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
