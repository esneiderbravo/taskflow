"use client";

import Link from "next/link";
import { use } from "react";
import { useEffect, useState } from "react";
import { TaskForm, TaskList } from "@/components/TaskList";
import { TaskProgress } from "@/components/TaskProgress";
import { ProjectDetailSkeleton } from "@/components/ui/Skeleton";
import { useTasks } from "@/hooks/useTasks";
import { api, Project } from "@/lib/api";
import { formatDate } from "@/lib/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const { tasks, loading, error, createTask, updateTaskStatus } = useTasks(id);

  useEffect(() => {
    setProjectLoading(true);
    api.getProject(id)
      .then(setProject)
      .catch((err) => setProjectError(err instanceof Error ? err.message : "Project not found"))
      .finally(() => setProjectLoading(false));
  }, [id]);

  if (projectError) {
    return (
      <div className="space-y-6 animate-fade-up">
        <Link href="/" className="back-link">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          All projects
        </Link>
        <div className="card border-status-danger/20 bg-red-50 p-6">
          <h2 className="font-semibold text-status-danger">Project not found</h2>
          <p className="mt-2 text-sm text-foreground-muted">{projectError}</p>
        </div>
      </div>
    );
  }

  if (projectLoading || !project || loading) {
    return <ProjectDetailSkeleton />;
  }

  return (
    <div className="space-y-10 animate-fade-up">
      <header className="space-y-4">
        <Link href="/" className="back-link">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          All projects
        </Link>
        <div>
          <h1 className="page-title">{project.name}</h1>
          <p className="mt-2 font-mono text-xs text-foreground-faint">
            Created {formatDate(project.created_at)}
          </p>
        </div>
      </header>

      <TaskProgress tasks={tasks} />

      {error && (
        <div className="card border-status-danger/20 bg-red-50 p-4 text-sm text-status-danger">
          {error}
        </div>
      )}

      <section aria-labelledby="add-task-heading" className="space-y-4">
        <h2 id="add-task-heading" className="section-heading">
          Add task
        </h2>
        <TaskForm onSubmit={async (title, description) => { await createTask(title, description); }} />
      </section>

      <section aria-labelledby="tasks-heading" className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 id="tasks-heading" className="section-heading">
            Tasks
          </h2>
          {tasks.length > 0 && (
            <span className="font-mono text-xs text-foreground-faint">{tasks.length} total</span>
          )}
        </div>
        <TaskList tasks={tasks} onStatusChange={async (taskId, status) => { await updateTaskStatus(taskId, status); }} />
      </section>
    </div>
  );
}
