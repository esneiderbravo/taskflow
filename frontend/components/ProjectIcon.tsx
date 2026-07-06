import { FolderKanban } from "lucide-react";

interface ProjectIconProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASS = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

export function ProjectIcon({ size = "md", className = "" }: ProjectIconProps) {
  return (
    <FolderKanban
      className={`${SIZE_CLASS[size]} ${className}`.trim()}
      strokeWidth={1.75}
      aria-hidden="true"
    />
  );
}
