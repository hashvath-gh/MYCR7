import { NextResponse } from "next/server";
import { db } from "@/db";
import { musicLogs } from "@/db/schema";
import { getOrCreateDailyLog } from "@/lib/day-helper";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, instrument, topic, durationMinutes, notes, completed } = body;

    const user = await getCurrentUser(req);

    const [newMusicLog] = await db.insert(musicLogs).values({
      userId: user.id,
      date,
      instrument: instrument || "Piano",
      topic: topic || "Practice session",
      durationMinutes: Number(durationMinutes) || 30,
      notes: notes || "",
      completed: completed !== undefined ? Boolean(completed) : true,
    }).returning();

    const dayData = await getOrCreateDailyLog(user.id, date);

    return NextResponse.json({
      success: true,
      createdLog: newMusicLog,
      ...dayData,
    });
  } catch (error: any) {
    console.error("Error in /api/music POST:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const date = searchParams.get("date");

    const user = await getCurrentUser(req);
    await db.delete(musicLogs).where(and(eq(musicLogs.id, id), eq(musicLogs.userId, user.id)));

    const dayData = await getOrCreateDailyLog(user.id, date!);

    return NextResponse.json({
      success: true,
      ...dayData,
    });
  } catch (error: any) {
    console.error("Error in /api/music DELETE:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
