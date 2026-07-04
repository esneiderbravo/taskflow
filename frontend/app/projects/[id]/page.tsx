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
      <div className="space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-accent"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to Projects
        </Link>
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <h2 className="font-medium text-red-300">Project not found</h2>
          <p className="mt-1 text-sm text-red-400/80">{projectError}</p>
        </div>
      </div>
    );
  }

  if (projectLoading || !project || loading) {
    return <ProjectDetailSkeleton />;
  }

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-accent"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to Projects
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">{project.name}</h1>
        <p className="mt-2 text-sm text-slate-500">Created {formatDate(project.created_at)}</p>
      </div>

      <TaskProgress tasks={tasks} />

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <section aria-labelledby="add-task-heading">
        <h2 id="add-task-heading" className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-500">
          Add Task
        </h2>
        <TaskForm onSubmit={async (title, description) => { await createTask(title, description); }} />
      </section>

      <section aria-labelledby="tasks-heading">
        <h2 id="tasks-heading" className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-500">
          Tasks
          {tasks.length > 0 && (
            <span className="ml-2 font-normal normal-case text-slate-600">({tasks.length})</span>
          )}
        </h2>
        <TaskList tasks={tasks} onStatusChange={async (taskId, status) => { await updateTaskStatus(taskId, status); }} />
      </section>
    </div>
  );
}
