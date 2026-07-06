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
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
          }
        />
        <MetricCard
          label="Tasks"
          value={taskCount}
          detail="across all projects"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
            </svg>
          }
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
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          }
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
      <span
        className={`icon-well h-10 w-10 ${highlight ? "icon-well-accent" : ""}`}
      >
        {icon}
      </span>
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
