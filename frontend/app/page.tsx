"use client";

import { ProjectCard } from "@/components/ProjectCard";
import { ProjectForm } from "@/components/ProjectForm";
import { DashboardHeader } from "@/components/DashboardHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { SearchField } from "@/components/ui/SearchField";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { useProjects } from "@/hooks/useTasks";
import { PAGE_SIZE } from "@/lib/api";

export default function DashboardPage() {
  const {
    projects,
    total,
    taskTotal,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    createProject,
  } = useProjects();

  if (loading && projects.length === 0) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="alert-danger animate-fade-up p-6">
        <h2 className="font-semibold text-status-danger">Unable to load projects</h2>
        <p className="mt-2 text-sm text-foreground-muted">{error}</p>
        <p className="mt-3 text-sm text-foreground-faint">
          Check that the backend is running, then refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <DashboardHeader projectCount={total} taskCount={taskTotal} projects={projects} />

      <div className="card p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-sm">
            <SearchField
              label="Search projects"
              value={search}
              onChange={setSearch}
              placeholder="Search by name…"
            />
          </div>
          <ProjectForm
            variant="inline"
            onSubmit={async (name) => { await createProject(name); }}
          />
        </div>
      </div>

      <section aria-labelledby="projects-heading" className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="projects-heading" className="section-heading">
            All projects
          </h2>
          {total > 0 && (
            <p className="section-label">{total} total</p>
          )}
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title={search ? "No matching projects" : "No projects yet"}
            description={
              search
                ? "Try a different search term or create a new project."
                : "Create your first project above to start adding tasks."
            }
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={total}
              pageSize={PAGE_SIZE.projects}
              onPageChange={setPage}
              itemLabel="projects"
            />
          </>
        )}
      </section>
    </div>
  );
}
