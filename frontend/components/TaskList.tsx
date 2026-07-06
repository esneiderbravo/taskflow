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
    <form onSubmit={handleSubmit} className="card space-y-4 p-5">
      <div>
        <label htmlFor="task-title" className="block text-sm font-medium text-foreground">
          Title
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="input-field mt-2"
        />
      </div>
      <div>
        <label htmlFor="task-description" className="block text-sm font-medium text-foreground">
          Description <span className="font-normal text-foreground-faint">(optional)</span>
        </label>
        <input
          id="task-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add context or acceptance criteria"
          className="input-field mt-2"
        />
      </div>
      <button
        type="submit"
        disabled={submitting || !title.trim()}
        className="btn-primary"
      >
        {submitting ? "Adding…" : "Add task"}
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
        description="Add a task above to start tracking work."
      />
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="card flex flex-col gap-4 p-4 transition hover:border-accent/15 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground">{task.title}</h3>
            {task.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">{task.description}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:pt-0.5">
            <StatusBadge status={task.status} />
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              className="select-field"
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
