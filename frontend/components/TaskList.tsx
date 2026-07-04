"use client";

import { FormEvent, useState } from "react";
import { Task, TaskStatus } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";

interface TaskFormProps {
  onSubmit: (title: string, description?: string) => Promise<void>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(title.trim(), description.trim() || undefined);
      setTitle("");
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-surface-border bg-surface-raised/50 p-5">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        aria-label="Task title"
        className="w-full rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-accent focus:outline-none"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        aria-label="Task description"
        className="w-full rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        disabled={submitting || !title.trim()}
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Adding…" : "Add Task"}
      </button>
    </form>
  );
}

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
}

export function TaskList({ tasks, onStatusChange }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        description="Add a task above to start tracking work on this project."
      />
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-start justify-between gap-4 rounded-xl border border-surface-border bg-surface-raised p-4 transition hover:border-surface-border/80"
        >
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-white">{task.title}</h3>
            {task.description && (
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{task.description}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <StatusBadge status={task.status} />
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              className="rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-sm text-slate-300"
              aria-label={`Change status for ${task.title}`}
            >
              <option value="todo">Ready</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </li>
      ))}
    </ul>
  );
}
