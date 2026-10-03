import { NextResponse } from "next/server";
import { db } from "@/db";
import { dailyLogs } from "@/db/schema";
import { getOrCreateDailyLog } from "@/lib/day-helper";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, habitKey, completed } = body;

    const user = await getCurrentUser(req);

    let [dayLog] = await db.select().from(dailyLogs).where(and(eq(dailyLogs.userId, user.id), eq(dailyLogs.date, date))).limit(1);
    if (!dayLog) {
      await getOrCreateDailyLog(user.id, date);
    }

    const updateFields: any = { updatedAt: new Date() };
    if (habitKey === "noOil") {
      updateFields.noOilCompleted = Boolean(completed);
    } else if (habitKey === "noCaffeine") {
      updateFields.noCaffeineCompleted = Boolean(completed);
    }

    await db.update(dailyLogs)
      .set(updateFields)
      .where(and(eq(dailyLogs.userId, user.id), eq(dailyLogs.date, date)));

    const dayData = await getOrCreateDailyLog(user.id, date);

    return NextResponse.json({
      success: true,
      ...dayData,
    });
  } catch (error: any) {
    console.error("Error in /api/habits POST:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
