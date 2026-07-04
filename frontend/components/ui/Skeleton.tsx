interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-md bg-surface-border/50 ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="card p-5 pl-6">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="mt-3 h-3 w-1/3" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      <div className="border-b border-surface-border pb-10">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-10 w-48" />
        <Skeleton className="mt-4 h-5 w-80" />
      </div>
      <Skeleton className="h-14 w-full" />
      <div className="grid gap-3 sm:grid-cols-2">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="space-y-10">
      <div>
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-5 h-10 w-64" />
        <Skeleton className="mt-3 h-4 w-40" />
      </div>
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}
