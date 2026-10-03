import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userSettings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id)).limit(1);

    return NextResponse.json({
      success: true,
      user,
      settings,
    });
  } catch (error: any) {
    console.error("Error in /api/settings GET:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      sleepTargetHours,
      waterTargetMl,
      fitnessTargetMin,
      caffeineCutoffTime,
      academicTargetMin,
      musicTargetMin,
      theme,
      unitSystem,
      enableReminders,
      reminderSettings,
      userName,
      userTitle,
    } = body;

    const user = await getCurrentUser(req);

    if (userName || userTitle) {
      await db.update(users)
        .set({
          name: userName || user.name,
          title: userTitle || user.title,
        })
        .where(eq(users.id, user.id));
    }

    const [existingSettings] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id)).limit(1);

    const updateData: any = { updatedAt: new Date() };
    if (sleepTargetHours !== undefined) updateData.sleepTargetHours = String(sleepTargetHours);
    if (waterTargetMl !== undefined) updateData.waterTargetMl = Number(waterTargetMl);
    if (fitnessTargetMin !== undefined) updateData.fitnessTargetMin = Number(fitnessTargetMin);
    if (caffeineCutoffTime !== undefined) updateData.caffeineCutoffTime = caffeineCutoffTime;
    if (academicTargetMin !== undefined) updateData.academicTargetMin = Number(academicTargetMin);
    if (musicTargetMin !== undefined) updateData.musicTargetMin = Number(musicTargetMin);
    if (theme !== undefined) updateData.theme = theme;
    if (unitSystem !== undefined) updateData.unitSystem = unitSystem;
    if (enableReminders !== undefined) updateData.enableReminders = Boolean(enableReminders);
    if (reminderSettings !== undefined) updateData.reminderSettings = typeof reminderSettings === "string" ? reminderSettings : JSON.stringify(reminderSettings);

    let updated;
    if (existingSettings) {
      [updated] = await db.update(userSettings)
        .set(updateData)
        .where(eq(userSettings.id, existingSettings.id))
        .returning();
    } else {
      [updated] = await db.insert(userSettings).values({
        userId: user.id,
        ...updateData,
      }).returning();
    }

    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (error: any) {
    console.error("Error in /api/settings PUT:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
