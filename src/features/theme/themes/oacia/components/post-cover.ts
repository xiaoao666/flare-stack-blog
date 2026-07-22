import type { PostItem } from "@/features/posts/schema/posts.schema";

const fallbackCovers = [
  "/images/oacia/hero-afternoon.jpg",
  "/images/oacia/post-friends.jpg",
  "/images/oacia/hero-sakura.jpg",
  "/images/oacia/post-night.jpg",
  "/images/oacia/hero-sky.jpg",
] as const;

export function getOaciaPostCover(
  post: Pick<PostItem, "id" | "coverImageUrl">,
) {
  return (
    post.coverImageUrl ??
    fallbackCovers[Math.abs(post.id) % fallbackCovers.length]
  );
}
