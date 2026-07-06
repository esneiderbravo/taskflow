import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TaskKanbanFromTasks } from "@/components/TaskKanban";
import { Task } from "@/lib/api";

const TASKS: Task[] = [
  {
    id: "task-1",
    title: "Define spec",
    description: "Write enriched user story",
    status: "todo",
    project_id: "proj-1",
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "task-2",
    title: "Implement API",
    description: null,
    status: "in_progress",
    project_id: "proj-1",
    created_at: "2026-01-16T10:00:00Z",
  },
  {
    id: "task-3",
    title: "Run tests",
    description: null,
    status: "done",
    project_id: "proj-1",
    created_at: "2026-01-17T10:00:00Z",
  },
];

describe("TaskKanban", () => {
  it("renders tasks in status columns", () => {
    render(<TaskKanbanFromTasks tasks={TASKS} onStatusChange={vi.fn()} />);

    expect(screen.getByText("Define spec")).toBeInTheDocument();
    expect(screen.getByText("Implement API")).toBeInTheDocument();
    expect(screen.getByText("Run tests")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Task board" })).toBeInTheDocument();
  });

  it("shows project name on cards when provided", () => {
    render(
      <TaskKanbanFromTasks
        tasks={TASKS}
        onStatusChange={vi.fn()}
        projectName="Task Dependencies"
      />
    );

    expect(screen.getAllByText("Task Dependencies").length).toBeGreaterThan(0);
  });

  it("moves task forward when next arrow is clicked", async () => {
    const onStatusChange = vi.fn().mockResolvedValue(undefined);

    render(<TaskKanbanFromTasks tasks={TASKS} onStatusChange={onStatusChange} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Move Define spec to In progress" })
    );

    expect(onStatusChange).toHaveBeenCalledWith("task-1", "in_progress");
  });

  it("renders empty state when there are no tasks", () => {
    render(
      <TaskKanbanFromTasks
        tasks={[]}
        onStatusChange={vi.fn()}
        emptyTitle="Board is empty"
        emptyDescription="Add your first task."
      />
    );

    expect(screen.getByText("Board is empty")).toBeInTheDocument();
    expect(screen.getByText("Add your first task.")).toBeInTheDocument();
  });
});
