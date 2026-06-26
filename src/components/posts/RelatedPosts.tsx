import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Link as LinkIcon } from "lucide-react";
import { Post, Section } from "../../types";

interface RelatedPostsProps {
  relatedIds: string[];
  allPosts: Post[];
  sections: Section[];
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ relatedIds, allPosts, sections }) => {
  if (!relatedIds || relatedIds.length === 0) return null;

  // Find posts matches
  const relatedList = allPosts.filter((p) => relatedIds.includes(p.id) && p.status === "published");

  if (relatedList.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      <h3 className="text-xl font-bold font-sans tracking-tight text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
        <LinkIcon className="h-5 w-5 text-indigo-500" />
        <span>Connected Brain Thoughts</span>
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {relatedList.map((post) => {
          const sec = sections.find((s) => s.id === post.sectionId);
          return (
            <Link
              key={post.id}
              to={`/${sec?.slug || "blog"}/${post.slug}`}
              className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group flex flex-col justify-between h-full"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-400 dark:text-zinc-500">
                  {sec?.icon} {sec?.name}
                </span>
                <h4 className="text-base font-semibold font-sans text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 mt-1">
                  {post.title}
                </h4>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-indigo-500 font-mono font-medium mt-3 justify-end group-hover:underline">
                <span>Navigate note</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
