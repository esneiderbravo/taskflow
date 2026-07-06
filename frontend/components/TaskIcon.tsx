import { ClipboardList } from "lucide-react";

interface TaskIconProps {
  size?: "sm" | "md";
  className?: string;
}

const SIZE_CLASS = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
} as const;

export function TaskIcon({ size = "md", className = "" }: TaskIconProps) {
  return (
    <ClipboardList
      className={`${SIZE_CLASS[size]} ${className}`.trim()}
      strokeWidth={1.75}
      aria-hidden="true"
    />
  );
}
