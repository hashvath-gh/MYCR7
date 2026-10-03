import { NextResponse } from "next/server";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { format } from "date-fns";
import { getOrCreateDailyLog } from "@/lib/day-helper";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id)).limit(1);
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const todayData = await getOrCreateDailyLog(user.id, todayStr);

    return NextResponse.json({
      success: true,
      user,
      settings,
      todayStr,
      todayData,
    });
  } catch (error: any) {
    console.error("Error in /api/init:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
