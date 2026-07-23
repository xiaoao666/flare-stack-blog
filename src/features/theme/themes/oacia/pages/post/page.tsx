import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Share2 } from "lucide-react";
import { Suspense } from "react";
import { toast } from "sonner";
import type { PostPageProps } from "@/features/theme/contract/pages";
import { CommentSection } from "@/features/theme/themes/default/components/comments/view/comment-section";
import { ContentRenderer } from "@/features/theme/themes/default/components/content/content-renderer";
import TableOfContents from "@/features/theme/themes/default/pages/post/components/table-of-contents";
import { authClient } from "@/lib/auth/auth.client";
import { m } from "@/paraglide/messages";
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
      <article className="oacia-article-shell">
        <nav className="oacia-article-actions oacia-article-toolbar">
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
