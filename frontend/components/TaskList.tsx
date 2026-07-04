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
    <form onSubmit={handleSubmit} className="card space-y-3 p-5">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        aria-label="Task title"
        className="input-field"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        aria-label="Task description"
        className="input-field"
      />
      <div className="pt-1">
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="btn-primary"
        >
          {submitting ? "Adding…" : "Add task"}
        </button>
      </div>
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
          className="card flex flex-col gap-4 p-4 transition hover:bg-surface-hover sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-cream">{task.title}</h3>
            {task.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-cream-muted">{task.description}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:pt-0.5">
            <StatusBadge status={task.status} />
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              className="rounded-md border border-surface-border bg-ink px-2.5 py-1.5 font-mono text-xs text-cream-muted"
              aria-label={`Change status for ${task.title}`}
            >
              <option value="todo">Ready</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </li>
      ))}
    </ul>
  );
}
