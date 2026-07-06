import Link from "next/link";
import { ProjectIcon } from "@/components/ProjectIcon";
import { ProjectSummary, TaskCounts } from "@/lib/api";
import { formatDate } from "@/lib/format";

interface ProjectCardProps {
  project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { task_counts: taskCounts } = project;
  const total = taskCounts.todo + taskCounts.in_progress + taskCounts.done;
  const donePercent = total > 0 ? Math.round((taskCounts.done / total) * 100) : 0;

  return (
    <Link
      href={`/projects/${project.id}`}
      className="card-interactive group flex h-full flex-col p-5"
    >
      <div className="flex items-start gap-3">
        <span
          className="icon-well-accent h-10 w-10 transition group-hover:bg-accent group-hover:text-white"
          aria-hidden="true"
        >
          <ProjectIcon size="md" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold text-foreground transition group-hover:text-accent">
            {project.name}
          </h2>
          <p className="mt-1 text-xs text-foreground-faint">
            {formatDate(project.created_at)}
          </p>
        </div>
      </div>

      {total > 0 ? (
        <div className="mt-5 flex flex-1 flex-col gap-4">
          <div className="flex items-end justify-between gap-2">
            <p className="text-2xl font-semibold tabular-nums text-foreground">
              {donePercent}
              <span className="text-sm font-normal text-foreground-faint">%</span>
            </p>
            <p className="text-xs text-foreground-muted">{total} tasks</p>
          </div>

          <ProgressBar counts={taskCounts} total={total} />

          <dl className="grid grid-cols-3 gap-2 border-t border-surface-border pt-4">
            <StatusStat label="Ready" value={taskCounts.todo} dotClass="bg-status-ready" />
            <StatusStat label="Active" value={taskCounts.in_progress} dotClass="bg-status-active" />
            <StatusStat label="Done" value={taskCounts.done} dotClass="bg-status-done" />
          </dl>
        </div>
      ) : (
        <p className="mt-5 flex-1 text-xs text-foreground-faint">No tasks yet</p>
      )}

      <p className="mt-4 text-xs font-medium text-accent opacity-0 transition group-hover:opacity-100">
        Open project →
      </p>
    </Link>
  );
}

function StatusStat({
  label,
  value,
  dotClass,
}: {
  label: string;
  value: number;
  dotClass: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-foreground-muted">
        <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold tabular-nums text-foreground">{value}</dd>
    </div>
  );
}

function ProgressBar({ counts, total }: { counts: TaskCounts; total: number }) {
  return (
    <div className="flex h-2 overflow-hidden rounded-full bg-surface-border">
      {counts.done > 0 && (
        <span className="bg-status-done" style={{ width: `${(counts.done / total) * 100}%` }} />
      )}
      {counts.in_progress > 0 && (
        <span className="bg-status-active" style={{ width: `${(counts.in_progress / total) * 100}%` }} />
      )}
      {counts.todo > 0 && (
        <span className="bg-status-ready/70" style={{ width: `${(counts.todo / total) * 100}%` }} />
      )}
    </div>
  );
}
