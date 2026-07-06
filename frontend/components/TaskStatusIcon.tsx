import { CheckCircle2, CircleDot, Timer, type LucideIcon } from "lucide-react";
import type { TaskStatus } from "@/lib/api";

const STATUS_ICONS: Record<TaskStatus, LucideIcon> = {
  todo: CircleDot,
  in_progress: Timer,
  done: CheckCircle2,
};

const SIZE_CLASS = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
} as const;

interface TaskStatusIconProps {
  status: TaskStatus;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
}

export function TaskStatusIcon({ status, size = "sm", className = "" }: TaskStatusIconProps) {
  const Icon = STATUS_ICONS[status];

  return (
    <Icon
      className={`${SIZE_CLASS[size]} ${className}`.trim()}
      strokeWidth={2}
      aria-hidden="true"
    />
  );
}
