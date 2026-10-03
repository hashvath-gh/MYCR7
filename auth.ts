import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { seedInitialData } from "./seed";

export async function getCurrentUser(req?: Request) {
  let userId: number | null = null;

  // 1. Check custom header x-user-id
  if (req) {
    const headerUserId = req.headers.get("x-user-id");
    if (headerUserId && !isNaN(Number(headerUserId))) {
      userId = Number(headerUserId);
    }
  }

  // 2. Check cookies if not found in header
  if (!userId) {
    try {
      const cookieStore = await cookies();
      const cookieUserId = cookieStore.get("life_manager_user_id")?.value;
      if (cookieUserId && !isNaN(Number(cookieUserId))) {
        userId = Number(cookieUserId);
      }
    } catch {
      // Cookies might not be available in some contexts
    }
  }

  // 3. If userId found, fetch from db
  if (userId) {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (user) {
      return user;
    }
  }

  // 4. Fallback: get first user, or seed if empty
  let [firstUser] = await db.select().from(users).limit(1);
  if (!firstUser) {
    firstUser = await seedInitialData();
  }

  return firstUser;
}
