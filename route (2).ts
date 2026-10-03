import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userSettings } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { seedInitialData } from "@/lib/seed";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { option, userId, email, password } = body;

    // Ensure database is seeded if empty
    let [anyUser] = await db.select().from(users).limit(1);
    if (!anyUser) {
      await seedInitialData();
    }

    let targetUser: any = null;

    if (option === "option_a" || option === "A" || option === "alex") {
      // Option A: Alex Rivera (Master Discipline)
      const found = await db.select().from(users).where(eq(users.email, "alex@discipline.os")).limit(1);
      if (found.length > 0) {
        targetUser = found[0];
      } else {
        const first = await db.select().from(users).limit(1);
        targetUser = first[0];
      }
    } else if (option === "option_b" || option === "B" || option === "sarah") {
      // Option B: Sarah Chen (Pre-Med Scholar)
      const found = await db.select().from(users).where(eq(users.email, "sarah@discipline.os")).limit(1);
      if (found.length > 0) {
        targetUser = found[0];
      }
    } else if (option === "option_c" || option === "C" || option === "marcus") {
      // Option C: Marcus Vance (Productivity Starter)
      const found = await db.select().from(users).where(eq(users.email, "marcus@discipline.os")).limit(1);
      if (found.length > 0) {
        targetUser = found[0];
      }
    } else if (userId) {
      const found = await db.select().from(users).where(eq(users.id, Number(userId))).limit(1);
      if (found.length > 0) {
        targetUser = found[0];
      }
    } else if (email) {
      const found = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
      if (found.length > 0) {
        // Check password if provided
        if (password && found[0].password && found[0].password !== password) {
          return NextResponse.json({ success: false, error: "Invalid password. Try 'password123' or use Option A Quick Demo." }, { status: 401 });
        }
        targetUser = found[0];
      } else {
        return NextResponse.json({ success: false, error: "Account not found for this email. Try Option A Quick Login or Register." }, { status: 404 });
      }
    }

    if (!targetUser) {
      // Fallback to first user
      const [first] = await db.select().from(users).limit(1);
      targetUser = first;
    }

    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, targetUser.id)).limit(1);

    const res = NextResponse.json({
      success: true,
      message: `Logged in successfully as ${targetUser.name}`,
      user: targetUser,
      settings,
    });

    // Set cookie
    res.cookies.set({
      name: "life_manager_user_id",
      value: String(targetUser.id),
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false, // accessible to client for fast optimistic header
      sameSite: "lax",
    });

    return res;
  } catch (error: any) {
    console.error("Error in /api/auth/login:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
