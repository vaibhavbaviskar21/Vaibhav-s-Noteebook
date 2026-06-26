import React from "react";
import { Link } from "react-router-dom";
import { FileText, Calendar, ArrowRight } from "lucide-react";
import { Post, Section } from "../../types";
import { formatDate } from "../../lib/seo";

interface SearchResultProps {
  post: Post;
  sections: Section[];
  query: string;
}

export const SearchResult: React.FC<SearchResultProps> = ({ post, sections, query }) => {
  const section = sections.find((s) => s.id === post.sectionId);

  // Simple key term highlight helper
  const highlightText = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-100 dark:bg-yellow-950/60 dark:text-yellow-250 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all flex flex-col sm:flex-row items-start justify-between gap-4 group">
      <div className="space-y-1.5 flex-grow">
        {/* Section Path Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 dark:text-zinc-650 font-bold uppercase tracking-wider">
          <span>{section?.icon}</span>
          <Link to={`/${section?.slug}`} className="hover:underline hover:text-indigo-500">
            {section?.name || "Notebook"}
          </Link>
          <span className="opacity-40">/</span>
          <span>Article</span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
          <Link to={`/${section?.slug || "blog"}/${post.slug}`}>
            {highlightText(post.title, query)}
          </Link>
        </h4>

        {/* Excerpt Summary */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl line-clamp-2">
          {highlightText(post.excerpt || "No excerpt details.", query)}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
              >
                #{highlightText(tag, query)}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex sm:flex-col items-end shrink-0 gap-2 text-right">
        <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
        </span>

        <Link
          to={`/${section?.slug || "blog"}/${post.slug}`}
          className="flex items-center gap-1 text-xs text-indigo-500 font-semibold group-hover:underline mt-1"
        >
          <span>Open note</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
