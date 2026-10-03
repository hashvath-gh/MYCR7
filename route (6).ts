import { NextResponse } from "next/server";
import { db } from "@/db";
import { dailyLogs } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, gte, lte, and } from "drizzle-orm";
import { format, startOfMonth, endOfMonth, parse } from "date-fns";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const monthStr = searchParams.get("month") || format(new Date(), "yyyy-MM");

    const user = await getCurrentUser(req);

    const monthDate = parse(monthStr, "yyyy-MM", new Date());
    const startStr = format(startOfMonth(monthDate), "yyyy-MM-dd");
    const endStr = format(endOfMonth(monthDate), "yyyy-MM-dd");

    const logs = await db.select().from(dailyLogs)
      .where(and(eq(dailyLogs.userId, user.id), gte(dailyLogs.date, startStr), lte(dailyLogs.date, endStr)));

    const daysMap: Record<string, any> = {};
    for (const log of logs) {
      const score = Number(log.score);
      let status: "excellent" | "good" | "average" | "low" = "low";
      if (score >= 85) status = "excellent";
      else if (score >= 70) status = "good";
      else if (score >= 50) status = "average";

      daysMap[log.date] = {
        date: log.date,
        score,
        status,
        sleepHours: Number((log.totalSleepMinutes / 60).toFixed(1)),
        waterMl: log.waterMl,
        fitnessMinutes: log.fitnessMinutes,
        academicMinutes: log.academicMinutes,
        noOil: log.noOilCompleted,
        noCaffeine: log.noCaffeineCompleted,
        isPerfectDay: log.isPerfectDay || score >= 99,
      };
    }

    return NextResponse.json({
      success: true,
      month: monthStr,
      days: daysMap,
    });
  } catch (error: any) {
    console.error("Error in /api/calendar GET:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
