import Link from "next/link";
import { ProjectDetail } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { TaskMetrics } from "@/components/TaskMetrics";

interface ProjectOverviewProps {
  project: ProjectDetail;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const total =
    project.task_counts.todo +
    project.task_counts.in_progress +
    project.task_counts.done;

  return (
    <section aria-labelledby="project-overview-heading" className="space-y-6">
      <Link href="/" className="back-link">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        All projects
      </Link>

      <div className="card overflow-hidden">
        <div className="h-1 bg-accent/80" aria-hidden="true" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-4">
                <ProjectAvatar name={project.name} />
                <div className="min-w-0">
                  <h1 id="project-overview-heading" className="page-title">
                    {project.name}
                  </h1>
                  <p className="mt-2 text-sm text-foreground-muted">
                    Created {formatDate(project.created_at)}
                    {total > 0 && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span>{total} tasks total</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {total > 0 && (
              <div className="w-full shrink-0 lg:max-w-md">
                <TaskMetrics taskCounts={project.task_counts} />
              </div>
            )}
          </div>

          {total === 0 && (
            <p className="mt-6 rounded-lg border border-dashed border-surface-border bg-page px-4 py-6 text-center text-sm text-foreground-muted">
              No tasks yet — use Add task on the board to create the first one.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function ProjectAvatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      className="icon-well-accent h-12 w-12 rounded-xl text-lg font-semibold"
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
