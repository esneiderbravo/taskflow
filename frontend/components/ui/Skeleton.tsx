export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-40 animate-shimmer rounded-lg bg-surface-border/60" />
        <div className="mt-3 h-4 w-96 max-w-full animate-shimmer rounded-lg bg-surface-border/60" />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card h-24 animate-shimmer bg-surface-border/60" />
          ))}
        </div>
      </div>
      <div className="card h-16 animate-shimmer bg-surface-border/60" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="space-y-10">
      <div className="card h-44 animate-shimmer bg-surface-border/60" />
      <div className="card h-44 animate-shimmer bg-surface-border/60" />
      <div className="kanban-board">
        {[1, 2, 3].map((col) => (
          <div key={col} className="kanban-column">
            <div className="kanban-column-header">
              <div className="h-4 w-24 animate-shimmer rounded bg-surface-border/60" />
            </div>
            <div className="kanban-column-body">
              <div className="h-28 animate-shimmer rounded-lg bg-surface-border/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-lg bg-surface-border/60 ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="mt-2 h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-5 h-2 w-full rounded-full" />
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
      </div>
    </div>
  );
}
