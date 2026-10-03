import { NextResponse } from "next/server";
import { db } from "@/db";
import { waterLogs } from "@/db/schema";
import { getOrCreateDailyLog } from "@/lib/day-helper";
import { getCurrentUser } from "@/lib/auth";
import { format } from "date-fns";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, amountMl, loggedAtTime } = body;

    const user = await getCurrentUser(req);
    const timeStr = loggedAtTime || format(new Date(), "HH:mm");

    const [newLog] = await db.insert(waterLogs).values({
      userId: user.id,
      date,
      amountMl: Number(amountMl),
      loggedAtTime: timeStr,
    }).returning();

    const dayData = await getOrCreateDailyLog(user.id, date);

    return NextResponse.json({
      success: true,
      log: newLog,
      ...dayData,
    });
  } catch (error: any) {
    console.error("Error in /api/water POST:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const date = searchParams.get("date");

    const user = await getCurrentUser(req);

    if (id) {
      await db.delete(waterLogs).where(and(eq(waterLogs.id, id), eq(waterLogs.userId, user.id)));
    } else if (date) {
      await db.delete(waterLogs).where(and(eq(waterLogs.date, date), eq(waterLogs.userId, user.id)));
    }

    const dayData = await getOrCreateDailyLog(user.id, date!);

    return NextResponse.json({
      success: true,
      ...dayData,
    });
  } catch (error: any) {
    console.error("Error in /api/water DELETE:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
