import React, { useState } from "react";
import { Folder, FolderPlus, FilePlus, ChevronDown, ChevronRight, Hash, Trash2 } from "lucide-react";
import { Folder as FolderType, Post, Section } from "../../types";

interface FolderTreeProps {
  section: Section;
  folders: FolderType[];
  posts: Post[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  selectedPostId?: string | null;
  onSelectPost?: (post: Post) => void;
  isAdmin?: boolean;
  onCreateFolder?: (parentId: string | null) => void;
  onCreatePost?: (folderId: string | null) => void;
  onDeleteFolder?: (id: string) => void;
}

export const FolderTree: React.FC<FolderTreeProps> = ({
  section,
  folders,
  posts,
  selectedFolderId,
  onSelectFolder,
  selectedPostId,
  onSelectPost,
  isAdmin = false,
  onCreateFolder,
  onCreatePost,
  onDeleteFolder,
}) => {
  // Local storage persisted expand/collapse states for folder IDs
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem(`expanded-folders-${section.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleExpand = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders((prev) => {
      const next = { ...prev, [folderId]: !prev[folderId] };
      localStorage.setItem(`expanded-folders-${section.id}`, JSON.stringify(next));
      return next;
    });
  };

  // Filter folders matching current section
  const sectionFolders = folders.filter((f) => f.sectionId === section.id);

  // Helper to build recursive folder structures
  const renderFolderNode = (folder: FolderType, depth = 0) => {
    const isExpanded = !!expandedFolders[folder.id];
    const isSelected = selectedFolderId === folder.id;
    
    // Find child folders
    const childFolders = sectionFolders.filter((f) => f.parentFolderId === folder.id);
    
    // Find posts in this folder
    const folderPosts = posts.filter((p) => p.folderId === folder.id);

    return (
      <div key={folder.id} className="select-none font-sans">
        {/* Folder row */}
        <div
          onClick={() => onSelectFolder(folder.id)}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
          className={`group flex items-center justify-between h-9 rounded-lg cursor-pointer text-sm font-medium transition ${
            isSelected
              ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          <div className="flex items-center gap-1.5 overflow-hidden flex-grow mr-2">
            {/* Collapse toggle arrow */}
            <button
              onClick={(e) => toggleExpand(folder.id, e)}
              className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-600 transition"
            >
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
            
            <Folder className={`h-4 w-4 shrink-0 ${isSelected ? "text-indigo-500" : "text-zinc-400"}`} />
            
            <span className="truncate">{folder.name}</span>
          </div>

          {/* Quick Controls panel inside folder row */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 px-2 transition-all">
            {isAdmin && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreatePost?.(folder.id);
                  }}
                  title="New post in this folder"
                  className="p-1 rounded text-zinc-400 hover:text-indigo-500 hover:bg-zinc-200 dark:hover:bg-zinc-850 shrink-0"
                >
                  <FilePlus className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateFolder?.(folder.id);
                  }}
                  title="New sub-folder"
                  className="p-1 rounded text-zinc-400 hover:text-indigo-500 hover:bg-zinc-200 dark:hover:bg-zinc-850 shrink-0"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFolder?.(folder.id);
                  }}
                  title="Delete folder"
                  className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-850 shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
            
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-150 rounded px-1.5">
              {folderPosts.length}
            </span>
          </div>
        </div>

        {/* Retractable children layer */}
        {isExpanded && (
          <div className="space-y-0.5 mt-0.5 border-l border-zinc-100 dark:border-zinc-800 ml-3.5">
            {/* Recursive Folders */}
            {childFolders.map((child) => renderFolderNode(child, depth + 1))}

            {/* Render Notes as leaves if selectable */}
            {onSelectPost &&
              folderPosts.map((post) => {
                const isPostSelected = selectedPostId === post.id;
                return (
                  <div
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    style={{ paddingLeft: `${(depth + 1) * 14 + 18}px` }}
                    className={`flex items-center h-8 rounded-md cursor-pointer text-xs font-mono transition ${
                      isPostSelected
                        ? "bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-500 font-semibold"
                        : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-950"
                    }`}
                  >
                    <Hash className="h-3.5 w-3.5 shrink-0 opacity-40 mr-1" />
                    <span className="truncate">{post.title}</span>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  };

  // Find root level folders for that section (where parent is null, or empty, or not matching existing section nested folders)
  const rootFolders = sectionFolders.filter(
    (f) => !f.parentFolderId || !sectionFolders.some((p) => p.id === f.parentFolderId)
  );

  // Posts at the section root (not in any folder)
  const rootPosts = posts.filter((p) => p.sectionId === section.id && !p.folderId);

  return (
    <div className="space-y-4">
      {/* Search folder section root filter button */}
      <div>
        <button
          onClick={() => onSelectFolder(null)}
          className={`w-full flex items-center justify-between px-3 h-10 rounded-lg text-sm font-semibold transition ${
            selectedFolderId === null
              ? "bg-indigo-500 text-white shadow-sm"
              : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-base">{section.icon}</span>
            <span>All {section.name} Notes</span>
          </span>
          <span className="text-xs font-mono opacity-80">{posts.filter((p) => p.sectionId === section.id).length}</span>
        </button>
      </div>

      {/* Directory Trees / Roots */}
      <div className="space-y-1">
        {rootFolders.map((f) => renderFolderNode(f, 0))}

        {rootFolders.length === 0 && (
          <div className="py-2 px-3 text-center text-xs font-mono text-zinc-400 dark:text-zinc-600">
            No directories configured.
          </div>
        )}

        {/* Sections root-notes list if selectable */}
        {onSelectPost && rootPosts.length > 0 && (
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 mt-2 space-y-0.5">
            <div className="px-3 text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-600">
              Root Notes
            </div>
            {rootPosts.map((post) => {
              const isPostSelected = selectedPostId === post.id;
              return (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className={`flex items-center h-8 px-3 rounded-md cursor-pointer text-xs font-mono transition ${
                    isPostSelected
                      ? "bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-500 font-semibold"
                      : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-950"
                  }`}
                >
                  <Hash className="h-3.5 w-3.5 shrink-0 opacity-45 mr-1" />
                  <span className="truncate">{post.title}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin Quick Options bar */}
      {isAdmin && (
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2">
          <button
            onClick={() => onCreateFolder?.(null)}
            className="flex-grow flex items-center justify-center gap-1.5 px-3 py-1.5 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-lg text-xs font-semibold text-zinc-400 dark:text-zinc-500 transition-all cursor-pointer bg-transparent"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            <span>Add Directory</span>
          </button>
          
          <button
            onClick={() => onCreatePost?.(null)}
            className="flex-grow flex items-center justify-center gap-1.5 px-3 py-1.5 border border-dashed border-zinc-350 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-lg text-xs font-semibold text-zinc-450 dark:text-zinc-500 transition-all cursor-pointer bg-transparent"
          >
            <FilePlus className="h-3.5 w-3.5" />
            <span>Create Note</span>
          </button>
        </div>
      )}
    </div>
  );
};
