import { describe, expect, it } from "vitest";
import { resolvePublishedAtForSave } from "./date";

describe("resolvePublishedAtForSave", () => {
  it("preserves a manually selected date on first publish", () => {
    const selected = new Date("2026-08-08T12:00:00.000Z");
    expect(
      resolvePublishedAtForSave("published", selected, () => new Date(0)),
    ).toBe(selected);
  });

  it("uses the current time only when publishing without a date", () => {
    const now = new Date("2026-07-22T06:00:00.000Z");
    expect(resolvePublishedAtForSave("published", null, () => now)).toBe(now);
  });

  it("keeps an empty date for drafts", () => {
    expect(resolvePublishedAtForSave("draft", null)).toBeNull();
  });
});
