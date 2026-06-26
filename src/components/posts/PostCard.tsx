import React from "react";
import { Link } from "react-router-dom";
import { Clock, Calendar, ChevronRight, CornerRightDown } from "lucide-react";
import { Post, Section } from "../../types";
import { formatDate, getReadingTime } from "../../lib/seo";

interface PostCardProps {
  post: Post;
  sections: Section[];
}

export const PostCard: React.FC<PostCardProps> = ({ post, sections }) => {
  const section = sections.find((s) => s.id === post.sectionId);
  const readingTime = getReadingTime(post.content || "");

  return (
    <article className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-zinc-950/40 hover:-translate-y-0.5 transition-all flex flex-col h-full">
      {/* Cover image if specified */}
      {post.coverImage && (
        <Link to={`/${section?.slug || "blog"}/${post.slug}`} className="block overflow-hidden h-40">
          <img
            src={post.coverImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-fit-cover hover:scale-105 transition-all duration-300"
            loading="lazy"
          />
        </Link>
      )}

      {/* Contents */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div className="space-y-2">
          {/* Section Breadcrumb & Meta */}
          <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-mono font-semibold uppercase tracking-wider">
            {section && (
              <Link to={`/${section.slug}`} className="hover:underline flex items-center gap-1">
                <span>{section.icon}</span>
                <span>{section.name}</span>
              </Link>
            )}
            {post.status === "scheduled" && (
              <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-500 font-semibold tracking-normal text-[10px]">
                Scheduled
              </span>
            )}
            {post.status === "draft" && (
              <span className="ml-auto px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-semibold tracking-normal text-[10px]">
                Draft
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold font-sans tracking-tight text-zinc-900 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400">
            <Link to={`/${section?.slug || "blog"}/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {/* Slogan excerpt */}
          <p className="text-sm font-sans leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-3">
            {post.excerpt || "No summary write-up provided."}
          </p>
        </div>

        <div className="space-y-3.5 pt-2">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-150-custom dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 bg-zinc-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta and Footer information */}
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{readingTime}</span>
              </span>
            </div>

            <Link
              to={`/${section?.slug || "blog"}/${post.slug}`}
              className="group-hover:translate-x-1 transition-all hover:text-indigo-500 font-semibold flex items-center gap-0.5"
            >
              <span>Read</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
