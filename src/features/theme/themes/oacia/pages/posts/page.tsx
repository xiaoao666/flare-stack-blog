import { useRouteContext } from "@tanstack/react-router";
import { BookOpen, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import type { PostsPageProps } from "@/features/theme/contract/pages";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { ArchivePostCard } from "../../components/archive-post-card";
import { getOaciaPostCover } from "../../components/post-cover";

export function PostsPage({
  posts,
  tags,
  selectedTag,
  onTagClick,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: PostsPageProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const observerRef = useRef<HTMLDivElement>(null);
  const leadPost = posts[0];

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "320px 0px", threshold: 0.01 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="oacia-archive-page">
      <header className="oacia-archive-hero">
        <img
          src={
            leadPost
              ? getOaciaPostCover(leadPost)
              : "/images/oacia/hero-sakura.jpg"
          }
          alt=""
          fetchPriority="high"
        />
        <div className="oacia-archive-hero-shade" />
        <div className="oacia-archive-hero-copy">
          <h1>{m.posts_title()}</h1>
          <p>{siteConfig.description}</p>
          {selectedTag && <span>#{selectedTag}</span>}
        </div>
      </header>

      <section className="oacia-archive-shell">
        <nav className="oacia-tag-rail" aria-label={m.posts_tags_filter()}>
          <button
            type="button"
            onClick={() => onTagClick(undefined)}
            className={cn(!selectedTag && "is-active")}
          >
            {m.posts_all()}
          </button>
          {tags.map((tag) => (
            <button
              type="button"
              key={tag.id}
              onClick={() => onTagClick(tag.name)}
              className={cn(selectedTag === tag.name && "is-active")}
            >
              <span>{tag.name}</span>
              <small>{tag.postCount}</small>
            </button>
          ))}
        </nav>

        {posts.length > 0 ? (
          <div className="oacia-archive-grid">
            {posts.map((post, index) => (
              <ArchivePostCard
                key={post.id}
                post={post}
                featured={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="oacia-archive-empty">
            <BookOpen size={30} strokeWidth={1.4} />
            <p>{m.posts_no_posts()}</p>
          </div>
        )}

        <div ref={observerRef} className="oacia-archive-load-state">
          {isFetchingNextPage ? (
            <span>
              <Loader2 size={15} className="animate-spin" />
              {m.posts_loading()}
            </span>
          ) : hasNextPage ? (
            <i />
          ) : posts.length > 0 ? (
            <span>{m.posts_end()}</span>
          ) : null}
        </div>
      </section>
    </div>
  );
}
