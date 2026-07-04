interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-surface-border/60 ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-raised p-5">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="mt-3 h-4 w-1/3" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-3 h-5 w-72" />
      </div>
      <Skeleton className="h-12 w-full max-w-xl" />
      <div className="grid gap-4 sm:grid-cols-2">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-4 h-9 w-64" />
        <Skeleton className="mt-3 h-5 w-40" />
      </div>
      <Skeleton className="h-40 w-full" />
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}
