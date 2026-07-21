import { ClientOnly, Link } from "@tanstack/react-router";
import { ArrowUpRight, Pin } from "lucide-react";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";

const postImages = [
  "/images/oacia/hero-afternoon.jpg",
  "/images/oacia/post-friends.jpg",
  "/images/oacia/hero-sakura.jpg",
  "/images/oacia/post-night.jpg",
  "/images/oacia/hero-sky.jpg",
] as const;

export function PostRow({
  post,
  pinned = false,
  index = 0,
}: {
  post: PostItem;
  pinned?: boolean;
  index?: number;
}) {
  const image = postImages[index % postImages.length];

  return (
    <article className="oacia-post-card">
      <Link to="/post/$slug" params={{ slug: post.slug }} className="oacia-post-link">
        <div className="oacia-post-image-wrap">
          <img src={image} alt="" loading="lazy" className="oacia-post-image" />
          <span className="oacia-post-number">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="oacia-post-copy">
          <div className="oacia-post-meta">
            <time dateTime={post.publishedAt?.toISOString()}>
              <ClientOnly fallback="—">{formatDate(post.publishedAt)}</ClientOnly>
            </time>
            <span>{m.read_time({ count: post.readTimeInMinutes })}</span>
            {pinned && (
              <span className="oacia-pinned"><Pin size={12} /> PINNED</span>
            )}
          </div>
          <h3 style={{ viewTransitionName: `post-title-${post.slug}` }}>{post.title}</h3>
          {post.summary && <p>{post.summary}</p>}
          <span className="oacia-read-more">READ STORY <ArrowUpRight size={15} /></span>
        </div>
      </Link>
    </article>
  );
}
