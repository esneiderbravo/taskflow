import { BarChart3, ClipboardList, FolderKanban } from "lucide-react";
import type { ReactNode } from "react";
import { ProjectSummary } from "@/lib/api";
import { sumTaskCounts } from "@/components/TaskMetrics";

interface DashboardHeaderProps {
  projectCount: number;
  taskCount: number;
  projects: ProjectSummary[];
}

export function DashboardHeader({ projectCount, taskCount, projects }: DashboardHeaderProps) {
  const portfolioCounts = sumTaskCounts(projects.map((p) => p.task_counts));
  const portfolioTotal =
    portfolioCounts.todo + portfolioCounts.in_progress + portfolioCounts.done;
  const completionPercent =
    portfolioTotal > 0 ? Math.round((portfolioCounts.done / portfolioTotal) * 100) : 0;
  const isPartialPage = projects.length < projectCount;

  return (
    <header className="space-y-6">
      <div>
        <h1 className="page-title">Projects</h1>
        <p className="page-lead">
          Overview of all workspaces — open a project to manage its task board.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="Projects"
          value={projectCount}
          detail={projectCount === 1 ? "workspace" : "workspaces"}
          icon={<FolderKanban className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />}
        />
        <MetricCard
          label="Tasks"
          value={taskCount}
          detail="across all projects"
          icon={<ClipboardList className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />}
        />
        <MetricCard
          label="Completion"
          value={`${completionPercent}%`}
          detail={
            portfolioTotal > 0
              ? isPartialPage
                ? `${portfolioCounts.done} done on this page`
                : `${portfolioCounts.done} done · ${portfolioCounts.in_progress} active`
              : "no tasks yet"
          }
          icon={<BarChart3 className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />}
          highlight
        />
      </div>
    </header>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon,
  highlight = false,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`card flex items-start gap-4 p-4 ${highlight ? "border-accent/20 bg-accent/[0.03] dark:border-accent/30 dark:bg-accent/10" : ""}`}
    >
      <span className={`icon-well h-10 w-10 ${highlight ? "icon-well-accent" : ""}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground-muted">{label}</p>
        <p className="mt-0.5 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
          {value}
        </p>
        <p className="mt-0.5 truncate text-xs text-foreground-muted">{detail}</p>
      </div>
    </div>
  );
}
