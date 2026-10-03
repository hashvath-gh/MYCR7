import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users, userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id)).limit(1);
    
    // Fetch all available accounts for quick switcher
    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      avatar: users.avatar,
      title: users.title,
      level: users.level,
      xp: users.xp,
      currentStreak: users.currentStreak,
    }).from(users);

    return NextResponse.json({
      success: true,
      user,
      settings,
      availableUsers: allUsers,
    });
  } catch (error: any) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
