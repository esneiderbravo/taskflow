import { TaskStatus } from "@/lib/api";

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  todo: {
    label: "Ready",
    className: "bg-status-ready/15 text-status-ready border-status-ready/30",
  },
  in_progress: {
    label: "In progress",
    className: "bg-status-active/15 text-status-active border-status-active/30",
  },
  done: {
    label: "Done",
    className: "bg-status-done/15 text-status-done border-status-done/30",
  },
};

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {config.label}
    </span>
  );
}
