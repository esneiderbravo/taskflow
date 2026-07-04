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

  return (
    <div className="rounded-xl border border-surface-border bg-surface-raised p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">Progress</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {done}
            <span className="text-base font-normal text-slate-500"> / {total} done</span>
          </p>
        </div>
        <p className="text-3xl font-bold tabular-nums text-accent">{percent}%</p>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percent}% of tasks completed`}
        />
      </div>

      {total > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
          <span>
            <span className="font-medium text-emerald-400">{todo}</span> ready
          </span>
          <span>
            <span className="font-medium text-amber-400">{inProgress}</span> in progress
          </span>
          <span>
            <span className="font-medium text-sky-400">{done}</span> done
          </span>
        </div>
      )}
    </div>
  );
}
