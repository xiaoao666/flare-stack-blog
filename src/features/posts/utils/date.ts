/**
 * Check if a publish date (stored as UTC noon) is in the future
 * relative to the client's local today (YYYY-MM-DD).
 *
 * Since publishedAt is always stored as `T12:00:00Z`, its UTC date
 * portion equals the user-selected calendar date. We compare that
 * against the client-provided today string to avoid timezone edge cases.
 */
export function isFuturePublishDate(
  publishedAtISO: string,
  clientToday: string,
): boolean {
  return publishedAtISO.slice(0, 10) > clientToday;
}

export function resolvePublishedAtForSave(
  status: "draft" | "published",
  publishedAt: Date | null,
  now: () => Date = () => new Date(),
) {
  if (status === "published" && !publishedAt) return now();
  return publishedAt;
}

/** Strip time-of-day, returning UTC midnight (00:00) of the same calendar date. */
export function toUTCMidnight(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}
