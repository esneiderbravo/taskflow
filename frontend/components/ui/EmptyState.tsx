import { FolderKanban } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-surface-border bg-surface-raised px-6 py-12 text-center">
      <div className="mx-auto mb-4 icon-well-accent h-12 w-12 rounded-xl">
        <FolderKanban className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-foreground-muted">
        {description}
      </p>
    </div>
  );
}
