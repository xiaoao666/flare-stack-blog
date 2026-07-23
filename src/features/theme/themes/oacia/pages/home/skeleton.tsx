import { Skeleton } from "@/components/ui/skeleton";

export function HomePageSkeleton() {
  return (
    <div className="oacia-home" aria-busy="true">
      <section className="oacia-intro">
        <div className="space-y-5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-16 w-72 max-w-full" />
          <Skeleton className="h-5 w-[34rem] max-w-full" />
        </div>
      </section>
      <section className="oacia-post-section space-y-8">
        <Skeleton className="h-8 w-32" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="py-8 space-y-4 border-t border-border">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </section>
    </div>
  );
}
