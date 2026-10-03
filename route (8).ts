import { NextResponse } from "next/server";
import { format } from "date-fns";
import { getOrCreateDailyLog } from "@/lib/day-helper";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || format(new Date(), "yyyy-MM-dd");

    const user = await getCurrentUser(req);
    const dayData = await getOrCreateDailyLog(user.id, date);

    return NextResponse.json({
      success: true,
      user,
      date,
      ...dayData,
    });
  } catch (error: any) {
    console.error("Error in /api/day:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
