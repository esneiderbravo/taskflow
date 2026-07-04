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
      <div className="card animate-fade-up border-status-danger/20 bg-red-50 p-6">
        <h2 className="font-semibold text-status-danger">Unable to load projects</h2>
        <p className="mt-2 text-sm text-foreground-muted">{error}</p>
        <p className="mt-3 text-sm text-foreground-faint">
          Check that the backend is running, then refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-up">
      <header className="pb-2">
        <h1 className="page-title">Projects</h1>
        <p className="page-lead">
          Group work into projects and move tasks from ready to done.
        </p>
      </header>

      <section aria-labelledby="create-project-heading" className="space-y-4">
        <h2 id="create-project-heading" className="section-heading">
          New project
        </h2>
        <ProjectForm onSubmit={async (name) => { await createProject(name); }} />
      </section>

      <section aria-labelledby="projects-heading" className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 id="projects-heading" className="section-heading">
            All projects
          </h2>
          {projects.length > 0 && (
            <span className="font-mono text-xs text-foreground-faint">
              {projects.length} total
            </span>
          )}
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Name your first project above to start adding tasks."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
