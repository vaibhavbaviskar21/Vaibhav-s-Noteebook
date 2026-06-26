import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { ArrowLeft, Save, Eye, CheckCircle, RotateCw, Image, HelpCircle, Link as LinkIcon } from "lucide-react";
import { useApp } from "../../lib/AppContext";
import { Post, Section, Folder } from "../../types";
import { ImageUploader } from "../../components/editor/ImageUploader";
import { SEOPreview } from "../../components/editor/SEOPreview";
import { SchedulePanel } from "../../components/editor/SchedulePanel";
import { getPost, supabase } from "../../lib/supabase";
import { slugify } from "../../lib/seo";

export const PostEditor: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    posts,
    sections,
    folders,
    addOrUpdatePost,
    isAdmin,
    isLoading: contextLoading,
  } = useApp();

  const isNew = !postId;

  // Active post state
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveTick, setAutoSaveTick] = useState<string | null>(null);

  // Field states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [folderId, setFolderId] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled" | "private">("draft");
  const [scheduledAt, setScheduledAt] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [linkedIds, setLinkedIds] = useState<string[]>([]);

  // Ref container to track changes for auto-save without state closure locks
  const fieldsRef = useRef({ title, content, excerpt, tagsInput, sectionId, folderId, status, scheduledAt, coverImage, linkedIds });
  fieldsRef.current = { title, content, excerpt, tagsInput, sectionId, folderId, status, scheduledAt, coverImage, linkedIds };

  // Fetch or initialize post details
  useEffect(() => {
    async function loadPost() {
      setIsLoading(true);
      if (isNew) {
        // Create clean template
        const defaultSec = searchParams.get("sectionId") || (sections[0]?.id || "");
        const defaultFol = searchParams.get("folderId") || "";

        setPost({
          id: `post-${Date.now()}`,
          sectionId: defaultSec,
          folderId: defaultFol ? defaultFol : null,
          title: "",
          slug: "",
          content: "",
          excerpt: "",
          tags: [],
          status: "draft",
          scheduledAt: null,
          publishedAt: null,
          coverImage: null,
          links: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        setSectionId(defaultSec);
        setFolderId(defaultFol);
      } else {
        try {
          const loaded = await getPost(postId!);
          if (loaded) {
            setPost(loaded);
            setTitle(loaded.title || "");
            setContent(loaded.content || "");
            setExcerpt(loaded.excerpt || "");
            setTagsInput((loaded.tags || []).join(", "));
            setSectionId(loaded.sectionId || "");
            setFolderId(loaded.folderId || "");
            setStatus(loaded.status || "draft");
            setCoverImage(loaded.coverImage || null);
            setLinkedIds(loaded.links || []);

            if (loaded.scheduledAt) {
              const d = new Date(loaded.scheduledAt);
              setScheduledAt(isNaN(d.getTime()) ? "" : d.toISOString());
            } else {
              setScheduledAt("");
            }
          } else {
            alert("This document post does not exist.");
            navigate("/admin");
          }
        } catch (err) {
          console.error("Failed to load post detail:", err);
        }
      }
      setIsLoading(false);
    }

    if (!contextLoading) {
      loadPost();
    }
  }, [postId, isNew, sections, contextLoading, searchParams, navigate]);

  // Save changes helper
  const handleSave = async (silent = false) => {
    if (!post) return;

    // Validation
    const currentFields = fieldsRef.current;
    if (!currentFields.title.trim()) {
      if (!silent) alert("A note title is required to write a file draft.");
      return;
    }
    if (!currentFields.sectionId) {
      if (!silent) alert("Please specify the targeting Workspace Section branch.");
      return;
    }

    if (!silent) setIsSaving(true);

    const tagsArr = currentFields.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const generatedSlug = slugify(currentFields.title);

    const targetPost: Post = {
      ...post,
      title: currentFields.title.trim(),
      slug: generatedSlug,
      content: currentFields.content,
      excerpt: currentFields.excerpt.trim() || currentFields.content.substring(0, 160).replace(/[#*`]/g, ""),
      tags: tagsArr,
      sectionId: currentFields.sectionId,
      folderId: currentFields.folderId || null,
      status: currentFields.status,
      scheduledAt: currentFields.status === "scheduled" && currentFields.scheduledAt ? new Date(currentFields.scheduledAt) : null,
      publishedAt: currentFields.status === "published" ? (post.publishedAt ? post.publishedAt : new Date()) : null,
      coverImage: currentFields.coverImage,
      links: currentFields.linkedIds,
      updatedAt: new Date(),
    };

    try {
      await addOrUpdatePost(targetPost);
      if (!silent) {
        setIsSaving(false);
        navigate("/admin");
      } else {
        const timeStr = new Date().toLocaleTimeString();
        setAutoSaveTick(`Saved draft at ${timeStr}`);
      }
    } catch (e) {
      console.error(e);
      if (!silent) {
        setIsSaving(false);
        alert("Failed to write draft to storage.");
      }
    }
  };

  // 30-Second Background Auto Save Cycle
  useEffect(() => {
    if (!post || isNew) return;

    const interval = setInterval(() => {
      handleSave(true);
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [post, isNew]);

  // Listen to Cmd+S hotkey
  useEffect(() => {
    const triggerHotkeys = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave(false);
      }
    };
    window.addEventListener("keydown", triggerHotkeys);
    return () => window.removeEventListener("keydown", triggerHotkeys);
  }, [post]);

  // Filter folders matching selected section
  const sectionFolders = folders.filter((f) => f.sectionId === sectionId);

  // Filter possible linked posts (exclude current note)
  const candidatePosts = posts.filter((p) => p.id !== post?.id);

  const toggleLinkConnection = (targetId: string) => {
    setLinkedIds((prev) => {
      if (prev.includes(targetId)) {
        return prev.filter((id) => id !== targetId);
      }
      return [...prev, targetId];
    });
  };

  // Direct image insertion helper into MDEditor
  const insertInlineImageIntoText = (url: string) => {
    const textToInsert = `\n![Image file description](${url})\n`;
    setContent((prev) => prev + textToInsert);
  };

  // Paste helper to upload images directly from clipboard paste
  const handleEditorPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        // Image found! Stop default pasting of raw data
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        if (!post?.id) {
          alert("Please specify a note title first to generate a valid post ID before pasting images.");
          return;
        }

        const placeholder = `\n![Uploading image...]()\n`;
        setContent((prev) => prev + placeholder);

        try {
          const folder = "content";
          const safeFilename = encodeURIComponent(file.name ? file.name.replace(/\s+/g, "_") : `pasted_${Date.now()}.png`);
          const storagePath = `${folder}/${post.id}/${Date.now()}_${safeFilename}`;

          const { data, error } = await supabase.storage
            .from("portfolio")
            .upload(storagePath, file, {
              cacheControl: '3600',
              upsert: true
            });
          if (error) throw error;

          const { data: urlData } = supabase.storage
            .from("portfolio")
            .getPublicUrl(storagePath);
          const downloadUrl = urlData.publicUrl;

          setContent((prev) => prev.replace(placeholder, `\n![Pasted Image](${downloadUrl})\n`));
        } catch (err) {
          console.error("Paste upload failed:", err);
          alert("Failed to upload pasted image.");
          setContent((prev) => prev.replace(`\n![Uploading image...]()\n`, ""));
        }
      }
    }
  };

  if (contextLoading || isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-xs text-zinc-400 dark:text-zinc-650 animate-pulse">
        <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Configuring workspace tables...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-sm py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Admin Authentication Required</h2>
        <p className="text-xs text-zinc-400">Unlock Vaibhav's Brain first to draft and compile journals.</p>
        <Link to="/" className="text-xs text-indigo-500 hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5 font-sans animate-fade-in select-none">

      {/* Title & Toolbar Actions */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-850 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">
              {isNew ? "Assemble New Note" : "Refine Knowledge Document"}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-zinc-450 dark:text-zinc-505 uppercase tracking-widest font-bold">
                ID: {post?.id}
              </span>
              {autoSaveTick && (
                <span className="text-[10px] font-mono text-[#10b981] font-semibold">
                  {autoSaveTick}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-indigo-500 text-white font-bold text-xs hover:bg-indigo-600 transition shadow cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <RotateCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{isNew ? "Create Post" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Primary Workspace split: Left/Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* EDIT PANEL (W-Left 3 Col split) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Top forms values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/10 shadow-sm">
            {/* Title Entry */}
            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-455">Workspace Title Header</label>
              <input
                type="text"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-base font-bold bg-transparent rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-505 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Section Link */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-455">Branch Section</label>
              <select
                value={sectionId}
                onChange={(e) => {
                  setSectionId(e.target.value);
                  setFolderId(""); // reset sub folder
                }}
                className="w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800 dark:text-zinc-200"
              >
                <option value="">Choose Branch Section...</option>
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.icon} {sec.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Folder Link */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-455">Target Folder directory</label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                disabled={!sectionId}
                className="w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-505 text-zinc-805 dark:text-zinc-205 disabled:opacity-40"
              >
                <option value="">Section Root directory...</option>
                {sectionFolders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags comma split input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-455">Tag keywords</label>
              <input
                type="text"
                placeholder="dsa, binary-tree, coding (split by commas)"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400"
              />
            </div>
          </div>

          {/* Raw excerpt container */}
          <div className="space-y-1.5 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/10 shadow-sm">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-455">Lead Teaser Summary</label>
            <textarea
              placeholder="Provide a small preview summary of this notebook page content..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-550 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 resize-none font-sans"
            />
          </div>

          {/* MDEditor Container split pane */}
          <div className="space-y-1">
            <div className="flex items-center justify-between pb-1 select-none">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-455">Markdown Prose editor</label>
              <span className="text-[10px] font-mono text-zinc-450 dark:text-zinc-500">Cmd+S: Save Draft • Cmd+Shift+P: Preview</span>
            </div>

            <div
              className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm"
              onPaste={handleEditorPaste}
            >
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || "")}
                height={500}
                preview="live"
                hideToolbar={false}
              />
            </div>
          </div>
        </div>

        {/* METADATA SIDEBAR PANEL (W-Right Right 1 Col split) */}
        <aside className="space-y-6">
          {/* cover image */}
          <div className="border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 bg-white/70 dark:bg-zinc-900/10 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-505 uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800 pb-2 select-none">
              <Image className="h-4 w-4 text-indigo-500" />
              <span>Hero Cover Image</span>
            </h3>

            {coverImage && (
              <div className="w-full h-32 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 relative shadow-sm select-none">
                <img src={coverImage} alt="Cover preview" referrerPolicy="no-referrer" className="w-full h-full object-fit-cover" />
              </div>
            )}

            <ImageUploader
              postId={postId || post?.id || "temp-id"}
              type="cover"
              currentUrl={coverImage}
              onUploaded={setCoverImage}
            />
          </div>

          {/* Inline elements helper */}
          <div className="border border-zinc-200 dark:border-zinc-855 rounded-2xl p-5 bg-white/70 dark:bg-zinc-900/10 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-505 uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800 pb-2 select-none">
              <Image className="h-4 w-4 text-teal-500" />
              <span>Inline Note Media</span>
            </h3>

            <p className="text-[10px] text-zinc-450 dark:text-zinc-500 leading-normal font-sans">
              Need to upload images inside your markdown notes? Drop them here to generate a file link and insert it seamlessly.
            </p>

            <ImageUploader
              postId={postId || post?.id || "temp-id"}
              type="content"
              currentUrl={null}
              onUploaded={insertInlineImageIntoText}
            />
          </div>

          {/* Scheduling controls panel */}
          <SchedulePanel
            status={status}
            onChangeStatus={setStatus}
            scheduledAt={scheduledAt}
            onChangeScheduledAt={setScheduledAt}
          />

          {/* Link dependencies checkboxes tracker */}
          <div className="border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 bg-white/70 dark:bg-zinc-900/10 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-505 uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800 pb-2 select-none">
              <LinkIcon className="h-4 w-4 text-indigo-500 animate-pulse" />
              <span>Link Dependencies</span>
            </h3>

            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal font-sans">
              Configure relationships (edges) in our interactive mind map. Selected notes will link to this node.
            </p>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 font-sans">
              {candidatePosts.length === 0 ? (
                <p className="text-[10px] text-zinc-400 dark:text-zinc-600 italic">No notes created in list yet.</p>
              ) : (
                candidatePosts.map((cp) => {
                  const checked = linkedIds.includes(cp.id);
                  const candidateSec = sections.find((s) => s.id === cp.sectionId);
                  return (
                    <label key={cp.id} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-450 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleLinkConnection(cp.id)}
                        className="mt-0.5 h-3.5 w-3.5 accent-indigo-500 border-zinc-300 rounded text-indigo-600"
                      />
                      <span className="truncate">
                        <span className="opacity-60">{candidateSec?.icon} </span>
                        <span>{cp.title || "Untitled"}</span>
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Teaser Preview emulator */}
          <SEOPreview
            title={title}
            excerpt={excerpt}
            sectionSlug={sections.find((s) => s.id === sectionId)?.slug || "blog"}
          />
        </aside>

      </div>
    </div>
  );
};
