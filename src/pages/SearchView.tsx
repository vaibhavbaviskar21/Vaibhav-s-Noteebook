import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, HelpCircle } from "lucide-react";
import { useApp } from "../lib/AppContext";
import { SearchInput } from "../components/search/SearchInput";
import { SearchResult } from "../components/search/SearchResult";
import { searchPosts } from "../lib/search";
import { updateSEOHeaders } from "../lib/seo";

export const SearchView: React.FC = () => {
  const { posts, sections, settings, isLoading, isAdmin } = useApp();
  const [query, setQuery] = useState("");

  React.useEffect(() => {
    updateSEOHeaders("Search Notebook", "Fuzzy search and discover articles, DSA notes, CTFs, and project details in Vaibhav's Brain.", null, settings);
  }, [settings]);

  // Query posts using Fuse.js indexer
  const results = useMemo(() => {
    const visiblePosts = posts.filter((p) => p.status === "published" || isAdmin);
    if (!query.trim()) {
      return visiblePosts;
    }
    return searchPosts(query).filter((p) => p.status === "published" || isAdmin);
  }, [posts, query, isAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-xs text-zinc-400 dark:text-zinc-650 animate-pulse">
        <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Indexing digital garden files...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans animate-fade-in select-none">
      {/* Title block */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          <Link to="/" className="hover:text-indigo-500 hover:underline">Root</Link>
          <span>›</span>
          <span>Fuzzy Search</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
          <Search className="h-6 w-6 text-indigo-500" />
          <span>Fuzzy Search Engine</span>
        </h2>
      </div>

      {/* Input bar */}
      <div className="w-full">
        <SearchInput value={query} onChange={setQuery} />
      </div>

      {/* Matches / Listings Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider pb-1 border-b border-zinc-100 dark:border-zinc-850">
          <span>{query ? "Search Results" : "All Searchable Notes"}</span>
          <span>{results.length} matches found</span>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-sm mx-auto">
            <HelpCircle className="h-8 w-8 text-zinc-300 dark:text-zinc-655 mx-auto mb-2.5" />
            <p className="text-sm font-semibold font-sans text-zinc-650 dark:text-zinc-400 italic">No notes matched your query.</p>
            <p className="text-xs text-zinc-450 dark:text-zinc-500 mt-1">Try typing matching tag titles like #intro, #docs, #showcase or #python.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((post) => (
              <SearchResult key={post.id} post={post} sections={sections} query={query} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
