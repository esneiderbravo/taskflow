"use client";

import { ProjectCard } from "@/components/ProjectCard";
import { ProjectForm } from "@/components/ProjectForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { useProjects } from "@/hooks/useTasks";

export default function DashboardPage() {
  const { projects, loading, error, createProject } = useProjects();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
        <h2 className="font-medium text-red-300">Unable to load projects</h2>
        <p className="mt-1 text-sm text-red-400/80">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Projects</h1>
        <p className="mt-2 max-w-xl text-slate-400">
          Organize work into projects and track tasks through each stage of completion.
        </p>
      </div>

      <section aria-labelledby="create-project-heading">
        <h2 id="create-project-heading" className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-500">
          New Project
        </h2>
        <ProjectForm onSubmit={async (name) => { await createProject(name); }} />
      </section>

      <section aria-labelledby="projects-heading">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="projects-heading" className="text-sm font-medium uppercase tracking-wider text-slate-500">
            All Projects
          </h2>
          {projects.length > 0 && (
            <span className="text-sm text-slate-500">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </span>
          )}
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create your first project above to start organizing tasks."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
