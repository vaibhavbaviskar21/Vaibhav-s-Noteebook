import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Calendar, Clock, ArrowLeft, Edit3, EyeOff, Hash } from "lucide-react";
import { useApp } from "../lib/AppContext";
import { PostBody } from "../components/posts/PostBody";
import { RelatedPosts } from "../components/posts/RelatedPosts";
import { TableOfContents } from "../components/posts/TableOfContents";
import { formatDate, getReadingTime, updateSEOHeaders } from "../lib/seo";

export const PostDetail: React.FC = () => {
  const { sectionSlug, postSlug } = useParams<{ sectionSlug: string; postSlug: string }>();
  const { posts, sections, isAdmin, isLoading } = useApp();

  // Find the current post
  const post = useMemo(() => {
    return posts.find((p) => p.slug === postSlug);
  }, [posts, postSlug]);

  // Find the associated section
  const section = useMemo(() => {
    return sections.find((s) => s.slug === sectionSlug);
  }, [sections, sectionSlug]);

  // Set page headers for SEO
  React.useEffect(() => {
    if (post) {
      updateSEOHeaders(post.title, post.excerpt || "Reading note...", post.coverImage);
    }
  }, [post]);

  const readingTime = useMemo(() => {
    return post ? getReadingTime(post.content || "") : "1 min read";
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-xs text-zinc-400 dark:text-zinc-600 animate-pulse">
        <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Consulting Knowledge Database...</span>
      </div>
    );
  }

  // Fallback if missing or draft access forbidden
  if (!post || (post.status !== "published" && !isAdmin)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Note Not Discovered</h2>
        <p className="text-zinc-500 font-serif leading-relaxed">The knowledge note you searched may represent a private draft or has been retired.</p>
        <Link to="/" className="inline-flex items-center gap-1.5 text-indigo-500 hover:underline text-sm font-semibold">
          <ArrowLeft className="h-4 w-4" />
          <span>Return home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-10 justify-center">
      
      {/* READING CENTER COLUMN (Primary Article Container) */}
      <article className="w-full max-w-[680px] shrink-0 font-sans">
        {/* Cover image if loaded */}
        {post.coverImage && (
          <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden mb-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <img
              src={post.coverImage}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-fit-cover"
              loading="eager"
            />
          </div>
        )}

        {/* Section Path & Status indicators */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 select-none">
          <div className="flex items-center gap-1.5">
            <Link to="/" className="hover:text-indigo-500 hover:underline">Root</Link>
            <ChevronRight className="h-3 w-3" />
            {section && (
              <>
                <Link to={`/${section.slug}`} className="hover:text-indigo-500 hover:underline">
                  {section.icon} {section.name}
                </Link>
                <ChevronRight className="h-3 w-3" />
              </>
            )}
            <span className="text-zinc-850 dark:text-zinc-400 truncate max-w-[150px] font-semibold">{post.title}</span>
          </div>

          <div className="flex items-center gap-2">
            {post.status !== "published" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-500 text-[10px] font-extrabold flex shrink-0">
                <EyeOff className="h-3 w-3" />
                <span>{post.status}</span>
              </span>
            )}

            {isAdmin && (
              <Link
                to={`/admin/editor/${post.id}`}
                className="inline-flex items-center gap-1 text-indigo-500 hover:underline"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Note</span>
              </Link>
            )}
          </div>
        </div>

        {/* Title Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold font-sans tracking-tight text-zinc-900 dark:text-white leading-tight">
          {post.title}
        </h1>

        {/* Meta Stats Row */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400 border-b border-zinc-150 dark:border-zinc-800 pb-5 mt-4 select-none">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readingTime}</span>
          </span>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 ml-auto">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-805 rounded text-[11px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Render compiled rich markdown content blocks */}
        <PostBody content={post.content} isDarkMode={document.documentElement.classList.contains("dark")} />

        {/* Connections Network Section at bottom */}
        <RelatedPosts relatedIds={post.links} allPosts={posts} sections={sections} />
      </article>

      {/* FLOATING TABLE-OF-CONTENTS PANEL FOR DESKTOP (STICKY LEFT COL) */}
      <TableOfContents content={post.content} />
    </div>
  );
};
