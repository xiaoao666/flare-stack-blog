export function PostPageSkeleton() {
  return (
    <div className="oacia-article-page" aria-hidden="true">
      <header className="oacia-article-hero oacia-skeleton-pulse">
        <div className="oacia-article-hero-copy oacia-skeleton-hero-copy">
          <span />
          <span />
          <span />
        </div>
      </header>
      <article className="oacia-article-shell">
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
