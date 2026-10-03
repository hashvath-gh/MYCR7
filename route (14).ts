import { NextResponse } from "next/server";
import { db } from "@/db";
import { mealLogs } from "@/db/schema";
import { getOrCreateDailyLog } from "@/lib/day-helper";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, mealType, completed, foodItems, notes, healthRating } = body;

    const user = await getCurrentUser(req);

    // Find existing meal log
    const [existing] = await db.select().from(mealLogs)
      .where(and(eq(mealLogs.userId, user.id), eq(mealLogs.date, date), eq(mealLogs.mealType, mealType)))
      .limit(1);

    if (existing) {
      await db.update(mealLogs)
        .set({
          completed: completed !== undefined ? completed : existing.completed,
          foodItems: foodItems !== undefined ? foodItems : existing.foodItems,
          notes: notes !== undefined ? notes : existing.notes,
          healthRating: healthRating !== undefined ? healthRating : existing.healthRating,
        })
        .where(eq(mealLogs.id, existing.id));
    } else {
      await db.insert(mealLogs).values({
        userId: user.id,
        date,
        mealType,
        completed: Boolean(completed),
        foodItems: foodItems || "",
        notes: notes || "",
        healthRating: healthRating || 5,
      });
    }

    const dayData = await getOrCreateDailyLog(user.id, date);

    return NextResponse.json({
      success: true,
      ...dayData,
    });
  } catch (error: any) {
    console.error("Error in /api/meals POST:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
