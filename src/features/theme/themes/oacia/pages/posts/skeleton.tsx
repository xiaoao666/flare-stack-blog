import { cn } from "@/lib/utils";

export function PostsPageSkeleton() {
  return (
    <div className="oacia-archive-page" aria-hidden="true">
      <div className="oacia-archive-hero oacia-skeleton-pulse" />
      <section className="oacia-archive-shell">
        <div className="oacia-tag-rail oacia-skeleton-tags">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="oacia-archive-grid">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "oacia-archive-card oacia-skeleton-card",
                index === 0 && "is-featured",
              )}
            >
              <div className="oacia-skeleton-pulse oacia-skeleton-media" />
              <div className="oacia-skeleton-lines">
                <span />
                <span />
                <span />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
