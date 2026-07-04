import { TaskStatus } from "@/lib/api";

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  todo: {
    label: "Ready",
    className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  done: {
    label: "Done",
    className: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  },
};

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
