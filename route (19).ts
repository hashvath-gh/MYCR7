import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // 'small' | 'big' | 'academic' | null

    const user = await getCurrentUser(req);

    let query = db.select().from(tasks).where(eq(tasks.userId, user.id));
    if (category) {
      query = db.select().from(tasks).where(and(eq(tasks.userId, user.id), eq(tasks.category, category)));
    }

    const allTasks = await query.orderBy(desc(tasks.id));

    return NextResponse.json({
      success: true,
      tasks: allTasks,
    });
  } catch (error: any) {
    console.error("Error in /api/tasks GET:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, title, description, priority, dueDate, dueTime, subject, progress, subtasks, notes } = body;

    const user = await getCurrentUser(req);

    const [newTask] = await db.insert(tasks).values({
      userId: user.id,
      category: category || "small",
      title: title || "Untitled Task",
      description: description || "",
      completed: false,
      priority: priority || "medium",
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      subject: subject || null,
      progress: progress !== undefined ? Number(progress) : 0,
      subtasks: typeof subtasks === "string" ? subtasks : JSON.stringify(subtasks || []),
      notes: notes || "",
    }).returning();

    return NextResponse.json({
      success: true,
      task: newTask,
    });
  } catch (error: any) {
    console.error("Error in /api/tasks POST:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, completed, title, description, priority, dueDate, dueTime, subject, progress, subtasks, notes, category } = body;

    const user = await getCurrentUser(req);

    const updateData: any = {};
    if (completed !== undefined) updateData.completed = Boolean(completed);
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (dueTime !== undefined) updateData.dueTime = dueTime;
    if (subject !== undefined) updateData.subject = subject;
    if (progress !== undefined) updateData.progress = Number(progress);
    if (subtasks !== undefined) updateData.subtasks = typeof subtasks === "string" ? subtasks : JSON.stringify(subtasks);
    if (notes !== undefined) updateData.notes = notes;
    if (category !== undefined) updateData.category = category;

    const [updatedTask] = await db.update(tasks)
      .set(updateData)
      .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
      .returning();

    return NextResponse.json({
      success: true,
      task: updatedTask,
    });
  } catch (error: any) {
    console.error("Error in /api/tasks PUT:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    const user = await getCurrentUser(req);
    await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, user.id)));

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("Error in /api/tasks DELETE:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
