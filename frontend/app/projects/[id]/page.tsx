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
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-cream-faint transition hover:text-brass"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          All projects
        </Link>
        <div className="card border-coral/30 bg-coral/5 p-6">
          <h2 className="font-medium text-coral">Project not found</h2>
          <p className="mt-2 text-sm text-cream-muted">{projectError}</p>
        </div>
      </div>
    );
  }

  if (projectLoading || !project || loading) {
    return <ProjectDetailSkeleton />;
  }

  return (
    <div className="space-y-10 animate-fade-up">
      <header>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-cream-faint transition hover:text-brass"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          All projects
        </Link>
        <p className="section-label mt-6">Project</p>
        <h1 className="page-title mt-2">{project.name}</h1>
        <p className="mt-2 font-mono text-xs text-cream-faint">
          Created {formatDate(project.created_at)}
        </p>
      </header>

      <TaskProgress tasks={tasks} />

      {error && (
        <div className="card border-coral/30 bg-coral/5 p-4 text-sm text-coral">
          {error}
        </div>
      )}

      <section aria-labelledby="add-task-heading">
        <h2 id="add-task-heading" className="section-label mb-4">
          Add task
        </h2>
        <TaskForm onSubmit={async (title, description) => { await createTask(title, description); }} />
      </section>

      <section aria-labelledby="tasks-heading">
        <div className="mb-5 flex items-baseline justify-between border-b border-surface-border/60 pb-3">
          <h2 id="tasks-heading" className="section-label">
            Tasks
          </h2>
          {tasks.length > 0 && (
            <span className="font-mono text-xs text-cream-faint">{tasks.length} total</span>
          )}
        </div>
        <TaskList tasks={tasks} onStatusChange={async (taskId, status) => { await updateTaskStatus(taskId, status); }} />
      </section>
    </div>
  );
}
