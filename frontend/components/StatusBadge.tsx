import { TaskStatus } from "@/lib/api";

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  todo: {
    label: "Ready",
    className: "bg-sage/10 text-sage border-sage/25",
  },
  in_progress: {
    label: "In progress",
    className: "bg-coral/10 text-coral border-coral/25",
  },
  done: {
    label: "Done",
    className: "bg-brass/10 text-brass-light border-brass/25",
  },
};

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  );
}
