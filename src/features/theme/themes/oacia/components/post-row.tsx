import { ClientOnly, Link } from "@tanstack/react-router";
import { ArrowUpRight, Pin } from "lucide-react";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";

export function PostRow({
  post,
  pinned = false,
}: {
  post: PostItem;
  pinned?: boolean;
}) {
  return (
    <article className="oacia-post-row">
      <Link
        to="/post/$slug"
        params={{ slug: post.slug }}
        className="oacia-post-link"
      >
        <div className="oacia-post-meta">
          <time dateTime={post.publishedAt?.toISOString()}>
            <ClientOnly fallback="-">{formatDate(post.publishedAt)}</ClientOnly>
          </time>
          <span>{m.read_time({ count: post.readTimeInMinutes })}</span>
          {pinned && (
            <span className="oacia-pinned">
              <Pin size={12} strokeWidth={1.6} /> PINNED
            </span>
          )}
        </div>
        <div className="oacia-post-copy">
          <h3 style={{ viewTransitionName: `post-title-${post.slug}` }}>
            {post.title}
          </h3>
          {post.summary && <p>{post.summary}</p>}
        </div>
        <ArrowUpRight
          className="oacia-post-arrow"
          size={18}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}
