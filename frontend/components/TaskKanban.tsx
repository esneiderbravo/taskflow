"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Task, TaskStatus } from "@/lib/api";
import { ColumnState } from "@/hooks/useTasks";
import { formatDate } from "@/lib/format";
import { TaskIcon } from "@/components/TaskIcon";
import { TaskStatusIcon } from "@/components/TaskStatusIcon";

const COLUMN_META: Record<TaskStatus, { label: string; dotClass: string; textClass: string }> = {
  todo: { label: "Ready", dotClass: "bg-status-ready", textClass: "text-status-ready" },
  in_progress: {
    label: "In progress",
    dotClass: "bg-status-active",
    textClass: "text-status-active",
  },
  done: { label: "Done", dotClass: "bg-status-done", textClass: "text-status-done" },
};

const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "done"];

interface TaskCardProps {
  task: Task;
  projectName?: string;
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

function moveTarget(status: TaskStatus, direction: "back" | "forward"): TaskStatus | null {
  const index = STATUS_ORDER.indexOf(status);
  if (direction === "back" && index > 0) return STATUS_ORDER[index - 1];
  if (direction === "forward" && index < STATUS_ORDER.length - 1) return STATUS_ORDER[index + 1];
  return null;
}

function TaskCard({
  task,
  projectName,
  onStatusChange,
  onDragStart,
  onDragEnd,
  isDragging,
}: TaskCardProps) {
  const prevStatus = moveTarget(task.status, "back");
  const nextStatus = moveTarget(task.status, "forward");

  return (
    <article
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragEnd={onDragEnd}
      className={`kanban-card group ${isDragging ? "kanban-card-dragging" : ""}`}
      aria-grabbed={isDragging}
    >
      <div className="kanban-card-body">
        <span className="kanban-card-icon" aria-hidden="true">
          <TaskIcon size="md" />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          {projectName && (
            <p className="truncate text-[11px] font-medium uppercase tracking-wide text-accent">
              {projectName}
            </p>
          )}
          <h3 className="text-sm font-semibold leading-snug text-foreground">{task.title}</h3>
          {task.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-foreground-muted">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <footer className="kanban-card-footer">
        <time className="text-[11px] tabular-nums text-foreground-faint">
          {formatDate(task.created_at)}
        </time>
        {(prevStatus || nextStatus) && (
          <div className="flex items-center gap-0.5">
            {prevStatus && (
              <button
                type="button"
                onClick={() => onStatusChange(task.id, prevStatus)}
                className="kanban-move-btn"
                aria-label={`Move ${task.title} to ${COLUMN_META[prevStatus].label}`}
                title={`Move to ${COLUMN_META[prevStatus].label}`}
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </button>
            )}
            {nextStatus && (
              <button
                type="button"
                onClick={() => onStatusChange(task.id, nextStatus)}
                className="kanban-move-btn"
                aria-label={`Move ${task.title} to ${COLUMN_META[nextStatus].label}`}
                title={`Move to ${COLUMN_META[nextStatus].label}`}
              >
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </footer>
    </article>
  );
}

interface TaskKanbanProps {
  columns: Record<TaskStatus, ColumnState>;
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  onLoadMore: (status: TaskStatus) => void;
  onAddTask?: () => void;
  projectName?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function TaskKanban({
  columns,
  onStatusChange,
  onLoadMore,
  onAddTask,
  projectName,
  emptyTitle = "No tasks yet",
  emptyDescription = "Add a task to get started.",
}: TaskKanbanProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null);

  const totalTasks = STATUS_ORDER.reduce((sum, status) => sum + columns[status].total, 0);
  const initialLoading = STATUS_ORDER.every(
    (status) => columns[status].loading && columns[status].tasks.length === 0
  );

  const handleDrop = async (status: TaskStatus) => {
    if (!draggingId) return;
    const task = STATUS_ORDER.flatMap((s) => columns[s].tasks).find((t) => t.id === draggingId);
    if (!task || task.status === status) {
      setDraggingId(null);
      setDropTarget(null);
      return;
    }
    await onStatusChange(draggingId, status);
    setDraggingId(null);
    setDropTarget(null);
  };

  if (initialLoading) {
    return (
      <div className="kanban-board">
        {STATUS_ORDER.map((status) => (
          <div key={status} className="kanban-column">
            <div className="kanban-column-header">
              <div className="h-4 w-20 animate-shimmer rounded bg-surface-border/60" />
            </div>
            <div className="kanban-column-body">
              <div className="h-24 animate-shimmer rounded-lg bg-surface-border/60" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (totalTasks === 0) {
    return (
      <div className="rounded-xl border border-dashed border-surface-border bg-surface-raised px-6 py-12 text-center">
        <div className="mx-auto mb-4 icon-well-accent h-12 w-12 rounded-xl">
          <TaskIcon size="md" className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold text-foreground">{emptyTitle}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-foreground-muted">
          {emptyDescription}
        </p>
        {onAddTask && (
          <button type="button" onClick={onAddTask} className="btn-primary mt-6">
            Add task
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="kanban-board" role="region" aria-label="Task board">
      {STATUS_ORDER.map((status) => {
        const meta = COLUMN_META[status];
        const column = columns[status];
        const isTarget = dropTarget === status;
        const hasMore = column.tasks.length < column.total;

        return (
          <section
            key={status}
            className={`kanban-column ${isTarget ? "kanban-column-drop" : ""}`}
            aria-labelledby={`kanban-col-${status}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDropTarget(status);
            }}
            onDragLeave={() => setDropTarget((current) => (current === status ? null : current))}
            onDrop={(e) => {
              e.preventDefault();
              void handleDrop(status);
            }}
          >
            <header id={`kanban-col-${status}`} className="kanban-column-header">
              <TaskStatusIcon status={status} size="md" className={meta.textClass} />
              <span className="text-sm font-semibold text-foreground">{meta.label}</span>
              <span className="kanban-column-count">{column.total}</span>
            </header>

            <div className="kanban-column-body">
              {column.tasks.length === 0 ? (
                <p className="kanban-column-empty">Drop tasks here</p>
              ) : (
                column.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    projectName={projectName}
                    onStatusChange={onStatusChange}
                    onDragStart={setDraggingId}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDropTarget(null);
                    }}
                    isDragging={draggingId === task.id}
                  />
                ))
              )}

              {hasMore && (
                <button
                  type="button"
                  onClick={() => onLoadMore(status)}
                  disabled={column.loading}
                  className="btn-secondary w-full text-xs"
                >
                  {column.loading
                    ? "Loading…"
                    : `Load more (${column.total - column.tasks.length} remaining)`}
                </button>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/** Legacy wrapper for tests and simple usage with a flat task array. */
export function TaskKanbanFromTasks({
  tasks,
  onStatusChange,
  projectName,
  emptyTitle,
  emptyDescription,
}: {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  projectName?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const columns = STATUS_ORDER.reduce(
    (acc, status) => {
      const columnTasks = tasks.filter((task) => task.status === status);
      acc[status] = {
        tasks: columnTasks,
        total: columnTasks.length,
        loading: false,
      };
      return acc;
    },
    {} as Record<TaskStatus, ColumnState>
  );

  return (
    <TaskKanban
      columns={columns}
      onStatusChange={onStatusChange}
      onLoadMore={() => {}}
      projectName={projectName}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  );
}
