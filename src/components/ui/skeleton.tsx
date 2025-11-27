import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-muted/50", // Changed to rounded-xl and softer bg
        className
      )}
      {...props}
    />
  );
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[...Array(12)].map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="aspect-[2/3] w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4 rounded-lg" />
          <Skeleton className="h-3 w-1/2 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="h-20 w-16 flex-shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <Skeleton className="h-3 w-1/2 rounded-lg" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-14 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CarouselSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <Skeleton className="h-7 w-40 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
      <div className="flex gap-4 overflow-hidden pb-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="w-[160px] md:w-[200px] flex-shrink-0 space-y-2"
          >
            <Skeleton className="aspect-[2/3] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export { Skeleton };
