import { TaskCounts } from "@/lib/api";

interface TaskMetricsProps {
  taskCounts: TaskCounts;
  variant?: "default" | "compact";
}

export function TaskMetrics({ taskCounts, variant = "default" }: TaskMetricsProps) {
  const { todo, in_progress: inProgress, done } = taskCounts;
  const total = todo + inProgress + done;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  const segments = [
    { count: done, color: "bg-status-done", label: "Done" },
    { count: inProgress, color: "bg-status-active", label: "In progress" },
    { count: todo, color: "bg-status-ready/70", label: "Ready" },
  ];

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3">
        <ProgressRing percent={percent} size={44} stroke={4} />
        <div className="grid grid-cols-3 gap-3 text-center">
          <MetricPill label="Ready" value={todo} className="text-status-ready" />
          <MetricPill label="Active" value={inProgress} className="text-status-active" />
          <MetricPill label="Done" value={done} className="text-status-done" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="flex items-center gap-5">
        <ProgressRing percent={percent} size={72} stroke={5} />
        <div>
          <p className="text-sm font-medium text-foreground-muted">Completion</p>
          <p className="mt-0.5 text-3xl font-semibold tabular-nums text-foreground">
            {percent}
            <span className="text-lg font-normal text-foreground-faint">%</span>
          </p>
          <p className="mt-1 text-sm text-foreground-faint">
            {done} of {total} tasks done
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 sm:border-l sm:border-surface-border sm:pl-6">
        <div className="flex h-2.5 overflow-hidden rounded-full bg-surface-border">
          {total > 0 ? (
            segments.map(
              (seg) =>
                seg.count > 0 && (
                  <div
                    key={seg.label}
                    className={`${seg.color} transition-all duration-300`}
                    style={{ width: `${(seg.count / total) * 100}%` }}
                  />
                )
            )
          ) : (
            <div className="h-full w-full bg-surface-border" />
          )}
        </div>

        <dl className="grid grid-cols-3 gap-4">
          {segments.map((seg) => (
            <div key={seg.label}>
              <dt className="text-xs text-foreground-muted">{seg.label}</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
                {seg.count}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function MetricPill({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-foreground-muted">
        {label}
      </p>
      <p className={`mt-0.5 text-sm font-semibold tabular-nums ${className}`}>{value}</p>
    </div>
  );
}

function ProgressRing({
  percent,
  size,
  stroke,
}: {
  percent: number;
  size: number;
  stroke: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-surface-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-accent transition-all duration-500"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums text-foreground"
        aria-label={`${percent}% complete`}
      >
        {percent}%
      </span>
    </div>
  );
}

export function sumTaskCounts(counts: TaskCounts[]): TaskCounts {
  return counts.reduce(
    (acc, c) => ({
      todo: acc.todo + c.todo,
      in_progress: acc.in_progress + c.in_progress,
      done: acc.done + c.done,
    }),
    { todo: 0, in_progress: 0, done: 0 }
  );
}
