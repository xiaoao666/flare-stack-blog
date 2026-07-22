import { describe, expect, it } from "vitest";
import { calculatePostHash } from "./sync";

const basePost = {
  title: "Cover hash regression",
  contentJson: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Same article body" }],
      },
    ],
  },
  summary: "Same summary",
  tagIds: [2, 1],
  slug: "cover-hash-regression",
  publishedAt: "2026-07-22T00:00:00.000Z",
  readTimeInMinutes: 3,
};

describe("calculatePostHash", () => {
  it("changes when the post cover changes", async () => {
    const firstHash = await calculatePostHash({
      ...basePost,
      coverImageUrl: "/images/cover-a.webp",
    });
    const secondHash = await calculatePostHash({
      ...basePost,
      coverImageUrl: "/images/cover-b.webp",
    });

    expect(secondHash).not.toBe(firstHash);
  });

  it("treats an omitted cover and a null cover as the same state", async () => {
    const omittedHash = await calculatePostHash(basePost);
    const nullHash = await calculatePostHash({
      ...basePost,
      coverImageUrl: null,
    });

    expect(nullHash).toBe(omittedHash);
  });
});
