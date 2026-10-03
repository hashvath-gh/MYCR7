import { NextResponse } from "next/server";
import { db } from "@/db";
import { dailyLogs, userSettings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, gte, lte, and } from "drizzle-orm";
import { format, subDays, parseISO } from "date-fns";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30d";
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");

    const user = await getCurrentUser(req);

    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id)).limit(1);
    const sleepTargetHours = settings ? Number(settings.sleepTargetHours) : 7.5;
    const waterTargetMl = settings ? settings.waterTargetMl : 4000;
    const fitnessTargetMin = settings ? settings.fitnessTargetMin : 30;

    let daysToFetch = 30;
    if (range === "7d") daysToFetch = 7;
    else if (range === "30d") daysToFetch = 30;
    else if (range === "3m") daysToFetch = 90;
    else if (range === "6m") daysToFetch = 180;
    else if (range === "1y") daysToFetch = 365;
    else if (range === "all") daysToFetch = 1000;

    const startDateStr = fromDate || format(subDays(new Date(), daysToFetch - 1), "yyyy-MM-dd");
    const endDateStr = toDate || format(new Date(), "yyyy-MM-dd");

    // Fetch daily logs in range for current user
    const logs = await db.select().from(dailyLogs)
      .where(and(eq(dailyLogs.userId, user.id), gte(dailyLogs.date, startDateStr), lte(dailyLogs.date, endDateStr)))
      .orderBy(dailyLogs.date);

    // Fetch all-time logs for global stats
    const allLogs = await db.select().from(dailyLogs).where(eq(dailyLogs.userId, user.id)).orderBy(dailyLogs.date);

    // Transform daily logs for charts
    const chartData = logs.map(l => {
      const sleepHours = Number((l.totalSleepMinutes / 60).toFixed(1));
      const score = Number(l.score);
      return {
        date: l.date,
        displayDate: format(parseISO(l.date), "MMM d"),
        dayOfWeek: format(parseISO(l.date), "EEE"),
        score,
        sleepScore: Number(l.sleepScore),
        sleepHours,
        sleepTargetHours,
        waterMl: l.waterMl,
        waterTargetMl,
        waterScore: Number(l.waterScore),
        fitnessMinutes: l.fitnessMinutes,
        fitnessTargetMin,
        fitnessScore: Number(l.fitnessScore),
        foodScore: Number(l.foodScore),
        noOilScore: Number(l.noOilScore),
        noCaffeineScore: Number(l.noCaffeineScore),
        academicMinutes: l.academicMinutes,
        academicScore: Number(l.academicScore),
        musicMinutes: l.musicMinutes,
        musicScore: Number(l.musicScore),
        journalScore: Number(l.journalScore),
        isPerfectDay: l.isPerfectDay,
      };
    });

    const validScores = chartData.map(c => c.score);
    const avgScore = validScores.length ? Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)) : 0;
    const bestScore = validScores.length ? Math.max(...validScores) : 0;
    
    const sleepHoursList = chartData.map(c => c.sleepHours).filter(h => h > 0);
    const avgSleepHours = sleepHoursList.length ? Number((sleepHoursList.reduce((a, b) => a + b, 0) / sleepHoursList.length).toFixed(1)) : 0;

    const waterList = chartData.map(c => c.waterMl);
    const avgWaterMl = waterList.length ? Math.round(waterList.reduce((a, b) => a + b, 0) / waterList.length) : 0;
    const bestWaterMl = waterList.length ? Math.max(...waterList) : 0;

    const totalWorkoutMinutes = chartData.reduce((acc, c) => acc + c.fitnessMinutes, 0);
    const totalAcademicMinutes = chartData.reduce((acc, c) => acc + c.academicMinutes, 0);
    const totalMusicMinutes = chartData.reduce((acc, c) => acc + c.musicMinutes, 0);
    const totalWaterConsumed = chartData.reduce((acc, c) => acc + c.waterMl, 0);
    const perfectDaysCount = chartData.filter(c => c.isPerfectDay || c.score >= 99).length;

    // Category radar / averages
    const categoryAverages = {
      sleep: { earned: avg(chartData.map(c => c.sleepScore)), max: 20, pct: Math.round((avg(chartData.map(c => c.sleepScore)) / 20) * 100) },
      noOil: { earned: avg(chartData.map(c => c.noOilScore)), max: 5, pct: Math.round((avg(chartData.map(c => c.noOilScore)) / 5) * 100) },
      noCaffeine: { earned: avg(chartData.map(c => c.noCaffeineScore)), max: 5, pct: Math.round((avg(chartData.map(c => c.noCaffeineScore)) / 5) * 100) },
      food: { earned: avg(chartData.map(c => c.foodScore)), max: 10, pct: Math.round((avg(chartData.map(c => c.foodScore)) / 10) * 100) },
      fitness: { earned: avg(chartData.map(c => c.fitnessScore)), max: 10, pct: Math.round((avg(chartData.map(c => c.fitnessScore)) / 10) * 100) },
      water: { earned: avg(chartData.map(c => c.waterScore)), max: 10, pct: Math.round((avg(chartData.map(c => c.waterScore)) / 10) * 100) },
      music: { earned: avg(chartData.map(c => c.musicScore)), max: 10, pct: Math.round((avg(chartData.map(c => c.musicScore)) / 10) * 100) },
      academic: { earned: avg(chartData.map(c => c.academicScore)), max: 15, pct: Math.round((avg(chartData.map(c => c.academicScore)) / 15) * 100) },
      journal: { earned: avg(chartData.map(c => c.journalScore)), max: 5, pct: Math.round((avg(chartData.map(c => c.journalScore)) / 5) * 100) },
    };

    // Generate Smart Personal Insights from logged data
    const insights: Array<{ title: string; text: string; type: "positive" | "warning" | "neutral"; icon: string }> = [];

    if (avgSleepHours >= 7.0 && avgSleepHours <= 8.5) {
      insights.push({
        title: "Optimal Sleep Architecture",
        text: `You averaged ${avgSleepHours} hours of sleep in this period, consistently within your optimal 7–8h restorative window.`,
        type: "positive",
        icon: "😴",
      });
    } else if (avgSleepHours > 0 && avgSleepHours < 7.0) {
      insights.push({
        title: "Sleep Deficit Alert",
        text: `Your average sleep was ${avgSleepHours} hours. Aim to add 30-45 minutes to recharge cognitive stamina.`,
        type: "warning",
        icon: "😴",
      });
    }

    const waterDaysHit = chartData.filter(c => c.waterMl >= waterTargetMl).length;
    const waterHitRate = chartData.length ? Math.round((waterDaysHit / chartData.length) * 100) : 0;
    if (waterHitRate >= 70) {
      insights.push({
        title: "Elite Hydration Consistency",
        text: `You met your ${waterTargetMl}ml water goal on ${waterDaysHit} of ${chartData.length} days (${waterHitRate}% compliance).`,
        type: "positive",
        icon: "💧",
      });
    } else {
      insights.push({
        title: "Hydration Opportunity",
        text: `You averaged ${(avgWaterMl / 1000).toFixed(1)}L water daily. Increasing your morning intake can boost focus.`,
        type: "neutral",
        icon: "💧",
      });
    }

    const fitnessDays = chartData.filter(c => c.fitnessMinutes >= fitnessTargetMin).length;
    insights.push({
      title: "Physical Conditioning",
      text: `You logged active workouts on ${fitnessDays} days, totaling ${Math.round(totalWorkoutMinutes / 60 * 10) / 10} hours of training.`,
      type: "positive",
      icon: "🏋️",
    });

    insights.push({
      title: "Academic & Music Output",
      text: `Logged ${Math.round(totalAcademicMinutes / 60 * 10) / 10} hours of academic study and ${Math.round(totalMusicMinutes / 60 * 10) / 10} hours of music practice.`,
      type: "positive",
      icon: "📚",
    });

    if (chartData.length >= 7) {
      const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2));
      const secondHalf = chartData.slice(Math.floor(chartData.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b.score, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b.score, 0) / secondHalf.length;
      const diff = Math.round(secondAvg - firstAvg);
      if (diff > 0) {
        insights.push({
          title: "Upward Score Momentum",
          text: `Your average daily score climbed by +${diff} points from ${Math.round(firstAvg)} to ${Math.round(secondAvg)}/100!`,
          type: "positive",
          icon: "📈",
        });
      }
    }

    const allScores = allLogs.map(l => Number(l.score));
    const globalStats = {
      totalDaysTracked: allLogs.length,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      allTimeAvgScore: allScores.length ? Number((allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)) : 0,
      allTimeBestScore: allScores.length ? Math.max(...allScores) : 0,
      allTimeWorkoutMinutes: allLogs.reduce((acc, l) => acc + l.fitnessMinutes, 0),
      allTimeWaterMl: allLogs.reduce((acc, l) => acc + l.waterMl, 0),
      allTimeAcademicMinutes: allLogs.reduce((acc, l) => acc + l.academicMinutes, 0),
      allTimeMusicMinutes: allLogs.reduce((acc, l) => acc + l.musicMinutes, 0),
      perfectDaysTotal: allLogs.filter(l => l.isPerfectDay || Number(l.score) >= 99).length,
    };

    return NextResponse.json({
      success: true,
      range,
      chartData,
      summary: {
        avgScore,
        bestScore,
        avgSleepHours,
        avgWaterMl,
        bestWaterMl,
        totalWorkoutMinutes,
        totalAcademicMinutes,
        totalMusicMinutes,
        totalWaterConsumed,
        perfectDaysCount,
      },
      categoryAverages,
      insights,
      globalStats,
    });
  } catch (error: any) {
    console.error("Error in /api/analytics GET:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1));
}
