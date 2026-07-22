import { ClientOnly, Link } from "@tanstack/react-router";
import { ArrowUpRight, Pin } from "lucide-react";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { getOaciaPostCover } from "./post-cover";

export function PostRow({
  post,
  pinned = false,
}: {
  post: PostItem;
  pinned?: boolean;
}) {
  const image = getOaciaPostCover(post);

  return (
    <article className="oacia-post-card">
      <Link
        to="/post/$slug"
        params={{ slug: post.slug }}
        className="oacia-post-link"
      >
        <div className="oacia-post-image-wrap">
          <img src={image} alt="" loading="lazy" className="oacia-post-image" />
        </div>
        <div className="oacia-post-copy">
          <div className="oacia-post-meta">
            <time dateTime={post.publishedAt?.toISOString()}>
              <ClientOnly fallback="-">
                {formatDate(post.publishedAt)}
              </ClientOnly>
            </time>
            <span>{m.read_time({ count: post.readTimeInMinutes })}</span>
            {pinned && (
              <span className="oacia-pinned">
                <Pin size={12} /> {m.home_pinned_posts()}
              </span>
            )}
          </div>
          <h3 style={{ viewTransitionName: `post-title-${post.slug}` }}>
            {post.title}
          </h3>
          {post.summary && <p>{post.summary}</p>}
          <span className="oacia-read-more">
            {m.post_read_more()} <ArrowUpRight size={15} />
          </span>
        </div>
      </Link>
    </article>
  );
}
