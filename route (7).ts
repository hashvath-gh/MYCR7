import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, badges, dailyLogs } from "@/db/schema";
import { getLevelInfo, LEVELS } from "@/lib/scoring";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);

    const userBadges = await db.select().from(badges).where(eq(badges.userId, user.id));
    const allLogs = await db.select().from(dailyLogs).where(eq(dailyLogs.userId, user.id));

    // Dynamic XP calculation: calculate based on total daily points earned + unlocked badge rewards
    const totalDailyScoreSum = allLogs.reduce((acc, l) => acc + Number(l.score), 0);
    const unlockedBadges = userBadges.filter(b => b.unlocked);
    const badgeBonusXp = unlockedBadges.reduce((acc, b) => acc + b.xpReward, 0);
    const totalXp = Math.round(totalDailyScoreSum + badgeBonusXp);

    const levelInfo = getLevelInfo(totalXp);

    // Update user level and XP if changed
    if (user.xp !== totalXp || user.level !== levelInfo.level) {
      await db.update(users).set({ xp: totalXp, level: levelInfo.level }).where(eq(users.id, user.id));
    }

    const perfectDaysCount = allLogs.filter(l => l.isPerfectDay || Number(l.score) >= 99).length;
    const daysTrackedCount = allLogs.length;

    const milestones = [
      { id: "m1", title: "7 Days of Discipline", target: 7, current: Math.min(7, daysTrackedCount), completed: daysTrackedCount >= 7, icon: "🌱", xp: 100 },
      { id: "m2", title: "30-Day Transformation", target: 30, current: Math.min(30, daysTrackedCount), completed: daysTrackedCount >= 30, icon: "🌿", xp: 300 },
      { id: "m3", title: "100-Day Discipline Titan", target: 100, current: Math.min(100, daysTrackedCount), completed: daysTrackedCount >= 100, icon: "🌳", xp: 1000 },
      { id: "m4", title: "500 Total Points Earned", target: 500, current: Math.min(500, Math.round(totalDailyScoreSum)), completed: totalDailyScoreSum >= 500, icon: "⚡", xp: 150 },
      { id: "m5", title: "1,000 Total Points Earned", target: 1000, current: Math.min(1000, Math.round(totalDailyScoreSum)), completed: totalDailyScoreSum >= 1000, icon: "🌟", xp: 350 },
      { id: "m6", title: "2,500 Total Points Earned", target: 2500, current: Math.min(2500, Math.round(totalDailyScoreSum)), completed: totalDailyScoreSum >= 2500, icon: "👑", xp: 750 },
      { id: "m7", title: "10 Perfect 100/100 Days", target: 10, current: Math.min(10, perfectDaysCount), completed: perfectDaysCount >= 10, icon: "💎", xp: 500 },
    ];

    return NextResponse.json({
      success: true,
      user: { ...user, xp: totalXp, level: levelInfo.level },
      levelInfo,
      allLevels: LEVELS,
      badges: userBadges,
      milestones,
      stats: {
        totalDailyScoreSum: Math.round(totalDailyScoreSum),
        daysTracked: daysTrackedCount,
        perfectDays: perfectDaysCount,
        unlockedBadgesCount: unlockedBadges.length,
      }
    });
  } catch (error: any) {
    console.error("Error in /api/challenges GET:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
