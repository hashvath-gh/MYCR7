import { NextResponse } from "next/server";
import { db } from "@/db";
import { sleepSlots } from "@/db/schema";
import { calculateSlotDurationMinutes } from "@/lib/scoring";
import { getOrCreateDailyLog } from "@/lib/day-helper";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, startTime, endTime, label, quality } = body;

    const user = await getCurrentUser(req);
    const durationMinutes = calculateSlotDurationMinutes(startTime, endTime);

    const [newSlot] = await db.insert(sleepSlots).values({
      userId: user.id,
      date,
      startTime,
      endTime,
      durationMinutes,
      label: label || "Sleep Period",
      quality: quality || "Good",
    }).returning();

    const dayData = await getOrCreateDailyLog(user.id, date);

    return NextResponse.json({
      success: true,
      slot: newSlot,
      ...dayData,
    });
  } catch (error: any) {
    console.error("Error in /api/sleep POST:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, date, startTime, endTime, label, quality } = body;

    const user = await getCurrentUser(req);
    const durationMinutes = calculateSlotDurationMinutes(startTime, endTime);

    const [updatedSlot] = await db.update(sleepSlots)
      .set({
        startTime,
        endTime,
        durationMinutes,
        label,
        quality,
      })
      .where(and(eq(sleepSlots.id, id), eq(sleepSlots.userId, user.id)))
      .returning();

    const dayData = await getOrCreateDailyLog(user.id, date);

    return NextResponse.json({
      success: true,
      slot: updatedSlot,
      ...dayData,
    });
  } catch (error: any) {
    console.error("Error in /api/sleep PUT:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const date = searchParams.get("date");

    const user = await getCurrentUser(req);
    await db.delete(sleepSlots).where(and(eq(sleepSlots.id, id), eq(sleepSlots.userId, user.id)));

    const dayData = await getOrCreateDailyLog(user.id, date!);

    return NextResponse.json({
      success: true,
      ...dayData,
    });
  } catch (error: any) {
    console.error("Error in /api/sleep DELETE:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
