import { Task } from "@/lib/api";

interface TaskProgressProps {
  tasks: Task[];
}

export function TaskProgress({ tasks }: TaskProgressProps) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  const segments = [
    { count: done, color: "bg-brass", label: "done" },
    { count: inProgress, color: "bg-coral", label: "in progress" },
    { count: todo, color: "bg-surface-border", label: "ready" },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="section-label">Completion</p>
          <p className="mt-2 font-display text-3xl font-semibold text-cream">
            {done}
            <span className="text-lg font-normal text-cream-faint"> / {total}</span>
          </p>
        </div>
        <p className="font-mono text-2xl font-medium tabular-nums text-brass">{percent}%</p>
      </div>

      <div className="mt-5 flex h-1.5 overflow-hidden rounded-full bg-ink gap-px">
        {total > 0 ? (
          segments.map(
            (seg) =>
              seg.count > 0 && (
                <div
                  key={seg.label}
                  className={`${seg.color} transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
                  style={{ width: `${(seg.count / total) * 100}%` }}
                />
              )
          )
        ) : (
          <div className="h-full w-full rounded-full bg-surface-border" />
        )}
      </div>

      {total > 0 && (
        <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-surface-border/60 pt-5">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-cream-faint">Ready</dt>
            <dd className="mt-1 font-mono text-sm text-cream">{todo}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-cream-faint">Active</dt>
            <dd className="mt-1 font-mono text-sm text-coral">{inProgress}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-cream-faint">Done</dt>
            <dd className="mt-1 font-mono text-sm text-brass">{done}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
