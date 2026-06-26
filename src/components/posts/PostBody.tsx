import React, { useState, useEffect } from "react";
import { renderMarkdown } from "../../lib/markdown";

interface PostBodyProps {
  content: string;
  isDarkMode?: boolean;
}

export const PostBody: React.FC<PostBodyProps> = ({ content, isDarkMode = false }) => {
  const [renderedHtml, setRenderedHtml] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    async function compile() {
      setIsCompiling(true);
      try {
        const html = await renderMarkdown(content, isDarkMode);
        if (active) {
          setRenderedHtml(html);
        }
      } catch (err) {
        console.error("Syntax compiling failure:", err);
      } finally {
        if (active) {
          setIsCompiling(false);
        }
      }
    }

    compile();

    return () => {
      active = false;
    };
  }, [content, isDarkMode]);

  if (isCompiling) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-2.5 font-mono text-xs text-zinc-400 dark:text-zinc-500 animate-pulse">
        <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Compiling Markdown & Syntax Styling...</span>
      </div>
    );
  }

  return (
    <div 
      className="prose prose-zinc dark:prose-invert max-w-none line-height-1.8 font-serif text-[18px] text-zinc-800 dark:text-zinc-200 mt-6"
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
