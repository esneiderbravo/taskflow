"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/lib/api";
import { ColumnState } from "@/hooks/useTasks";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

const COLUMN_META: Record<TaskStatus, { label: string; dotClass: string }> = {
  todo: { label: "Ready", dotClass: "bg-status-ready" },
  in_progress: { label: "In progress", dotClass: "bg-status-active" },
  done: { label: "Done", dotClass: "bg-status-done" },
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
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          className="mt-0.5 shrink-0 cursor-grab text-icon opacity-0 transition group-hover:opacity-100 hover:text-accent active:cursor-grabbing"
          aria-label={`Drag ${task.title}`}
          tabIndex={-1}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="9" cy="7" r="1.25" />
            <circle cx="15" cy="7" r="1.25" />
            <circle cx="9" cy="12" r="1.25" />
            <circle cx="15" cy="12" r="1.25" />
            <circle cx="9" cy="17" r="1.25" />
            <circle cx="15" cy="17" r="1.25" />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          {projectName && (
            <p className="mb-1 truncate text-xs font-medium text-accent">{projectName}</p>
          )}
          <h3 className="text-sm font-medium leading-snug text-foreground">{task.title}</h3>
          {task.description && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-foreground-muted">
              {task.description}
            </p>
          )}
          <p className="mt-2 text-xs text-foreground-muted">{formatDate(task.created_at)}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-surface-border pt-3">
        <StatusBadge status={task.status} />
        <div className="flex items-center gap-1">
          {prevStatus && (
            <button
              type="button"
              onClick={() => onStatusChange(task.id, prevStatus)}
              className="kanban-move-btn"
              aria-label={`Move ${task.title} to ${COLUMN_META[prevStatus].label}`}
              title={`Move to ${COLUMN_META[prevStatus].label}`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
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
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      </div>
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
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 5.25v2.25m0 0H6m4.5 0h9.75A2.25 2.25 0 0 1 22.5 9.75v9.75A2.25 2.25 0 0 1 20.25 21H6A2.25 2.25 0 0 1 3.75 18.75V9.75A2.25 2.25 0 0 1 6 7.5h4.5Z" />
          </svg>
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
              <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} aria-hidden="true" />
              <span className="text-sm font-semibold text-foreground">{meta.label}</span>
              <span className="ml-auto text-xs font-medium tabular-nums text-foreground-muted">
                {column.total}
              </span>
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
