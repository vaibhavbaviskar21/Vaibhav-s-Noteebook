import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Folder, Hash, ArrowUp, ArrowDown, Trash2, Layers, Tags } from "lucide-react";
import { useApp } from "../../lib/AppContext";
import { Section, Folder as FolderType } from "../../types";

export const FoldersManager: React.FC = () => {
  const {
    sections,
    folders,
    posts,
    addOrUpdateSection,
    removeSection,
    addOrUpdateFolder,
    removeFolder,
    isAdmin,
    isLoading,
  } = useApp();

  const [activeSectionId, setActiveSectionId] = useState<string>("all");

  // New Section inputs
  const [newSecName, setNewSecName] = useState("");
  const [newSecSlug, setNewSecSlug] = useState("");
  const [newSecIcon, setNewSecIcon] = useState("📂");

  // Filter folders matching selected branch
  const visibleFolders = useMemo(() => {
    if (activeSectionId === "all") return folders;
    return folders.filter((f) => f.sectionId === activeSectionId);
  }, [folders, activeSectionId]);

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecName.trim() || !newSecSlug.trim()) {
      alert("Please specify the targeting section name and URL slug.");
      return;
    }

    const nextSec: Section = {
      id: `sec-${Date.now()}`,
      name: newSecName.trim(),
      slug: newSecSlug.trim().toLowerCase().replace(/\s+/g, "-"),
      icon: newSecIcon.trim() || "📁",
      order: sections.length + 1,
    };

    try {
      await addOrUpdateSection(nextSec);
      setNewSecName("");
      setNewSecSlug("");
      setNewSecIcon("📂");
    } catch (err) {
      alert("Failed to write Section profile.");
    }
  };

  const handleDeleteSection = async (id: string, sName: string) => {
    if (sections.length <= 1) {
      alert("Vaibhav's Brain requires at least one namespace branch to route postings.");
      return;
    }
    if (!confirm(`Are you sure you want to delete section "${sName}"? Child folders and posts inside this category will remain available elsewhere.`)) return;
    try {
      await removeSection(id);
    } catch (err) {
      alert("Failed to purge Section.");
    }
  };

  // Reorder Sections Helper
  const moveSection = async (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= sections.length) return;

    const currentSec = { ...sections[index], order: sections[nextIndex].order };
    const siblingSec = { ...sections[nextIndex], order: sections[index].order };

    // Swap positions
    const temp = currentSec.order;
    currentSec.order = siblingSec.order;
    siblingSec.order = temp;

    await addOrUpdateSection(currentSec);
    await addOrUpdateSection(siblingSec);
  };

  // Reorder Folders Helper
  const moveFolder = async (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= visibleFolders.length) return;

    const currentFol = { ...visibleFolders[index] };
    const siblingFol = { ...visibleFolders[nextIndex] };

    // Swap order
    const temp = currentFol.order;
    currentFol.order = siblingFol.order;
    siblingFol.order = temp;

    await addOrUpdateFolder(currentFol);
    await addOrUpdateFolder(siblingFol);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-xs text-zinc-400 dark:text-zinc-650 animate-pulse">
        <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Opening Section Blueprint Config...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-sm py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-805 dark:text-white">Admin Clearance Required</h2>
        <Link to="/" className="text-xs text-indigo-500 hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans select-none animate-fade-in">
      
      {/* Title Header */}
      <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-850 pb-5">
        <Link
          to="/admin"
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Ecosystem Architecture</h1>
          <p className="text-xs font-mono text-zinc-400 mt-1 uppercase tracking-widest font-bold">Configure branches and nested directories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Section Categories Manager Form */}
        <div className="space-y-6">
          <div className="border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 bg-white/70 dark:bg-zinc-900/10 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-505 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-indigo-505" />
              <span>Create Workspace Section</span>
            </h3>

            <form onSubmit={handleCreateSection} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500">Section Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Code Challenges"
                  value={newSecName}
                  onChange={(e) => {
                    setNewSecName(e.target.value);
                    if (!newSecSlug) {
                      setNewSecSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                    }
                  }}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-800 dark:text-zinc-205 focus:border-indigo-550 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500">URL Slug</label>
                  <input
                    type="text"
                    placeholder="code-labs"
                    value={newSecSlug}
                    onChange={(e) => setNewSecSlug(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-800 dark:text-zinc-205 focus:border-indigo-550 focus:outline-none"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500">Emoji Icon</label>
                  <input
                    type="text"
                    placeholder="🎯"
                    value={newSecIcon}
                    onChange={(e) => setNewSecIcon(e.target.value)}
                    className="w-full text-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-800 dark:text-zinc-205 focus:border-indigo-550 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-505 bg-indigo-500 text-white font-bold text-xs hover:bg-indigo-600 shadow transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Branch Section</span>
              </button>
            </form>
          </div>

          {/* Sibling branches lists */}
          <div className="border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden bg-white/70 dark:bg-zinc-900/10">
            <div className="px-5 py-4 border-b border-zinc-150 bg-zinc-50 dark:bg-zinc-950/60 text-xs font-mono font-bold text-zinc-400 dark:text-zinc-505 uppercase tracking-widest">
              Sections Reordering ({sections.length})
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-850">
              {sections.map((sec, idx) => {
                const secPosts = posts.filter((p) => p.sectionId === sec.id);
                return (
                  <div key={sec.id} className="p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 flex items-center justify-between gap-4 transition">
                    <div className="space-y-0.5 truncate">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-850 dark:text-zinc-100">
                        <span>{sec.icon}</span>
                        <span className="truncate">{sec.name}</span>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400">
                        /{sec.slug} • {secPosts.length} post documents
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveSection(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 rounded text-zinc-400 hover:text-indigo-500 hover:bg-zinc-100 dark:hover:bg-zinc-850 disabled:opacity-20 shrink-0"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => moveSection(idx, "down")}
                        disabled={idx === sections.length - 1}
                        className="p-1 rounded text-zinc-400 hover:text-indigo-500 hover:bg-zinc-100 dark:hover:bg-zinc-850 disabled:opacity-20 shrink-0"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(sec.id, sec.name)}
                        className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-zinc-150-custom hover:bg-zinc-100 dark:hover:bg-zinc-850 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Nested Folders hierarchy viewer and manager */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden bg-white/70 dark:bg-zinc-900/10 shadow-sm">
            
            {/* Folder filter header */}
            <div className="px-5 py-4 border-b border-zinc-150 bg-zinc-50 dark:bg-zinc-950/60 flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-mono font-bold text-zinc-405 dark:text-zinc-505 uppercase tracking-widest flex items-center gap-1.5">
                <Folder className="h-4 w-4 text-emerald-500" />
                <span>Folders Directory</span>
              </h3>

              <select
                value={activeSectionId}
                onChange={(e) => setActiveSectionId(e.target.value)}
                className="bg-transparent border-0 font-sans text-xs font-semibold text-indigo-500 focus:ring-0 focus:outline-none cursor-pointer"
              >
                <option value="all">📁 All Sections Folders</option>
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.icon} {sec.name} Folders
                  </option>
                ))}
              </select>
            </div>

            {/* Folder Tree Reorder lists */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-850">
              {visibleFolders.length === 0 ? (
                <div className="py-16 text-center text-xs font-mono text-zinc-400 dark:text-zinc-650 italic">
                  No folders configured in this subsection subset directory context.
                </div>
              ) : (
                visibleFolders.map((fol, index) => {
                  const folPosts = posts.filter((p) => p.folderId === fol.id);
                  const parent = folders.find((f) => f.id === fol.parentFolderId);
                  const folSec = sections.find((s) => s.id === fol.sectionId);
                  
                  return (
                    <div key={fol.id} className="p-4 hover:bg-zinc-55 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 flex items-center justify-between gap-4 transition">
                      <div className="space-y-1.5 truncate">
                        <div className="flex items-center gap-1.5">
                          <Folder className="h-4 w-4 text-zinc-400 shrink-0" />
                          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">{fol.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                          {folSec && <span className="text-indigo-400">{folSec.icon} {folSec.name}</span>}
                          {parent && (
                            <>
                              <span className="opacity-40">/</span>
                              <span>Parent: {parent.name}</span>
                            </>
                          )}
                          <span className="opacity-40">•</span>
                          <span>{folPosts.length} post{folPosts.length !== 1 ? "s" : ""}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => moveFolder(index, "up")}
                          disabled={index === 0}
                          className="p-1 rounded text-zinc-400 hover:text-indigo-505 hover:bg-zinc-100 dark:hover:bg-zinc-850 disabled:opacity-20"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveFolder(index, "down")}
                          disabled={index === visibleFolders.length - 1}
                          className="p-1 rounded text-zinc-400 hover:text-indigo-505 hover:bg-zinc-100 dark:hover:bg-zinc-850 disabled:opacity-20"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Delete folder directory "${fol.name}"? Child documents will remain safe in root.`)) {
                              await removeFolder(fol.id);
                            }
                          }}
                          className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-850"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
