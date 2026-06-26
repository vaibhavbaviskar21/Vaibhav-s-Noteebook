import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, FolderClosed, Menu, LayoutGrid, FileText, ArrowLeft, Layers } from "lucide-react";
import { useApp } from "../lib/AppContext";
import { FolderTree } from "../components/folders/FolderTree";
import { PostCard } from "../components/posts/PostCard";
import { updateSEOHeaders } from "../lib/seo";

export const SectionDetail: React.FC = () => {
  const { sectionSlug } = useParams<{ sectionSlug: string }>();
  const { posts, folders, sections, isAdmin, addOrUpdateFolder, removeFolder, addOrUpdatePost, isLoading } = useApp();
  
  const navigate = useNavigate();

  // Selected folder state
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Identify active section
  const section = useMemo(() => {
    return sections.find((s) => s.slug === sectionSlug);
  }, [sections, sectionSlug]);

  // Set SEO headers
  React.useEffect(() => {
    if (section) {
      updateSEOHeaders(`${section.icon} ${section.name}`, `Explore directories and journals inside ${section.name}.`, null);
    }
  }, [section]);

  // Filter posts matching section slug and status
  const sectionPosts = useMemo(() => {
    if (!section) return [];
    return posts.filter((p) => {
      const matchSection = p.sectionId === section.id;
      const isPublic = p.status === "published";
      const isAuthorized = isPublic || isAdmin;
      return matchSection && isAuthorized;
    });
  }, [posts, section, isAdmin]);

  // Filter active directory path selection
  const filteredPosts = useMemo(() => {
    if (selectedFolderId === null) return sectionPosts;
    return sectionPosts.filter((p) => p.folderId === selectedFolderId);
  }, [sectionPosts, selectedFolderId]);

  // Root folders in current section
  const sectionFoldersList = useMemo(() => {
    if (!section) return [];
    return folders.filter((f) => f.sectionId === section.id);
  }, [folders, section]);

  // Handle new folder additions (if logged in)
  const handleCreateFolder = async (parentId: string | null) => {
    if (!section) return;
    const name = prompt("Enter folder name:");
    if (!name?.trim()) return;

    try {
      const folderId = `fol-${Date.now()}`;
      await addOrUpdateFolder({
        id: folderId,
        sectionId: section.id,
        parentFolderId: parentId,
        name: name.trim(),
        order: sectionFoldersList.length + 1,
      });
    } catch (err) {
      alert("Failed to create folder category.");
    }
  };

  // Handle deletion of folders (if logged in)
  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Are you sure you want to delete this folder? Posts in this directory will remain available at the root level.")) return;
    try {
      await removeFolder(folderId);
      // Remap post references
      const affected = posts.filter((p) => p.folderId === folderId);
      for (const p of affected) {
        await addOrUpdatePost({ ...p, folderId: null });
      }
      if (selectedFolderId === folderId) {
        setSelectedFolderId(null);
      }
    } catch (err) {
      alert("Failed to purge folder.");
    }
  };

  // Handle quick note creation inside active directory node
  const handleCreateNoteShortcut = (folderId: string | null) => {
    if (!section) return;
    navigate(
      `/admin/editor/new?sectionId=${section.id}&folderId=${folderId || ""}`
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-xs text-zinc-400 dark:text-zinc-650 animate-pulse">
        <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Opening Directory Backplane...</span>
      </div>
    );
  }

  // Fallback if section doesn't match
  if (!section) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Directory Branch Not Found</h2>
        <p className="text-zinc-500 font-serif leading-relaxed">The branch path you traveled does not exist in our system.</p>
        <Link to="/" className="inline-flex items-center gap-1 text-indigo-500 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          <span>Return home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      
      {/* bread crumb header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="space-y-1 select-none">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            <Link to="/" className="hover:text-indigo-500 hover:underline">Root</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-800 dark:text-zinc-300 font-sans font-semibold tracking-normal uppercase">{section.name}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <span className="text-3xl select-none">{section.icon}</span>
            <span>{section.name} Workspace</span>
          </h2>
        </div>

        {/* Mobile controls toggle */}
        <div className="flex sm:hidden gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex-grow flex items-center justify-center gap-2 px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 rounded-xl bg-white dark:bg-zinc-900 text-sm font-semibold cursor-pointer text-zinc-700 dark:text-zinc-300"
          >
            <Menu className="h-4 w-4 text-indigo-500" />
            <span>Folder Index ({sectionFoldersList.length})</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* DESKTOP SIDEBAR - Collapsible Folder Tree */}
        <aside className="hidden lg:block w-64 xl:w-72 shrink-0 self-start border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 bg-white/70 dark:bg-zinc-900/10">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-850 pb-2 mb-4">
            <Layers className="h-4 w-4 text-indigo-500 animate-pulse" />
            <span>Folder Hierarchy</span>
          </div>

          <FolderTree
            section={section}
            folders={folders}
            posts={sectionPosts}
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
            isAdmin={isAdmin}
            onCreateFolder={handleCreateFolder}
            onCreatePost={handleCreateNoteShortcut}
            onDeleteFolder={handleDeleteFolder}
          />
        </aside>

        {/* MOBILE SIDE-DRAWER SHEET OVERLAY */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm">
            <div className="w-80 h-full bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between border-r border-zinc-200 dark:border-zinc-850 shadow-2xl animate-slide-right">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">Workspace Folders</h3>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xs font-mono font-bold px-2.5 py-1 bg-zinc-100 dark:bg-zinc-850 text-zinc-500 rounded-lg"
                  >
                    Close
                  </button>
                </div>

                <FolderTree
                  section={section}
                  folders={folders}
                  posts={sectionPosts}
                  selectedFolderId={selectedFolderId}
                  onSelectFolder={(id) => {
                    setSelectedFolderId(id);
                    setIsMobileMenuOpen(false); // Auto-hide menu on click
                  }}
                  isAdmin={isAdmin}
                  onCreateFolder={handleCreateFolder}
                  onCreatePost={handleCreateNoteShortcut}
                  onDeleteFolder={handleDeleteFolder}
                />
              </div>
            </div>
          </div>
        )}

        {/* POSTS LIST SECTION PANEL */}
        <section className="flex-grow space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest select-none">
              <FolderClosed className="h-4 w-4 text-indigo-500" />
              <span>Visible Notes</span>
              <span className="opacity-40">({filteredPosts.length})</span>
            </div>

            {isAdmin && (
              <Link
                to={`/admin/editor/new?sectionId=${section.id}&folderId=${selectedFolderId || ""}`}
                className="text-xs text-indigo-500 font-bold hover:underline"
              >
                + New Document
              </Link>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-2xl max-w-md mx-auto">
              <FolderClosed className="h-8 w-8 text-zinc-300 dark:text-zinc-650 mx-auto mb-3" />
              <p className="text-sm font-semibold font-sans text-zinc-650 dark:text-zinc-400 italic">No notes found matching current subset filter.</p>
              <button
                onClick={() => setSelectedFolderId(null)}
                className="text-xs text-indigo-500 hover:underline font-bold mt-2"
              >
                Clear current folder filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} sections={sections} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
