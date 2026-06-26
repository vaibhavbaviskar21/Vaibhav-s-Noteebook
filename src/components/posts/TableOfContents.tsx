import React, { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TOCEntry {
  text: string;
  level: number;
  id: string;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [toc, setToc] = useState<TOCEntry[]>([]);

  useEffect(() => {
    // Regular expression to discover markdown headers
    const headerRegex = /^(#{2,3})\s+(.*)$/gm;
    const entries: TOCEntry[] = [];
    
    let match;
    while ((match = headerRegex.exec(content)) !== null) {
      const level = match[1].length; // number of # (2 or 3)
      const text = match[2].trim();
      // Generate ID matching slugifier rules
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      entries.push({ text, level, id });
    }
    
    setToc(entries);
  }, [content]);

  if (toc.length === 0) return null;

  return (
    <nav className="hidden lg:block w-56 xl:w-64 sticky top-24 self-start space-y-4 max-h-[75vh] overflow-y-auto pr-4 scrollbar">
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">
        <List className="h-4 w-4 text-indigo-500" />
        <span>Table of Contents</span>
      </div>

      <ul className="space-y-2.5 text-xs font-sans">
        {toc.map((entry, idx) => (
          <li
            key={idx}
            style={{ paddingLeft: `${(entry.level - 2) * 12}px` }}
            className={`transition border-l border-zinc-200 dark:border-zinc-800 pl-3 -ml-px hover:border-indigo-500 dark:hover:border-indigo-500`}
          >
            <button
              onClick={() => {
                // Find element and scroll to it smoothly
                const element = document.getElementById(entry.id);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  // Fallback: search for h2 or h3 with matching inner text
                  const elements = Array.from(document.querySelectorAll("h2, h3"));
                  const match = elements.find((el) => el.textContent === entry.text);
                  match?.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className="text-left py-0.5 font-medium hover:text-indigo-500 text-zinc-500 dark:text-zinc-400 transition-colors"
            >
              {entry.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
