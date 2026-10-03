import { NextResponse } from "next/server";
import { db } from "@/db";
import { academicLogs } from "@/db/schema";
import { getOrCreateDailyLog } from "@/lib/day-helper";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, subject, topic, completedWork, durationMinutes, difficulty, notes, referenceUrl } = body;

    const user = await getCurrentUser(req);

    const [newAcademicLog] = await db.insert(academicLogs).values({
      userId: user.id,
      date,
      subject: subject || "General Study",
      topic: topic || "Study Session",
      completedWork: completedWork || "Study notes & problem sets",
      durationMinutes: Number(durationMinutes) || 60,
      difficulty: Number(difficulty) || 3,
      notes: notes || "",
      referenceUrl: referenceUrl || "",
    }).returning();

    const dayData = await getOrCreateDailyLog(user.id, date);

    return NextResponse.json({
      success: true,
      createdLog: newAcademicLog,
      ...dayData,
    });
  } catch (error: any) {
    console.error("Error in /api/academics POST:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const date = searchParams.get("date");

    const user = await getCurrentUser(req);
    await db.delete(academicLogs).where(and(eq(academicLogs.id, id), eq(academicLogs.userId, user.id)));

    const dayData = await getOrCreateDailyLog(user.id, date!);

    return NextResponse.json({
      success: true,
      ...dayData,
    });
  } catch (error: any) {
    console.error("Error in /api/academics DELETE:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
