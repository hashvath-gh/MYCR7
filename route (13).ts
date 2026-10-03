import { NextResponse } from "next/server";
import { db } from "@/db";
import { journalEntries } from "@/db/schema";
import { getOrCreateDailyLog } from "@/lib/day-helper";
import { getCurrentUser } from "@/lib/auth";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);

    const entries = await db.select().from(journalEntries)
      .where(eq(journalEntries.userId, user.id))
      .orderBy(desc(journalEntries.date))
      .limit(50);

    return NextResponse.json({
      success: true,
      entries,
    });
  } catch (error: any) {
    console.error("Error in /api/journal GET:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, mood, energyLevel, thoughts, gratitude, learned, wentWell, couldImprove } = body;

    const user = await getCurrentUser(req);

    const [existing] = await db.select().from(journalEntries)
      .where(and(eq(journalEntries.userId, user.id), eq(journalEntries.date, date)))
      .limit(1);

    let entry;
    if (existing) {
      const [updated] = await db.update(journalEntries)
        .set({
          mood: mood !== undefined ? mood : existing.mood,
          energyLevel: energyLevel !== undefined ? energyLevel : existing.energyLevel,
          thoughts: thoughts !== undefined ? thoughts : existing.thoughts,
          gratitude: gratitude !== undefined ? gratitude : existing.gratitude,
          learned: learned !== undefined ? learned : existing.learned,
          wentWell: wentWell !== undefined ? wentWell : existing.wentWell,
          couldImprove: couldImprove !== undefined ? couldImprove : existing.couldImprove,
          completed: true,
          updatedAt: new Date(),
        })
        .where(eq(journalEntries.id, existing.id))
        .returning();
      entry = updated;
    } else {
      const [inserted] = await db.insert(journalEntries).values({
        userId: user.id,
        date,
        mood: mood || "happy",
        energyLevel: energyLevel || 4,
        thoughts: thoughts || "",
        gratitude: gratitude || "",
        learned: learned || "",
        wentWell: wentWell || "",
        couldImprove: couldImprove || "",
        completed: true,
      }).returning();
      entry = inserted;
    }

    const dayData = await getOrCreateDailyLog(user.id, date);

    return NextResponse.json({
      success: true,
      journalEntry: entry,
      ...dayData,
    });
  } catch (error: any) {
    console.error("Error in /api/journal POST:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
