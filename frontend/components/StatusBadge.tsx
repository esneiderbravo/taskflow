import { TaskStatus } from "@/lib/api";

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  todo: {
    label: "Ready",
    className: "bg-slate-100 text-status-ready border-slate-200",
  },
  in_progress: {
    label: "In progress",
    className: "bg-amber-50 text-status-active border-amber-200",
  },
  done: {
    label: "Done",
    className: "bg-emerald-50 text-status-done border-emerald-200",
  },
};

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  );
}
