import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Network, Info } from "lucide-react";
import { useApp } from "../lib/AppContext";
import { GraphCanvas } from "../components/graph/GraphCanvas";
import { updateSEOHeaders } from "../lib/seo";

export const GraphView: React.FC = () => {
  const { posts, sections, settings, isLoading } = useApp();

  React.useEffect(() => {
    updateSEOHeaders("Interactive Mind Map", "A full-screen interactive mind map tracking project dependencies, task sequences, and ideas inside Vaibhav's Brain.", null, settings);
  }, [settings]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-xs text-zinc-400 dark:text-zinc-650 animate-pulse">
        <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Constructing Interactive Mind Map...</span>
      </div>
    );
  }

  // Filter only published notes for public viewing
  const publishedOnly = posts.filter((p) => p.status === "published");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 h-[80vh] flex flex-col gap-4 font-sans select-none animate-fade-in">
      
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-850 pb-4 shrink-0 flex-wrap gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            <Link to="/" className="hover:text-indigo-500 hover:underline">Root</Link>
            <span>›</span>
            <span>Knowledge Graph</span>
          </div>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Network className="h-6 w-6 text-indigo-500" />
            <span>Vaibhav's Brain Mind Map</span>
          </h2>
        </div>

        {/* Informative counts badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800">
          <Info className="h-4 w-4 text-indigo-400" />
          <span>Tracking {publishedOnly.length} published thought nodes</span>
        </div>
      </div>

      {/* Main Graph Space block */}
      <div className="flex-grow min-h-0 w-full rounded-2xl overflow-hidden shadow-sm">
        <GraphCanvas posts={posts} sections={sections} />
      </div>
    </div>
  );
};
