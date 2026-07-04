import Link from "next/link";
import { Project } from "@/lib/api";
import { formatDate } from "@/lib/format";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="card-interactive group relative flex items-start justify-between gap-4 overflow-hidden p-5 pl-6"
    >
      <span
        className="absolute inset-y-0 left-0 w-1 bg-brass/60 transition group-hover:bg-brass"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <h2 className="font-display text-lg font-medium text-cream transition group-hover:text-brass-light">
          {project.name}
        </h2>
        <p className="mt-2 font-mono text-xs text-cream-faint">
          Created {formatDate(project.created_at)}
        </p>
      </div>
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-cream-faint transition group-hover:translate-x-0.5 group-hover:text-brass"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  );
}
