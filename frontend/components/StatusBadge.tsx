import { TaskStatus } from "@/lib/api";

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  todo: {
    label: "Ready",
    className: "bg-emerald-950/60 text-emerald-300/90 border-emerald-800/50",
  },
  in_progress: {
    label: "In progress",
    className: "bg-amber-950/60 text-amber-300/90 border-amber-800/50",
  },
  done: {
    label: "Done",
    className: "bg-surface-hover text-cream-muted border-surface-border",
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
