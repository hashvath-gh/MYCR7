"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Calendar,
  AlertCircle,
  GraduationCap,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { TaskData } from "@/types";

interface TasksHubProps {
  tasks: TaskData[];
  onAddTask: (task: {
    category: "small" | "big" | "academic";
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high" | "urgent";
    dueDate?: string;
    dueTime?: string;
    subject?: string;
    progress?: number;
    subtasks?: Array<{ id: string; title: string; completed: boolean }>;
    notes?: string;
  }) => Promise<void>;
  onUpdateTask: (task: {
    id: number;
    completed?: boolean;
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high" | "urgent";
    dueDate?: string;
    dueTime?: string;
    subject?: string;
    progress?: number;
    subtasks?: Array<{ id: string; title: string; completed: boolean }>;
    notes?: string;
  }) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
}

export function TasksHub({ tasks, onAddTask, onUpdateTask, onDeleteTask }: TasksHubProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "small" | "big" | "academic">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");

  // Add Task Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalCategory, setModalCategory] = useState<"small" | "big" | "academic">("small");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [progress, setProgress] = useState(0);
  const [subtasksList, setSubtasksList] = useState<Array<{ id: string; title: string; completed: boolean }>>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [notes, setNotes] = useState("");

  const handleOpenAdd = (cat?: "small" | "big" | "academic") => {
    setModalCategory(cat || (activeCategory !== "all" ? activeCategory : "small"));
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setDueTime("");
    setSubject("Computer Science");
    setProgress(0);
    setSubtasksList([]);
    setNotes("");
    setShowAddModal(true);
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasksList([
      ...subtasksList,
      { id: Date.now().toString(), title: newSubtaskTitle.trim(), completed: false },
    ]);
    setNewSubtaskTitle("");
  };

  const handleToggleSubtaskInModal = (id: string) => {
    setSubtasksList(
      subtasksList.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleRemoveSubtaskInModal = (id: string) => {
    setSubtasksList(subtasksList.filter((st) => st.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onAddTask({
      category: modalCategory,
      title: title.trim(),
      description,
      priority,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      subject: modalCategory === "academic" ? subject : undefined,
      progress: modalCategory !== "small" ? progress : 0,
      subtasks: subtasksList,
      notes,
    });

    setShowAddModal(false);
  };

  // Toggle subtask in main list
  const handleToggleTaskSubtask = async (task: TaskData, subtaskId: string) => {
    const parsedSubtasks = typeof task.subtasks === "string" ? JSON.parse(task.subtasks || "[]") : task.subtasks || [];
    const updated = parsedSubtasks.map((st: any) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    const completedCount = updated.filter((st: any) => st.completed).length;
    const autoProgress = updated.length ? Math.round((completedCount / updated.length) * 100) : (task.progress ?? 0);

    await onUpdateTask({
      id: task.id,
      subtasks: updated,
      progress: autoProgress,
      completed: autoProgress === 100 ? true : task.completed,
    });
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (activeCategory !== "all" && t.category !== activeCategory) return false;
    if (statusFilter === "active" && t.completed) return false;
    if (statusFilter === "completed" && !t.completed) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = (t.description || "").toLowerCase().includes(q);
      const matchSubj = (t.subject || "").toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSubj) return false;
    }
    return true;
  });

  const smallCount = tasks.filter((t) => t.category === "small" && !t.completed).length;
  const bigCount = tasks.filter((t) => t.category === "big" && !t.completed).length;
  const academicCount = tasks.filter((t) => t.category === "academic" && !t.completed).length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Execution Engine</div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Discipline Task System</h1>
            <p className="text-xs text-slate-400">Small Things (10m) • Big Projects • Academic Assignments</p>
          </div>
        </div>

        <button
          onClick={() => handleOpenAdd()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveCategory("all")}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            activeCategory === "all"
              ? "bg-slate-800 text-white border-slate-600 shadow-md"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider">All Tasks</div>
          <div className="text-xl font-black text-white mt-0.5">{tasks.length}</div>
        </button>

        <button
          onClick={() => setActiveCategory("small")}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            activeCategory === "small"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-emerald-400">
            <span>🟢 Small Things</span>
            <span>{smallCount} active</span>
          </div>
          <div className="text-xs font-semibold text-slate-300 mt-1">Quick 10m Tasks</div>
        </button>

        <button
          onClick={() => setActiveCategory("big")}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            activeCategory === "big"
              ? "bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-rose-400">
            <span>🔴 Big Things</span>
            <span>{bigCount} active</span>
          </div>
          <div className="text-xs font-semibold text-slate-300 mt-1">Projects & Milestones</div>
        </button>

        <button
          onClick={() => setActiveCategory("academic")}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            activeCategory === "academic"
              ? "bg-violet-500/20 text-violet-300 border-violet-500/50 shadow-md"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-violet-400">
            <span>📚 Academic / Homework</span>
            <span>{academicCount} active</span>
          </div>
          <div className="text-xs font-semibold text-slate-300 mt-1">Assignments & Labs</div>
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel rounded-2xl p-3 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search tasks, subjects, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
          {(["all", "active", "completed"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl capitalize transition cursor-pointer ${
                statusFilter === st
                  ? "bg-slate-800 text-white border border-slate-700"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-3xl border border-slate-800 text-slate-400 text-xs">
          <CheckCircle2 className="w-10 h-10 text-emerald-400/40 mx-auto mb-2" />
          <p className="font-bold text-slate-300">No tasks found matching your filter criteria.</p>
          <button
            onClick={() => handleOpenAdd()}
            className="mt-3 px-4 py-2 bg-emerald-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
          >
            Create Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const subtasks = typeof task.subtasks === "string" ? JSON.parse(task.subtasks || "[]") : task.subtasks || [];
            return (
              <div
                key={task.id}
                className={`p-5 rounded-3xl border transition flex flex-col justify-between ${
                  task.completed
                    ? "bg-slate-900/40 border-slate-800/60 opacity-60"
                    : "glass-panel border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  {/* Category Pill & Priority Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        task.category === "academic"
                          ? "bg-violet-500/15 text-violet-300 border border-violet-500/30"
                          : task.category === "big"
                          ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                          : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {task.category === "academic"
                        ? `📚 ${task.subject || "Academic"}`
                        : task.category === "big"
                        ? "🔴 Big Project"
                        : "🟢 Small Thing"}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        task.priority === "urgent"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : task.priority === "high"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* Title & Checkbox */}
                  <div className="flex items-start gap-3 my-2">
                    <button
                      onClick={() => onUpdateTask({ id: task.id, completed: !task.completed })}
                      className="mt-0.5 shrink-0 cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-emerald-400 transition" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h4
                        className={`text-sm font-bold ${
                          task.completed ? "line-through text-slate-500" : "text-white"
                        }`}
                      >
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar for Big & Academic Tasks */}
                  {task.category !== "small" && (
                    <div className="my-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>Progress</span>
                        <span className="font-bold text-white">{task.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            task.category === "academic"
                              ? "bg-violet-500"
                              : "bg-gradient-to-r from-rose-500 to-amber-500"
                          }`}
                          style={{ width: `${task.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Subtasks List */}
                  {subtasks.length > 0 && (
                    <div className="space-y-1.5 my-3 pl-2 border-l-2 border-slate-800">
                      {subtasks.map((st: any) => (
                        <div
                          key={st.id}
                          onClick={() => handleToggleTaskSubtask(task, st.id)}
                          className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer"
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] font-black ${
                              st.completed
                                ? "bg-emerald-500 border-emerald-500 text-slate-950"
                                : "border-slate-700 bg-slate-900 text-transparent"
                            }`}
                          >
                            ✓
                          </span>
                          <span className={st.completed ? "line-through text-slate-500" : ""}>
                            {st.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: Due date & delete */}
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    {task.dueDate && (
                      <span className="flex items-center gap-1 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{task.dueDate} {task.dueTime ? `@ ${task.dueTime}` : ""}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">Create New Task</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Task Category</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setModalCategory("small")}
                    className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      modalCategory === "small"
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    🟢 Small Thing
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalCategory("big")}
                    className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      modalCategory === "big"
                        ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    🔴 Big Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalCategory("academic")}
                    className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      modalCategory === "academic"
                        ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    📚 Academic
                  </button>
                </div>
              </div>

              {modalCategory === "academic" && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">College Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Computer Networks, Mathematics, Organic Chemistry"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Reply to message / Finish Lab 4 / Complete thesis draft"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description / Details</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Context, specifications, links..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Due Time</label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Subtasks Builder */}
              {modalCategory !== "small" && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Subtasks / Checklist</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      placeholder="Add subtask step..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSubtask())}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubtask}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>

                  {subtasksList.length > 0 && (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {subtasksList.map((st) => (
                        <div
                          key={st.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                        >
                          <span className="text-slate-300">{st.title}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubtaskInModal(st.id)}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition cursor-pointer"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
