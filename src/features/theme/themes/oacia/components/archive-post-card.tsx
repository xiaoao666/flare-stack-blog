import { ClientOnly, Link } from "@tanstack/react-router";
import { ArrowUpRight, Pin } from "lucide-react";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { cn, formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { getOaciaPostCover } from "./post-cover";

export function ArchivePostCard({
  post,
  featured = false,
}: {
  post: PostItem;
  featured?: boolean;
}) {
  return (
    <article className={cn("oacia-archive-card", featured && "is-featured")}>
      <Link
        to="/post/$slug"
        params={{ slug: post.slug }}
        className="oacia-archive-card-link"
      >
        <div className="oacia-archive-card-media">
          <img
            src={getOaciaPostCover(post)}
            alt=""
            loading={featured ? "eager" : "lazy"}
            fetchPriority={featured ? "high" : "auto"}
          />
        </div>

        <div className="oacia-archive-card-copy">
          <div className="oacia-archive-card-meta">
            <time dateTime={post.publishedAt?.toISOString()}>
              <ClientOnly fallback="-">
                {formatDate(post.publishedAt)}
              </ClientOnly>
            </time>
            <span>{m.read_time({ count: post.readTimeInMinutes })}</span>
            {post.pinnedAt && (
              <span className="oacia-pinned">
                <Pin size={11} />
                {m.home_pinned_posts()}
              </span>
            )}
          </div>

          <h2 style={{ viewTransitionName: `post-title-${post.slug}` }}>
            {post.title}
          </h2>

          {post.summary && <p>{post.summary}</p>}

          <div className="oacia-archive-card-footer">
            <div className="oacia-archive-card-tags">
              {(post.tags ?? []).slice(0, 3).map((tag) => (
                <span key={tag.id}>#{tag.name}</span>
              ))}
            </div>
            <span className="oacia-read-more">
              {m.post_read_more()}
              <ArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
