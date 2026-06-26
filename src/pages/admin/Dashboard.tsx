import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, FileText, CheckCircle, Clock, EyeOff, LayoutGrid, Settings, ArrowRight, Kanban, Ban, Key } from "lucide-react";
import { useApp } from "../../lib/AppContext";
import { formatDate } from "../../lib/seo";
import { getCountdownString } from "../../lib/scheduler";

export const Dashboard: React.FC = () => {
  const { posts, sections, folders, isAdmin, isLoading, logout } = useApp();
  const navigate = useNavigate();

  // Sort and filter stats
  const drafts = useMemo(() => posts.filter((p) => p.status === "draft"), [posts]);
  const scheduled = useMemo(() => posts.filter((p) => p.status === "scheduled"), [posts]);
  const publishedCount = useMemo(() => posts.filter((p) => p.status === "published").length, [posts]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-xs text-zinc-400 dark:text-zinc-650 animate-pulse">
        <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Opening Administrator Vault...</span>
      </div>
    );
  }

  // Redirect or prompt if not authorized
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20 text-center space-y-4 font-sans animate-fade-in select-none">
        <div className="p-3.5 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-2xl w-14 h-14 mx-auto flex items-center justify-center">
          <Ban className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Admin Clearance Required</h2>
        <p className="text-zinc-500 text-xs leading-relaxed max-w-xs mx-auto font-serif">
          Access to this dashboard is private. Please click the <Key className="h-3 w-3 inline text-indigo-400 mx-0.5" /> key in the navigation header and submit your admin secret passcode to continue.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold text-xs hover:bg-indigo-600 transition"
        >
          <ArrowRight className="h-4 w-4" />
          <span>Exit Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans select-none animate-fade-in">
      
      {/* Stats header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-850 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Admin Backoffice</h1>
          <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-widest font-bold">Personal Vault Manager</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/folders"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer bg-white dark:bg-zinc-900"
          >
            <LayersIcon className="h-4 w-4 text-indigo-500" />
            <span>Manage Folders</span>
          </Link>

          <Link
            to="/admin/settings"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer bg-white dark:bg-zinc-900"
          >
            <Settings className="h-4 w-4 text-indigo-400" />
            <span>Workspace Settings</span>
          </Link>

          <Link
            to="/admin/editor/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 font-bold text-xs shadow transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Note</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border border-zinc-200/60 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-900/10 shadow-sm space-y-1">
          <span className="text-xs font-mono text-zinc-400 font-semibold tracking-wider uppercase block">Total Sections</span>
          <span className="text-2xl font-extrabold text-zinc-850 dark:text-white block">{sections.length}</span>
        </div>

        <div className="p-4 border border-zinc-200/60 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-900/10 shadow-sm space-y-1">
          <span className="text-xs font-mono text-zinc-400 font-semibold tracking-wider uppercase block">Folders Group</span>
          <span className="text-2xl font-extrabold text-zinc-850 dark:text-white block">{folders.length}</span>
        </div>

        <div className="p-4 border border-zinc-200/60 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-900/10 shadow-sm space-y-1">
          <span className="text-xs font-mono text-zinc-400 font-semibold tracking-wider uppercase block">Public Garden Notes</span>
          <span className="text-2xl font-extrabold text-[#10b981] block">{publishedCount}</span>
        </div>

        <div className="p-4 border border-zinc-200/60 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-900/10 shadow-sm space-y-1">
          <span className="text-xs font-mono text-zinc-400 font-semibold tracking-wider uppercase block">Drafts & Schedules</span>
          <span className="text-2xl font-extrabold text-indigo-500 block">{drafts.length + scheduled.length}</span>
        </div>
      </div>

      {/* Main body content blocks split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* DRAFTS - Left 2 Column lists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden bg-white/70 dark:bg-zinc-900/10">
            <div className="px-5 py-4 border-b border-zinc-150 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-950/60 flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-500" />
                <span>Unpublished Drafts ({drafts.length})</span>
              </h3>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-850">
              {drafts.length === 0 ? (
                <div className="py-12 px-5 text-center text-xs font-mono text-zinc-400 dark:text-zinc-600 italic">No floating draft notes detected.</div>
              ) : (
                drafts.map((d) => {
                  const s = sections.find((sec) => sec.id === d.sectionId);
                  return (
                    <div key={d.id} className="p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 flex items-center justify-between gap-4 transition-all group">
                      <div className="space-y-1 truncate">
                        <Link to={`/admin/editor/${d.id}`} className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-indigo-500 block truncate">
                          {d.title || "Untitled Note"}
                        </Link>
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                          {s && (
                            <span className="flex items-center gap-0.5">
                              <span>{s.icon}</span>
                              <span className="hover:underline">{s.name}</span>
                            </span>
                          )}
                          <span className="opacity-40">•</span>
                          <span>Last edited {formatDate(d.updatedAt)}</span>
                        </div>
                      </div>
                      
                      <Link to={`/admin/editor/${d.id}`} className="shrink-0 text-xs text-indigo-500 font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Edit</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* SCHEDULES - Right column lists */}
        <div className="space-y-6">
          <div className="border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden bg-white/70 dark:bg-zinc-900/10">
            <div className="px-5 py-4 border-b border-zinc-150 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-950/60">
              <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>Scheduled Releases ({scheduled.length})</span>
              </h3>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-850 select-none">
              {scheduled.length === 0 ? (
                <div className="py-12 px-5 text-center text-xs font-mono text-zinc-400 dark:text-zinc-650 italic">No scheduled launches.</div>
              ) : (
                scheduled.map((s) => {
                  const rawSec = sections.find((sec) => sec.id === s.sectionId);
                  const countdown = getCountdownString(s.scheduledAt);
                  return (
                    <div key={s.id} className="p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 space-y-2 transition">
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/admin/editor/${s.id}`} className="text-xs font-semibold text-zinc-850 dark:text-zinc-200 hover:text-indigo-400 line-clamp-1">
                          {s.title}
                        </Link>
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-500 text-[9.5px] font-bold shrink-0">
                          {countdown}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 dark:text-zinc-550">
                        <span>{rawSec?.name || "Notebook"}</span>
                        <span>Date: {formatDate(s.scheduledAt)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal mini layers logo
const LayersIcon = ({ className }: { className: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m11.142-4.5l4.179 2.25-4.179 2.25M12 5.25L18 8.25l-6 3-6-3 6-3zM12 11.25l6 3-6 3-6-3 6-3zM12 17.25l6 3-6 3-6-3 6-3z" />
    </svg>
  );
};
