import { describe, expect, it } from "vitest";
import { getPostTagSearch } from "./posts.search";

describe("Post Tag selection", () => {
  it("should remove the Tag search parameter when All is selected", () => {
    expect(getPostTagSearch("TypeScript", undefined)).toEqual({});
  });

  it("should keep the unfiltered state stable when All is selected again", () => {
    expect(getPostTagSearch(undefined, undefined)).toEqual({});
  });

  it("should treat the legacy empty selection as All", () => {
    expect(getPostTagSearch("TypeScript", "")).toEqual({});
  });

  it("should toggle the active Tag off", () => {
    expect(getPostTagSearch("TypeScript", "TypeScript")).toEqual({});
  });

  it("should select a different Tag", () => {
    expect(getPostTagSearch("TypeScript", "React")).toEqual({
      tagName: "React",
    });
  });
});
