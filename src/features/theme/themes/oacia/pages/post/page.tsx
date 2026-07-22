import { ClientOnly, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock3, Pencil, Share2 } from "lucide-react";
import { Suspense } from "react";
import { toast } from "sonner";
import type { PostPageProps } from "@/features/theme/contract/pages";
import { CommentSection } from "@/features/theme/themes/default/components/comments/view/comment-section";
import { ContentRenderer } from "@/features/theme/themes/default/components/content/content-renderer";
import TableOfContents from "@/features/theme/themes/default/pages/post/components/table-of-contents";
import { authClient } from "@/lib/auth/auth.client";
import { formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { getOaciaPostCover } from "../../components/post-cover";
import {
  OaciaRelatedPosts,
  OaciaRelatedPostsSkeleton,
} from "./components/related-posts";

export function PostPage({ post }: PostPageProps) {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const sharePost = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() =>
        toast.success(m.post_share_success(), {
          description: m.post_share_success_desc(),
        }),
      )
      .catch(() =>
        toast.error(m.post_share_error(), {
          description: m.post_share_error_desc(),
        }),
      );
  };

  return (
    <div className="oacia-article-page">
      <header className="oacia-article-hero">
        <img src={getOaciaPostCover(post)} alt="" fetchPriority="high" />
        <div className="oacia-article-hero-shade" />
        <div className="oacia-article-hero-copy">
          <nav className="oacia-article-actions">
            <button type="button" onClick={() => navigate({ to: "/posts" })}>
              <ArrowLeft size={14} />
              {m.post_back_to_list()}
            </button>
            {session?.user.role === "admin" && (
              <Link to="/admin/posts/edit/$id" params={{ id: String(post.id) }}>
                <Pencil size={13} />
                {m.post_edit()}
              </Link>
            )}
          </nav>

          <div className="oacia-article-meta">
            <time dateTime={post.publishedAt?.toISOString()}>
              <ClientOnly fallback="-">
                {formatDate(post.publishedAt)}
              </ClientOnly>
            </time>
            <span>
              <Clock3 size={13} />
              {m.read_time({ count: post.readTimeInMinutes })}
            </span>
          </div>

          <h1 style={{ viewTransitionName: `post-title-${post.slug}` }}>
            {post.title}
          </h1>

          {(post.tags ?? []).length > 0 && (
            <div className="oacia-article-tags">
              {(post.tags ?? []).map((tag) => (
                <Link key={tag.id} to="/posts" search={{ tagName: tag.name }}>
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <article className="oacia-article-shell">
        {post.summary && (
          <div className="oacia-article-summary">
            <p>{post.summary}</p>
          </div>
        )}

        <div className="oacia-article-layout">
          <main className="oacia-article-content">
            <ContentRenderer content={post.contentJson} />

            <footer className="oacia-article-end">
              <span>{m.post_end_notice()}</span>
              <button type="button" onClick={sharePost}>
                <Share2 size={14} />
                {m.post_share()}
              </button>
            </footer>
          </main>

          {post.toc.length > 0 && (
            <aside className="oacia-article-toc">
              <TableOfContents headers={post.toc} />
            </aside>
          )}
        </div>

        <Suspense fallback={<OaciaRelatedPostsSkeleton />}>
          <OaciaRelatedPosts slug={post.slug} />
        </Suspense>

        <div className="oacia-comments-panel">
          <CommentSection postId={post.id} className="mt-0 border-t-0 pt-0" />
        </div>
      </article>
    </div>
  );
}
