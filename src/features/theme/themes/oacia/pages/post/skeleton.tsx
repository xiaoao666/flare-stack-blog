export function PostPageSkeleton() {
  return (
    <div className="oacia-article-page" aria-hidden="true">
      <article className="oacia-article-shell">
        <div className="oacia-article-toolbar oacia-skeleton-toolbar">
          <span />
          <span />
        </div>
        <div className="oacia-article-summary oacia-skeleton-lines">
          <span />
          <span />
        </div>
        <div className="oacia-article-layout">
          <main className="oacia-article-content oacia-skeleton-article-lines">
            {Array.from({ length: 12 }).map((_, index) => (
              <span key={index} />
            ))}
          </main>
        </div>
      </article>
    </div>
  );
}
