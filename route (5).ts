import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { seedUserData } from "@/lib/seed";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, title, avatar } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 });
    }

    const emailNorm = email.toLowerCase().trim();

    // Check existing
    const existing = await db.select().from(users).where(eq(users.email, emailNorm)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "An account with this email already exists. Please log in." }, { status: 400 });
    }

    const [newUser] = await db.insert(users).values({
      name: name.trim(),
      email: emailNorm,
      password: password || "password123",
      title: title || "Discipline Architect",
      avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      level: 1,
      xp: 150,
      currentStreak: 1,
      longestStreak: 1,
    }).returning();

    // Seed personalized user settings, badges, tasks, and historical data
    await seedUserData(newUser.id, "alex");

    const res = NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: newUser,
    });

    res.cookies.set({
      name: "life_manager_user_id",
      value: String(newUser.id),
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: false,
      sameSite: "lax",
    });

    return res;
  } catch (error: any) {
    console.error("Error in /api/auth/register:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
