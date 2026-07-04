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
      <div className="card border-coral/30 bg-coral/5 p-6 animate-fade-up">
        <h2 className="font-medium text-coral">Unable to load projects</h2>
        <p className="mt-2 text-sm text-cream-muted">{error}</p>
        <p className="mt-3 font-mono text-xs text-cream-faint">
          Check that the backend is running, then refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-up">
      <header className="border-b border-surface-border pb-10">
        <p className="section-label">Dashboard</p>
        <h1 className="page-title mt-2">Projects</h1>
        <p className="page-lead">
          Group work into projects and move tasks from ready to done.
        </p>
      </header>

      <section aria-labelledby="create-project-heading">
        <h2 id="create-project-heading" className="section-label mb-4">
          New project
        </h2>
        <ProjectForm onSubmit={async (name) => { await createProject(name); }} />
      </section>

      <section aria-labelledby="projects-heading">
        <div className="mb-5 flex items-baseline justify-between border-b border-surface-border/60 pb-3">
          <h2 id="projects-heading" className="section-label">
            All projects
          </h2>
          {projects.length > 0 && (
            <span className="font-mono text-xs text-cream-faint">
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
                style={{ animationDelay: `${index * 60}ms` }}
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
