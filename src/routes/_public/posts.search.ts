import { normalizePostTagName } from "@/features/posts/schema/posts.schema";

export function getPostTagSearch(
  currentTagName: string | undefined,
  clickedTagName: string | undefined,
): { tagName?: string } {
  const normalizedTagName = normalizePostTagName(clickedTagName);
  const tagName =
    normalizedTagName === currentTagName ? undefined : normalizedTagName;
  return tagName === undefined ? {} : { tagName };
}
