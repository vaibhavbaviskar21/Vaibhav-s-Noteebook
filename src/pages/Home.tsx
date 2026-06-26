import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, BrainCircuit, Hash, Network, Zap } from "lucide-react";
import { useApp } from "../lib/AppContext";
import { PostCard } from "../components/posts/PostCard";
import { updateSEOHeaders } from "../lib/seo";
import { getDailyTechThought } from "../lib/thoughts";
import { GraphCanvas } from "../components/graph/GraphCanvas";

export const Home: React.FC = () => {
  const { posts, sections, settings, isLoading, isAdmin } = useApp();
  const [showMindMap, setShowMindMap] = useState(false);

  // Highlight page title automatically
  React.useEffect(() => {
    updateSEOHeaders("", settings.tagline || "Personal Knowledge Base & Blog", null, settings);
  }, [settings]);

  // Extract recent published items sorted chronologically
  const recentPublished = useMemo(() => {
    return posts
      .filter((p) => p.status === "published")
      .sort((a, b) => {
        const d1 = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const d2 = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return d2 - d1;
      })
      .slice(0, 8);
  }, [posts]);

  // Retrieve stable daily curated tech thought
  const dailyThought = useMemo(() => getDailyTechThought(), []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-xs text-zinc-400 dark:text-zinc-600">
        <div className="h-7 w-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Opening Digital Garden Workspace...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in font-sans select-none">
      {/* Sleek Minimal Welcome Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3.5 py-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-150 dark:border-indigo-900 border-indigo-100 text-[11px] font-bold font-mono text-indigo-500 uppercase tracking-widest mt-1">
          <BrainCircuit className="h-4 w-4 text-indigo-500" />
          <span>VAIBHAV'S KNOWLEDGE BACKPLANE</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold font-sans tracking-tight text-zinc-900 dark:text-white">
          {settings.title || "Vaibhav's Brain"}
        </h1>
        
        <p className="text-base text-zinc-600 dark:text-zinc-400 font-serif leading-relaxed italic">
          {settings.tagline || "Where personal notebooks meet a streamlined blogging digital garden."}
        </p>
      </div>

      {/* Curated Daily Tech Thought */}
      <div className="bg-zinc-100/40 dark:bg-zinc-900/10 border border-zinc-200/50 dark:border-zinc-850/60 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-[0.03] dark:opacity-[0.05] select-none pointer-events-none">
          <BrainCircuit className="h-32 w-32 text-indigo-500" />
        </div>
        
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          <Zap className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
          <span>Daily Tech Philosophical Insight</span>
          <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
          <span>Today</span>
        </div>

        <div className="space-y-2.5">
          <p className="text-lg sm:text-xl font-serif text-zinc-800 dark:text-zinc-350 leading-relaxed font-medium italic">
            "{dailyThought.quote}"
          </p>
          <div className="flex flex-wrap items-baseline gap-1.5 text-xs">
            <span className="font-bold text-zinc-900 dark:text-zinc-250">— {dailyThought.author}</span>
            <span className="text-zinc-400 dark:text-zinc-550 text-[11px]">({dailyThought.role})</span>
          </div>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed font-sans max-w-2xl border-t border-zinc-200/50 dark:border-zinc-800/40 pt-3.5">
          {dailyThought.context}
        </p>
      </div>

      {/* Primary Sections Bento Layout Panel */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-indigo-500" />
          <span>Ecosystem Branches</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((sec) => {
            const sectionPosts = posts.filter((p) => p.sectionId === sec.id && p.status === "published");
            return (
              <Link
                key={sec.id}
                to={`/${sec.slug}`}
                className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 hover:border-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shadow-sm flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-3xl mb-3 mt-1 filter drop-shadow-md select-none">{sec.icon}</div>
                  <h3 className="text-lg font-bold font-sans text-zinc-900 dark:text-white select-none">
                    {sec.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1 select-none">
                    {sectionPosts.length} published note{sectionPosts.length !== 1 ? "s" : ""}
                  </p>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-mono font-bold mt-4 justify-end group-hover:underline">
                  <span>Explore branch</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mind Map Connection Graph Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-2 flex-wrap gap-3">
          <div>
            <h2 className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Network className="h-4 w-4 text-indigo-500" />
              <span>Interactive Mind Map & Connection Graph</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-1 font-serif">
              A dynamic, reactive node diagram plotting the underlying associations and references between digital garden notes.
            </p>
          </div>
          <button
            onClick={() => setShowMindMap(!showMindMap)}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 bg-white/50 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-350 hover:text-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-all shrink-0 shadow-xs"
          >
            {showMindMap ? "Hide Mind Map" : "Load Mind Map"}
          </button>
        </div>

        {showMindMap ? (
          <div className="h-[400px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm relative">
            <GraphCanvas posts={posts} sections={sections} />
          </div>
        ) : (
          <div 
            onClick={() => setShowMindMap(true)}
            className="group cursor-pointer rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 p-8 text-center hover:border-indigo-500/50 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/25 transition-all duration-300 shadow-xs"
          >
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 group-hover:scale-110 transition-transform">
              <Network className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-zinc-800 dark:text-zinc-250">
              Interactive Association Mapping
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-450 max-w-sm mx-auto font-serif">
              Explore the graphical web linking DSA notes, system architectures, and blog chapters.
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 group-hover:underline"
            >
              <span>Load Knowledge Graph</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Recent Notes Grid Panel */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
          <h2 className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Hash className="h-4 w-4 text-indigo-500" />
            <span>Recent Notes & Publications</span>
          </h2>

          <Link
            to="/search"
            className="text-xs text-indigo-500 hover:underline font-semibold font-mono flex items-center gap-1"
          >
            <span>Fuzzy query notes</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentPublished.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl max-w-md mx-auto">
            <p className="text-xs text-zinc-500 font-semibold font-mono">No published notes discovered in garden yet.</p>
            {isAdmin && (
              <Link to="/admin" className="text-xs text-indigo-500 hover:underline font-bold mt-2 inline-block">
                Create standard note draft
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPublished.map((post) => (
              <PostCard key={post.id} post={post} sections={sections} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
