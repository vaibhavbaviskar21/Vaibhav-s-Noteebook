import React from "react";
import { Globe } from "lucide-react";
import { slugify } from "../../lib/seo";

interface SEOPreviewProps {
  title: string;
  excerpt: string;
  sectionSlug: string;
}

export const SEOPreview: React.FC<SEOPreviewProps> = ({ title, excerpt, sectionSlug }) => {
  const brand = "Vaibhav's Brain";
  const slugified = slugify(title || "untitled-note");
  const url = `https://vaibhavsbrain.com/${sectionSlug || "blog"}/${slugified}`;

  return (
    <div className="border border-zinc-200 dark:border-zinc-850 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-950 space-y-3 font-sans">
      <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-200/50 dark:border-zinc-800 pb-1.5">
        <Globe className="h-3.5 w-3.5" />
        <span>Google SEO Emulator</span>
      </div>

      <div className="space-y-1">
        {/* Breadcrumb bread crumbs */}
        <div className="text-xs text-zinc-600 dark:text-zinc-400 truncate flex items-center gap-1 select-none">
          <span>vaibhavsbrain.com</span>
          <span className="opacity-40">›</span>
          <span className="truncate">{sectionSlug || "blog"}</span>
          <span className="opacity-40">›</span>
          <span className="truncate text-zinc-400 dark:text-zinc-500 font-mono text-[10px]">{slugified}</span>
        </div>

        {/* Title */}
        <h4 className="text-lg text-[#1a0dab] dark:text-[#8ab4f8] font-medium leading-normal hover:underline cursor-pointer">
          {title ? `${title} | ${brand}` : `Untitled Note | ${brand}`}
        </h4>

        {/* Excerpt Snippet */}
        <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2">
          {excerpt ? excerpt : "No short lead description configured yet. Search engines will automatically scrape the opening lines of your markdown body content instead."}
        </p>
      </div>
    </div>
  );
};
