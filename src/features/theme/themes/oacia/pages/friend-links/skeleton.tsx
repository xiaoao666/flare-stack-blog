export function FriendLinksPageSkeleton() {
  return (
    <div className="oacia-friend-links-page" aria-hidden="true">
      <div className="oacia-friend-links-intro">
        <span className="oacia-skeleton-pulse h-4 w-16 rounded" />
        <span className="oacia-skeleton-pulse h-4 w-72 max-w-full rounded" />
      </div>
      <div className="oacia-friend-links-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="oacia-friend-card" key={index}>
            <span className="oacia-skeleton-pulse h-12 w-12 rounded-2xl" />
            <div className="grid flex-1 gap-3">
              <span className="oacia-skeleton-pulse h-5 w-2/5 rounded" />
              <span className="oacia-skeleton-pulse h-3 w-3/5 rounded" />
              <span className="oacia-skeleton-pulse h-3 w-4/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
