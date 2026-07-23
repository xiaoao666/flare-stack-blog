import { ArrowLeft, ArrowUpRight, Loader2, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import type { SearchPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";

export function SearchPage({
  query,
  results,
  isSearching,
  onQueryChange,
  onSelectPost,
  onBack,
}: SearchPageProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="oacia-search-page">
      <header className="oacia-search-toolbar">
        <button type="button" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={1.5} />
          {m.search_back()}
        </button>
        <span>SEARCH</span>
      </header>

      <label className="oacia-search-input-wrap">
        <Search size={24} strokeWidth={1.4} />
        <span className="sr-only">{m.search_input_label()}</span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={m.search_input_label()}
        />
      </label>

      <section className="oacia-search-results" aria-live="polite">
        {isSearching && (
          <div className="oacia-search-state">
            <Loader2 size={20} className="animate-spin" />
            <span>{m.posts_loading()}</span>
          </div>
        )}

        {!isSearching && query.trim() === "" && (
          <div className="oacia-search-state">
            <p>输入关键词，寻找一篇文章。</p>
          </div>
        )}

        {!isSearching && query.trim() !== "" && results.length === 0 && (
          <div className="oacia-search-state">
            <p>
              {m.search_no_results()} "{query}"
            </p>
          </div>
        )}

        {!isSearching &&
          results.map((result, index) => (
            <button
              type="button"
              key={result.post.id}
              className="oacia-search-result"
              onClick={() => onSelectPost(result.post.slug)}
            >
              <span className="oacia-search-result-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="oacia-search-result-copy">
                <strong
                  dangerouslySetInnerHTML={{
                    __html: result.matches.title || result.post.title,
                  }}
                />
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      result.matches.summary || result.post.summary || "",
                  }}
                />
                {result.post.tags.length > 0 && (
                  <small>{result.post.tags.slice(0, 3).join(" / ")}</small>
                )}
              </span>
              <ArrowUpRight size={18} strokeWidth={1.4} />
            </button>
          ))}
      </section>
    </div>
  );
}
