import { useSuspenseQuery } from "@tanstack/react-query";
import { ClientOnly, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { relatedPostsQuery } from "@/features/posts/queries";
import { formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { getOaciaPostCover } from "../../../components/post-cover";
import { config } from "../../../config";

export function OaciaRelatedPosts({ slug }: { slug: string }) {
  const { data: posts } = useSuspenseQuery(
    relatedPostsQuery(slug, config.post.relatedPostsLimit),
  );

  if (posts.length === 0) return null;

  return (
    <section className="oacia-related-posts">
      <h2>{m.post_related_posts()}</h2>
      <div className="oacia-related-grid">
        {posts.map((post) => (
          <Link
            key={post.id}
            to="/post/$slug"
            params={{ slug: post.slug }}
            className="oacia-related-card"
          >
            <div>
              <img src={getOaciaPostCover(post)} alt="" loading="lazy" />
            </div>
            <time dateTime={post.publishedAt?.toISOString()}>
              <ClientOnly fallback="-">
                {formatDate(post.publishedAt)}
              </ClientOnly>
            </time>
            <h3>{post.title}</h3>
            <span>
              {m.post_read_more()}
              <ArrowUpRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function OaciaRelatedPostsSkeleton() {
  return (
    <section className="oacia-related-posts" aria-hidden="true">
      <div className="oacia-skeleton-pulse h-10 w-44 rounded-xl" />
      <div className="oacia-related-grid">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="oacia-related-card">
            <div className="oacia-skeleton-pulse" />
            <span className="oacia-skeleton-pulse h-3 w-20 rounded" />
            <span className="oacia-skeleton-pulse h-7 w-4/5 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
