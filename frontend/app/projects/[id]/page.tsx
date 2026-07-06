"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { AddTaskModal } from "@/components/AddTaskModal";
import { TaskKanban } from "@/components/TaskKanban";
import { ProjectOverview } from "@/components/ProjectOverview";
import { SearchField } from "@/components/ui/SearchField";
import { ProjectDetailSkeleton } from "@/components/ui/Skeleton";
import { useProjectBoard } from "@/hooks/useTasks";
import { api, ProjectDetail } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const {
    columns,
    search,
    setSearch,
    loading,
    error,
    createTask,
    updateTaskStatus,
    loadMore,
  } = useProjectBoard(id);

  useEffect(() => {
    setProjectLoading(true);
    api.getProject(id)
      .then(setProject)
      .catch((err) => setProjectError(err instanceof Error ? err.message : "Project not found"))
      .finally(() => setProjectLoading(false));
  }, [id]);

  const refreshProjectCounts = () => {
    api.getProject(id).then(setProject).catch(() => undefined);
  };

  const handleStatusChange = async (taskId: string, status: Parameters<typeof updateTaskStatus>[1]) => {
    await updateTaskStatus(taskId, status);
    refreshProjectCounts();
  };

  const handleCreateTask = async (title: string, description?: string) => {
    await createTask(title, description);
    refreshProjectCounts();
  };

  if (projectError) {
    return (
      <div className="space-y-6 animate-fade-up">
        <div className="alert-danger p-6">
          <h2 className="font-semibold text-status-danger">Project not found</h2>
          <p className="mt-2 text-sm text-foreground-muted">{projectError}</p>
        </div>
      </div>
    );
  }

  if (projectLoading || !project || loading) {
    return <ProjectDetailSkeleton />;
  }

  const totalTasks =
    project.task_counts.todo + project.task_counts.in_progress + project.task_counts.done;

  return (
    <div className="space-y-10 animate-fade-up">
      <ProjectOverview project={project} />

      {error && (
        <div className="alert-danger p-4 text-sm text-status-danger">
          {error}
        </div>
      )}

      <section aria-labelledby="board-heading" className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="board-heading" className="section-heading">
              Task board
            </h2>
            {totalTasks > 0 && (
              <p className="mt-1 section-label">
                {totalTasks} tasks · {search ? "filtered results" : "latest per column"}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {totalTasks > 0 && (
              <div className="w-full sm:w-56">
                <SearchField
                  label="Search tasks"
                  value={search}
                  onChange={setSearch}
                  placeholder="Search tasks…"
                />
              </div>
            )}
            <button type="button" onClick={() => setAddTaskOpen(true)} className="btn-primary shrink-0">
              Add task
            </button>
          </div>
        </div>
        <TaskKanban
          columns={columns}
          onStatusChange={handleStatusChange}
          onLoadMore={loadMore}
          onAddTask={() => setAddTaskOpen(true)}
        />
      </section>

      <AddTaskModal
        open={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
