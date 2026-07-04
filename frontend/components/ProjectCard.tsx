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
      className="group flex items-start justify-between gap-4 rounded-xl border border-surface-border bg-surface-raised p-5 transition hover:border-accent/40 hover:bg-surface-raised/80 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-white group-hover:text-accent transition-colors">
          {project.name}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Created {formatDate(project.created_at)}
        </p>
      </div>
      <svg
        className="mt-1 h-5 w-5 shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-accent"
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
